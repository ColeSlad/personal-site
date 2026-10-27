"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { spaceFragmentShader, spaceVertexShader } from "../lib/space-shaders";
import { createSpaceBloom } from "../lib/space-bloom";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export default function SpaceScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const interactionRef = useRef<HTMLDivElement>(null);
  const camera = useRef({ azimuth: 0, elevation: 0, zoom: 1 });
  const cameraAction = useRef<((action: "in" | "out" | "reset") => void) | null>(null);
  const instructionsId = useId();
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
      const page = canvas.closest("main");
      if (page) page.dataset.spaceReady = "fallback";
    };
    const restored = () => setRendererRevision((revision) => revision + 1);
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    return () => {
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const interaction = interactionRef.current;
    if (!canvas || !interaction) return;
    let cleanup: (() => void) | undefined;
    let initialized = false;
    let setupFrame = 0;
    const initialize = () => {
      if (initialized) return;
      initialized = true;
      cleanup = initializeRenderer(canvas, interaction);
    };
    const queueSetup = () => {
      if (initialized || setupFrame) return;
      // Give the color sweep a painted frame before starting GPU work.
      setupFrame = requestAnimationFrame(() => {
        setupFrame = requestAnimationFrame(() => { setupFrame = 0; initialize(); });
      });
    };

    const root = document.documentElement;
    if (root.dataset.themeSwap === "alternate") {
      // Native view transitions freeze rendering until their snapshot is ready.
      // Avoid doing shader compilation and texture allocation in that pause.
      if (root.dataset.themePhase === "revealing") queueSetup();
      else window.addEventListener("theme-revealing", queueSetup, { once: true });
      window.addEventListener("theme-arrived", queueSetup, { once: true });
    } else initialize();

    return () => {
      cancelAnimationFrame(setupFrame);
      window.removeEventListener("theme-revealing", queueSetup);
      window.removeEventListener("theme-arrived", queueSetup);
      cleanup?.();
    };

    function initializeRenderer(canvas: HTMLCanvasElement, interaction: HTMLDivElement) {
      const page = canvas.closest("main");
      const showStill = () => {
        canvas.style.opacity = "0";
        if (page) page.dataset.spaceReady = "fallback";
        window.dispatchEvent(new Event("space-ready"));
      };
      const gl = canvas.getContext("webgl", { alpha: true, antialias: false, depth: false, stencil: false, powerPreference: "high-performance" });
      if (!gl) { showStill(); return; }

      const shaders: WebGLShader[] = [];
      const program = gl.createProgram();
      const buffer = gl.createBuffer();
      if (!program || !buffer) {
        gl.deleteProgram(program);
        gl.deleteBuffer(buffer);
        showStill();
        return;
      }

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
        showStill();
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
      const cameraUniform = gl.getUniformLocation(program, "uCamera");
      const focus = gl.getUniformLocation(program, "uFocus");
      const hardwareTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
      const maxTexture = Math.min(hardwareTextureSize, canvas.clientWidth < 700 ? 4096 : 8192);
      const maxRenderSize = Math.min(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) as number, hardwareTextureSize);
      const anisotropy = gl.getExtension("EXT_texture_filter_anisotropic");
      const anisotropyLevel = anisotropy ? Math.min(8, gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number) : 1;
      const textures: WebGLTexture[] = [];
      const images: HTMLImageElement[] = [];
      const bloom = createSpaceBloom(gl);
      if (page) page.dataset.spaceReady = "false";
      canvas.dataset.surface = "loading";
      canvas.dataset.jupiter = "loading";
      canvas.style.opacity = "0";
      let disposed = false;
      let texturesReady = false;

      function textureFailed(key: "surface" | "jupiter") {
        if (disposed || !canvas) return;
        canvas.dataset[key] = "error";
        // Keep the still scene visible and release any pending route transition.
        if (page) page.dataset.spaceReady = "error";
        window.dispatchEvent(new Event("space-ready"));
      }

      function loadTexture(url: string, unit: number, uniform: string, key: "surface" | "jupiter") {
        if (!gl) return;
        const texture = gl.createTexture();
        if (!texture) { textureFailed(key); return; }
        textures.push(texture);
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([185, 170, 142, 255]));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.useProgram(program);
        gl.uniform1i(gl.getUniformLocation(program, uniform), unit);

        const image = new Image();
        images.push(image);
        image.onload = () => {
          if (disposed || gl.isContextLost()) return;
          let source: TexImageSource = image;
          let width = image.naturalWidth;
          let height = image.naturalHeight;
          // Keep full desktop detail and fit the texture budget on smaller devices.
          if (width > maxTexture || height > maxTexture) {
            const upload = document.createElement("canvas");
            const scale = Math.min(1, maxTexture / Math.max(width, height));
            upload.width = Math.max(1, Math.round(width * scale));
            upload.height = Math.max(1, Math.round(height * scale));
            const context = upload.getContext("2d");
            if (!context) { textureFailed(key); return; }
            context.drawImage(image, 0, 0, width, height, 0, 0, upload.width, upload.height);
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
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            if (anisotropy) gl.texParameterf(gl.TEXTURE_2D, anisotropy.TEXTURE_MAX_ANISOTROPY_EXT, anisotropyLevel);
          }
          if (canvas) canvas.dataset[key] = "ready";
          if (canvas?.dataset.surface === "ready" && canvas.dataset.jupiter === "ready") {
            texturesReady = true;
            lastFrame = 0;
            draw();
            canvas.style.opacity = "1";
            if (page) page.dataset.spaceReady = "true";
            window.dispatchEvent(new Event("space-ready"));
            start();
          }
        };
        image.onerror = () => textureFailed(key);
        image.src = url;
      }

      let frame = 0;
      let lastFrame = 0;
      let needsDraw = false;
      let arriving = document.documentElement.dataset.themeSwap === "alternate";
      const pointers = new Map<number, { x: number; y: number }>();

      function renderScene() {
        if (!gl || !canvas) return;
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures[0] ?? null);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, textures[1] ?? null);
        gl.uniform2f(resolution, canvas.width, canvas.height);
        gl.uniform1f(time, playback.current.reducedMotion ? 8 : elapsed.current);
        gl.uniform3f(cameraUniform, camera.current.azimuth, camera.current.elevation, camera.current.zoom);
        gl.uniform2f(focus, 0.5, 0.5);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      function draw() {
        if (!gl || !canvas || !texturesReady) return;
        if (bloom) bloom.render(renderScene);
        else renderScene();
      }

      function render(now: number) {
        frame = 0;
        // Aim for smooth desktop motion; never catch up after a hidden tab.
        const frameInterval = canvas && canvas.clientWidth < 700 ? 1000 / 30 : 1000 / 60;
        if (now - lastFrame >= frameInterval - 0.5) {
          if (!arriving && playback.current.moving && pointers.size === 0 && lastFrame) {
            elapsed.current += Math.min((now - lastFrame) / 1000, 0.08);
          }
          lastFrame = now;
          needsDraw = false;
          draw();
        }
        if ((playback.current.moving || needsDraw) && !document.hidden && !gl?.isContextLost()) frame = requestAnimationFrame(render);
      }

      function start() {
        if (texturesReady && !arriving && (playback.current.moving || needsDraw) && !document.hidden && !frame && !gl?.isContextLost()) {
          lastFrame = 0;
          frame = requestAnimationFrame(render);
        }
      }

      function invalidate() {
        needsDraw = true;
        start();
      }

      function zoomBy(factor: number) {
        camera.current.zoom = Math.max(0.55, Math.min(1.85, camera.current.zoom * factor));
        invalidate();
      }

      function orbitBy(x: number, y: number) {
        camera.current.azimuth = (camera.current.azimuth - x) % (Math.PI * 2);
        camera.current.elevation = Math.max(-1.2, Math.min(1.2, camera.current.elevation + y));
        invalidate();
      }

      cameraAction.current = (action) => {
        if (action === "reset") {
          camera.current = { azimuth: 0, elevation: 0, zoom: 1 };
          invalidate();
        } else zoomBy(action === "in" ? 1 / 1.18 : 1.18);
      };

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
        bloom?.resize(canvas.width, canvas.height);
        draw();
      }

      const arrive = () => { arriving = false; lastFrame = 0; start(); };
      const visibility = () => {
        if (document.hidden) {
          cancelAnimationFrame(frame);
          frame = 0;
          pointers.clear();
          delete interaction.dataset.dragging;
        }
        else start();
      };
      const down = (event: PointerEvent) => {
        if (event.button !== 0) return;
        event.preventDefault();
        interaction.focus({ preventScroll: true });
        interaction.setPointerCapture(event.pointerId);
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        interaction.dataset.dragging = "true";
      };
      const pinchDistance = () => {
        const [a, b] = [...pointers.values()];
        return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
      };
      const move = (event: PointerEvent) => {
        const previous = pointers.get(event.pointerId);
        if (!previous) return;
        const previousDistance = pinchDistance();
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (pointers.size > 1) {
          const nextDistance = pinchDistance();
          if (previousDistance > 0 && nextDistance > 0) zoomBy(previousDistance / nextDistance);
        } else {
          const scale = Math.PI * 2 / Math.max(320, Math.min(interaction.clientWidth, interaction.clientHeight));
          orbitBy((event.clientX - previous.x) * scale, (event.clientY - previous.y) * scale);
        }
      };
      const up = (event: PointerEvent) => {
        pointers.delete(event.pointerId);
        if (interaction.hasPointerCapture(event.pointerId)) interaction.releasePointerCapture(event.pointerId);
        if (pointers.size === 0) {
          delete interaction.dataset.dragging;
          lastFrame = 0;
        }
      };
      const wheel = (event: WheelEvent) => {
        event.preventDefault();
        const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? interaction.clientHeight : 1);
        zoomBy(Math.exp(Math.max(-120, Math.min(120, pixels)) * 0.003));
      };
      const key = (event: KeyboardEvent) => {
        const step = event.shiftKey ? 0.16 : 0.06;
        switch (event.key) {
          case "ArrowLeft": orbitBy(-step, 0); break;
          case "ArrowRight": orbitBy(step, 0); break;
          case "ArrowUp": orbitBy(0, -step); break;
          case "ArrowDown": orbitBy(0, step); break;
          case "+": case "=": cameraAction.current?.("in"); break;
          case "-": case "_": cameraAction.current?.("out"); break;
          case "Home": cameraAction.current?.("reset"); break;
          default: return;
        }
        event.preventDefault();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);
      window.addEventListener("theme-arrived", arrive);
      document.addEventListener("visibilitychange", visibility);
      interaction.addEventListener("pointerdown", down);
      interaction.addEventListener("pointermove", move);
      interaction.addEventListener("pointerup", up);
      interaction.addEventListener("pointercancel", up);
      interaction.addEventListener("lostpointercapture", up);
      interaction.addEventListener("wheel", wheel, { passive: false });
      interaction.addEventListener("keydown", key);
      updatePlayback.current = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        draw();
        start();
      };
      loadTexture("/space/io-8k.webp", 0, "uSurfaceMap", "surface");
      loadTexture("/space/jupiter-4k.webp", 1, "uJupiterMap", "jupiter");
      resize();
      start();

      return () => {
        disposed = true;
        updatePlayback.current = null;
        cameraAction.current = null;
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener("theme-arrived", arrive);
        document.removeEventListener("visibilitychange", visibility);
        for (const pointerId of pointers.keys()) {
          if (interaction.hasPointerCapture(pointerId)) interaction.releasePointerCapture(pointerId);
        }
        delete interaction.dataset.dragging;
        interaction.removeEventListener("pointerdown", down);
        interaction.removeEventListener("pointermove", move);
        interaction.removeEventListener("pointerup", up);
        interaction.removeEventListener("pointercancel", up);
        interaction.removeEventListener("lostpointercapture", up);
        interaction.removeEventListener("wheel", wheel);
        interaction.removeEventListener("keydown", key);
        images.forEach((image) => { image.onload = null; image.onerror = null; });
        bloom?.dispose();
        textures.forEach((texture) => gl.deleteTexture(texture));
        shaders.forEach((shader) => gl.deleteShader(shader));
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
      };
    }
  }, [rendererRevision]);

  return (
    <>
      <div className="space-scene" aria-hidden="true">
        <div className="space-still">
          <div className="space-still-jupiter" />
          <div className="space-still-planet" />
        </div>
        <canvas ref={canvasRef} className="space-canvas" />
      </div>
      <div ref={interactionRef} className="space-interaction" tabIndex={0} role="region" aria-label="Explore Io" aria-describedby={instructionsId} />
      <p id={instructionsId} className="sr-only">Drag to orbit Io. Scroll or pinch to zoom. With the scene focused, use arrow keys to orbit, plus and minus to zoom, and Home to reset the view.</p>
      <div className="space-controls">
        {!reducedMotion && (
          <button type="button" aria-label={paused ? "Resume orbit" : "Pause orbit"} onClick={() => setPaused((value) => !value)}>
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              {paused
                ? <path d="M5 3.5 12 8l-7 4.5Z" fill="currentColor" />
                : <path d="M5 3.5v9m6-9v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
            </svg>
          </button>
        )}
      </div>
    </>
  );
}
