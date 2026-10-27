import { spaceVertexShader } from "./space-shaders";

const blurShader = `
precision highp float;
uniform sampler2D uImage;
uniform vec2 uResolution;
uniform vec2 uStep;
uniform float uExtract;

vec3 sampleLight(vec2 uv) {
  vec3 color = texture2D(uImage, uv).rgb;
  float brightness = max(color.r, max(color.g, color.b));
  return color * mix(1.0, smoothstep(0.50, 0.82, brightness), uExtract);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec3 light = sampleLight(uv) * 0.227027;
  light += sampleLight(uv + uStep * 1.384615) * 0.316216;
  light += sampleLight(uv - uStep * 1.384615) * 0.316216;
  light += sampleLight(uv + uStep * 3.230769) * 0.070270;
  light += sampleLight(uv - uStep * 3.230769) * 0.070270;
  gl_FragColor = vec4(light, 1.0);
}
`;

const compositeShader = `
precision highp float;
uniform sampler2D uScene;
uniform sampler2D uGlow;
uniform vec2 uResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec3 scene = texture2D(uScene, uv).rgb;
  vec3 glow = texture2D(uGlow, uv).rgb;
  // A screen blend gives highlights headroom while keeping surface contrast.
  gl_FragColor = vec4(scene + (1.0 - scene) * glow * 0.55, 1.0);
}
`;

type Target = { texture: WebGLTexture; framebuffer: WebGLFramebuffer; width: number; height: number };
type Pass = { program: WebGLProgram; position: number };

/** Full-resolution scene with a two-pass, quarter-resolution highlight blur. */
export function createSpaceBloom(gl: WebGLRenderingContext) {
  const programs: WebGLProgram[] = [];
  const shaders: WebGLShader[] = [];
  const buffer = gl.createBuffer();
  let targets: Target[] = [];
  let width = 1;
  let height = 1;

  function destroyTargets() {
    targets.forEach((target) => {
      gl.deleteTexture(target.texture);
      gl.deleteFramebuffer(target.framebuffer);
    });
    targets = [];
  }

  function dispose() {
    destroyTargets();
    programs.forEach((program) => gl.deleteProgram(program));
    shaders.forEach((shader) => gl.deleteShader(shader));
    gl.deleteBuffer(buffer);
  }

  function createPass(fragment: string): Pass {
    const program = gl.createProgram();
    if (!program) throw new Error("Could not create glow program");
    programs.push(program);
    for (const [type, source] of [[gl.VERTEX_SHADER, spaceVertexShader], [gl.FRAGMENT_SHADER, fragment]] as const) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Could not create glow shader");
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "Glow shader failed");
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Could not link glow program");
    return { program, position: gl.getAttribLocation(program, "aPosition") };
  }

  let blur: Pass;
  let composite: Pass;
  try {
    if (!buffer) throw new Error("Could not create glow buffer");
    blur = createPass(blurShader);
    composite = createPass(compositeShader);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  } catch (error) {
    console.warn("Using direct space rendering", error);
    dispose();
    return null;
  }

  const blurImage = gl.getUniformLocation(blur.program, "uImage");
  const blurResolution = gl.getUniformLocation(blur.program, "uResolution");
  const blurStep = gl.getUniformLocation(blur.program, "uStep");
  const blurExtract = gl.getUniformLocation(blur.program, "uExtract");
  const sceneImage = gl.getUniformLocation(composite.program, "uScene");
  const glowImage = gl.getUniformLocation(composite.program, "uGlow");
  const compositeResolution = gl.getUniformLocation(composite.program, "uResolution");

  function createTarget(targetWidth: number, targetHeight: number) {
    const texture = gl.createTexture();
    const framebuffer = gl.createFramebuffer();
    if (!texture || !framebuffer) {
      gl.deleteTexture(texture);
      gl.deleteFramebuffer(framebuffer);
      throw new Error("Could not allocate glow target");
    }
    const target = { texture, framebuffer, width: targetWidth, height: targetHeight };
    targets.push(target);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, targetWidth, targetHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error("Glow target unavailable");
  }

  function resize(nextWidth: number, nextHeight: number) {
    if (nextWidth === width && nextHeight === height && targets.length === 3) return;
    width = nextWidth;
    height = nextHeight;
    destroyTargets();
    try {
      createTarget(width, height);
      createTarget(Math.max(1, Math.ceil(width / 4)), Math.max(1, Math.ceil(height / 4)));
      createTarget(Math.max(1, Math.ceil(width / 4)), Math.max(1, Math.ceil(height / 4)));
    } catch (error) {
      console.warn("Using direct space rendering", error);
      destroyTargets();
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  function bindPass(pass: Pass) {
    gl.useProgram(pass.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(pass.position);
    gl.vertexAttribPointer(pass.position, 2, gl.FLOAT, false, 0, 0);
  }

  function render(renderScene: () => void) {
    const [scene, horizontal, vertical] = targets;
    gl.bindFramebuffer(gl.FRAMEBUFFER, scene?.framebuffer ?? null);
    gl.viewport(0, 0, width, height);
    renderScene();
    if (!scene || !horizontal || !vertical) return;

    bindPass(blur);
    gl.uniform1i(blurImage, 0);
    gl.uniform2f(blurResolution, horizontal.width, horizontal.height);
    gl.viewport(0, 0, horizontal.width, horizontal.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, horizontal.framebuffer);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, scene.texture);
    gl.uniform2f(blurStep, 2 / horizontal.width, 0);
    gl.uniform1f(blurExtract, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindFramebuffer(gl.FRAMEBUFFER, vertical.framebuffer);
    gl.bindTexture(gl.TEXTURE_2D, horizontal.texture);
    gl.uniform2f(blurStep, 0, 2 / vertical.height);
    gl.uniform1f(blurExtract, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    bindPass(composite);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, width, height);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, scene.texture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, vertical.texture);
    gl.uniform1i(sceneImage, 0);
    gl.uniform1i(glowImage, 1);
    gl.uniform2f(compositeResolution, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  return { resize, render, dispose };
}
