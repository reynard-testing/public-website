"use client";

import { useEffect, useRef } from "react";
import { ShadedBackgroundRenderer } from "./render";

/** Base render method */
const getTimeInSeconds = () => Date.now() / 1000.0;

type ShadedBackgroundProps = {};
const ShadedBackground = (props: ShadedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const renderer = new ShadedBackgroundRenderer(canvas);
    renderer.init();

    let animationFrameId: number;
    const startTime = getTimeInSeconds();
    let lastFrame = startTime;

    const render = () => {
      const time = getTimeInSeconds();
      const delta = time - lastFrame;
      lastFrame = time;

      renderer.render(delta);
      animationFrameId = window.requestAnimationFrame(render);
    };

    const onResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      renderer.onResize();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "d" || event.key === "D") {
        const debugData = {
          renderer,
        };

        console.log("Debug Data:", debugData);
      }
    };

    onResize();
    render();
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="w-full max-w-full h-full" {...props} />
  );
};

export default ShadedBackground;
