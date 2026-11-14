import script from "./shaders/background.ts?inline";
import fragmentShaderSource from "./shaders/fragment.glsl";
import vertexShaderSource from "./shaders/vertex.glsl";

// Note: There should only be one instance of this component
const CANVAS_ID = "shaded-background";

/** Animated WebGL background, rendered by an inline script so it does not wait for React to load. */
export default function ShadedBackground() {
  return (
    <>
      <canvas id={CANVAS_ID} className="w-full max-w-full h-full" />
      <script
        data-canvas={CANVAS_ID}
        data-vertex={vertexShaderSource}
        data-fragment={fragmentShaderSource}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: our own script, inlined at build time
        dangerouslySetInnerHTML={{ __html: script }}
      />
    </>
  );
}
