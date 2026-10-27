"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { spaceFragmentShader, spaceVertexShader } from "../lib/space-shaders";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export default function SpaceScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);
  const [paused, setPaused] = useState(false);
  const [rendererRevision, setRendererRevision] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );
  const moving = !paused && !reducedMotion;
  const playback = useRef({ moving, reducedMotion });
  const updatePlayback = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    playback.current = { moving, reducedMotion };
    updatePlayback.current?.();
  }, [moving, reducedMotion]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const lost = (event: Event) => {
      event.preventDefault();
      canvas.style.opacity = "0";
    };
    const restored = () => setRendererRevision((revision) => revision + 1);
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    return () => {
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
    };
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, powerPreference: "high-performance" });
    if (!gl) return;

    const shaders: WebGLShader[] = [];
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    if (!program || !buffer) return;

    try {
      for (const [type, source] of [[gl.VERTEX_SHADER, spaceVertexShader], [gl.FRAGMENT_SHADER, spaceFragmentShader]] as const) {
        const shader = gl.createShader(type);
        if (!shader) throw new Error("Could not create space shader");
        shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "Space shader failed");
        gl.attachShader(program, shader);
      }
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Could not link space scene");
    } catch (error) {
      console.warn("Using the still space scene", error);
      canvas.style.opacity = "0";
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "uResolution");
    const time = gl.getUniformLocation(program, "uTime");
    const pointer = gl.getUniformLocation(program, "uPointer");
    const focus = gl.getUniformLocation(program, "uFocus");
    const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    const maxRenderSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) as number;
    const anisotropy = gl.getExtension("EXT_texture_filter_anisotropic");
    const anisotropyLevel = anisotropy ? Math.min(8, gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number) : 1;
    const textures: WebGLTexture[] = [];
    const images: HTMLImageElement[] = [];
    const page = canvas.closest("main");
    if (page) page.dataset.spaceReady = "false";
    canvas.dataset.surface = "loading";
    canvas.dataset.rings = "loading";
    let disposed = false;

    function loadTexture(url: string, unit: number, uniform: string, radialStrip = false) {
      if (!gl) return;
      const texture = gl.createTexture();
      if (!texture) return;
      textures.push(texture);
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([185, 170, 142, 255]));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(gl.getUniformLocation(program, uniform), unit);

      const image = new Image();
      images.push(image);
      image.onload = () => {
        if (disposed || gl.isContextLost()) return;
        let source: TexImageSource = image;
        let width = image.naturalWidth;
        let height = image.naturalHeight;
        // The ring map repeats vertically. Preserve all radial detail in a single
        // row so WebGL 1 can mipmap it without altering the original asset.
        if (radialStrip || width > maxTexture || height > maxTexture) {
          const upload = document.createElement("canvas");
          const scale = Math.min(1, maxTexture / Math.max(width, height));
          upload.width = Math.max(1, Math.round(width * scale));
          upload.height = radialStrip ? 1 : Math.max(1, Math.round(height * scale));
          const context = upload.getContext("2d");
          if (!context) return;
          context.drawImage(image, 0, radialStrip ? Math.floor(height / 2) : 0, width, radialStrip ? 1 : height, 0, 0, upload.width, upload.height);
          source = upload;
          width = upload.width;
          height = upload.height;
        }
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        if ((width & (width - 1)) === 0 && (height & (height - 1)) === 0) {
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          if (anisotropy) gl.texParameterf(gl.TEXTURE_2D, anisotropy.TEXTURE_MAX_ANISOTROPY_EXT, anisotropyLevel);
        }
        if (canvas) canvas.dataset[radialStrip ? "rings" : "surface"] = "ready";
        draw();
        if (canvas?.dataset.surface === "ready" && canvas.dataset.rings === "ready") {
          if (page) page.dataset.spaceReady = "true";
          window.dispatchEvent(new Event("space-ready"));
        }
      };
      image.src = url;
    }

    let frame = 0;
    let lastFrame = 0;
    let arriving = document.documentElement.dataset.themeSwap === "alternate";
    const targetPointer = { x: 0, y: 0 };
    const currentPointer = { x: 0, y: 0 };

    function draw() {
      if (!gl || !canvas) return;
      currentPointer.x += (targetPointer.x - currentPointer.x) * 0.035;
      currentPointer.y += (targetPointer.y - currentPointer.y) * 0.035;
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, playback.current.reducedMotion ? 8 : elapsed.current);
      gl.uniform2f(pointer, currentPointer.x, currentPointer.y);
      gl.uniform2f(focus, 0.5, 0.5);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function render(now: number) {
      frame = 0;
      // Aim for smooth desktop motion; never catch up after a hidden tab.
      const frameInterval = canvas && canvas.clientWidth < 700 ? 1000 / 30 : 1000 / 60;
      if (now - lastFrame >= frameInterval - 0.5) {
        if (!arriving && lastFrame) elapsed.current += Math.min((now - lastFrame) / 1000, 0.08);
        lastFrame = now;
        draw();
      }
      if (playback.current.moving && !document.hidden && !gl?.isContextLost()) frame = requestAnimationFrame(render);
    }

    function start() {
      lastFrame = 0;
      if (playback.current.moving && !document.hidden && !frame) frame = requestAnimationFrame(render);
    }

    function resize() {
      if (!canvas || !gl) return;
      // Retina rendering up to a 4K pixel budget, within this GPU's limits.
      const pixels = canvas.clientWidth * canvas.clientHeight;
      const ratio = Math.min(
        Math.max(window.devicePixelRatio || 1, 1.5), 3,
        Math.sqrt(8_294_400 / Math.max(pixels, 1)),
        maxRenderSize / Math.max(canvas.clientWidth, canvas.clientHeight, 1),
      );
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
    }

    const arrive = () => { arriving = false; lastFrame = 0; };
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else start();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !playback.current.moving) return;
      targetPointer.x = event.clientX / window.innerWidth - 0.5;
      targetPointer.y = event.clientY / window.innerHeight - 0.5;
    };
    const leave = () => { targetPointer.x = 0; targetPointer.y = 0; };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("theme-arrived", arrive);
    document.addEventListener("visibilitychange", visibility);
    page?.addEventListener("pointermove", move);
    page?.addEventListener("pointerleave", leave);
    updatePlayback.current = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      draw();
      start();
    };
    loadTexture("/space/saturn-4k.jpg", 0, "uSurfaceMap");
    loadTexture("/space/saturn-rings-8k.png", 1, "uRingMap", true);
    resize();
    canvas.style.opacity = "1";
    start();

    return () => {
      disposed = true;
      updatePlayback.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("theme-arrived", arrive);
      document.removeEventListener("visibilitychange", visibility);
      page?.removeEventListener("pointermove", move);
      page?.removeEventListener("pointerleave", leave);
      images.forEach((image) => { image.onload = null; });
      textures.forEach((texture) => gl.deleteTexture(texture));
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [rendererRevision]);

  return (
    <>
      <div className="space-scene" aria-hidden="true">
        <div className="space-still"><div className="space-still-planet" /></div>
        <canvas ref={canvasRef} className="space-canvas" />
      </div>
      <div className="space-controls">
        <span className="space-coordinate">somewhere, out there</span>
        {!reducedMotion && (
          <button type="button" onClick={() => setPaused((value) => !value)}>
            <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span> {paused ? "resume orbit" : "pause orbit"}
          </button>
        )}
      </div>
    </>
  );
}
