"use client";

import { useEffect, useRef, useState } from "react";
import { ShadedBackgroundRenderer } from "./render";

/** Base render method */
const getTimeInSeconds = () => Date.now() / 1000;

type ShadedBackgroundProps = {};
const ShadedBackground = (props: ShadedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    // Initialise WebGL renderer and start render loop
    const renderer = new ShadedBackgroundRenderer(canvas);
    renderer.init();
    setReady(true);

    let animationFrameId: number;
    let lastFrameTime = getTimeInSeconds();

    const render = () => {
      const time = getTimeInSeconds();
      const delta = time - lastFrameTime;
      lastFrameTime = time;

      renderer.render(delta);
      animationFrameId = requestAnimationFrame(render);
    };

    const onResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      renderer.onResize();
    };

    onResize();
    render();
    addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full max-w-full h-full transition-opacity duration-1500 ${ready ? "opacity-100" : "opacity-0"}`}
      {...props}
    />
  );
};

export default ShadedBackground;
