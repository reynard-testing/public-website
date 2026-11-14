// Runs as an inline <script> placed after the canvas, so the background
// starts while the HTML is parsed instead of after React has loaded.
// The canvas id and shader sources are passed in through the script's data attributes.
// Compiled as an IIFE (see next.config.ts), so nothing here leaks into the global scope.

type LightPoint = {
  x: number;
  y: number;
  color: [number, number, number];
  intensity: number;
};

type PointLocation = {
  color: WebGLUniformLocation | null;
  position: WebGLUniformLocation | null;
  intensity: WebGLUniformLocation | null;
};

// --- Configuration ---

const ANIMATION_SPEED = 0.5; // radians per second

// Must match NUM_POINTS in the fragment shader
const POINTS: LightPoint[] = [
  { x: 0.15, y: 0.05, color: [120 / 256, 50 / 256, 1 / 256], intensity: 1 },
  { x: 0.1, y: 0.95, color: [240 / 256, 101 / 256, 2 / 256], intensity: 1 },
  { x: 0.9, y: 0.45, color: [255 / 256, 168 / 256, 80 / 256], intensity: 0.5 },
];

// Two triangles covering the whole screen
const FULL_SCREEN_QUAD = new Float32Array([
  -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
]);

// --- WebGL setup ---

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram {
  const program = gl.createProgram();
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(
    program,
    compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource),
  );
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Shader program link error:", gl.getProgramInfoLog(program));
  }
  return program;
}

function bindFullScreenQuad(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
): void {
  const positionLocation = gl.getAttribLocation(program, "a_position");
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, FULL_SCREEN_QUAD, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
}

function getPointLocations(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
): PointLocation[] {
  return POINTS.map((_, i) => ({
    color: gl.getUniformLocation(program, `u_points[${i}].color`),
    position: gl.getUniformLocation(program, `u_points[${i}].position`),
    intensity: gl.getUniformLocation(program, `u_points[${i}].intensity`),
  }));
}

// --- Animation ---

/** Rotates each point around the center of the screen. */
function rotatePoints(points: LightPoint[], angle: number): void {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  for (const p of points) {
    const x = p.x - 0.5;
    const y = p.y - 0.5;
    p.x = x * cos - y * sin + 0.5;
    p.y = x * sin + y * cos + 0.5;
  }
}

// --- Entry point ---

function start(script: HTMLOrSVGScriptElement | null): void {
  const canvas = document.getElementById(script?.dataset.canvas ?? "");
  if (!script || !(canvas instanceof HTMLCanvasElement)) {
    console.error("Shaded background: canvas not found");
    return;
  }

  const gl = canvas.getContext("webgl");
  if (!gl) {
    return; // No WebGL: the container's background color stays visible
  }

  const program = createProgram(
    gl,
    script.dataset.vertex ?? "",
    script.dataset.fragment ?? "",
  );
  gl.useProgram(program);
  bindFullScreenQuad(gl, program);

  // Color and intensity never change, so they are uploaded once
  const pointLocations = getPointLocations(gl, program);
  POINTS.forEach((p, i) => {
    gl.uniform3fv(pointLocations[i].color, p.color);
    gl.uniform1f(pointLocations[i].intensity, p.intensity);
  });

  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const onResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
  };

  let lastFrameTime = performance.now() / 1000;
  const render = () => {
    const time = performance.now() / 1000;
    rotatePoints(POINTS, ANIMATION_SPEED * (time - lastFrameTime));
    lastFrameTime = time;

    POINTS.forEach((p, i) => {
      gl.uniform2f(pointLocations[i].position, p.x, p.y);
    });
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  };

  onResize();
  addEventListener("resize", onResize);
  render();
}

// Must run synchronously: currentScript is only set while this script executes
start(document.currentScript);
