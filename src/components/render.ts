import fragmentShaderSource from "./shaders/fragment.glsl";
import { createProgram } from "./shaders/opengl";
import vertexShaderSource from "./shaders/vertex.glsl";

type LightPoint = {
  x: number;
  y: number;
  color: [number, number, number];
  intensity: number;
};

type LightObjectLocation = {
  color: WebGLUniformLocation | null;
  position: WebGLUniformLocation | null;
  intensity: WebGLUniformLocation | null;
};

const ANIMATION_SPEED = 0.5; // radians per second

export class ShadedBackgroundRenderer {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;

  points: LightPoint[];

  positionLocation: number = -1;
  resolutionLocation: WebGLUniformLocation | null = null;
  pointLocations: LightObjectLocation[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl");

    // color: [240 / 256, 101 / 256, 2 / 256],
    // color: [240 / 256, 112 / 256, 22 / 256],
    // color: [240 / 256, 134 / 256, 60 / 256],

    this.points = [
      {
        x: 0.15,
        y: 0.05,
        color: [120 / 256, 50 / 256, 1 / 256],
        intensity: 1,
      },
      {
        x: 0.1,
        y: 0.95,
        color: [240 / 256, 101 / 256, 2 / 256],
        intensity: 1,
      },
      {
        x: 0.9,
        y: 0.45,
        color: [255 / 256, 168 / 256, 80 / 256],
        intensity: 0.5,
      },
    ];

    if (!gl) {
      throw new Error("WebGL is not supported by this browser.");
    }

    this.gl = gl;
  }

  init() {
    const program = createProgram(
      this.gl,
      vertexShaderSource,
      fragmentShaderSource,
    );

    this.gl.useProgram(program);

    // Get attribute and uniform locations
    this.positionLocation = this.gl.getAttribLocation(program, "a_position");
    this.resolutionLocation = this.gl.getUniformLocation(
      program,
      "u_resolution",
    );

    // Define the locations for the point uniforms
    for (let i = 0; i < 3; i++) {
      // Must match NUM_POINTS in the shader
      this.pointLocations.push({
        color: this.gl.getUniformLocation(program, `u_points[${i}].color`),
        position: this.gl.getUniformLocation(
          program,
          `u_points[${i}].position`,
        ),
        intensity: this.gl.getUniformLocation(
          program,
          `u_points[${i}].intensity`,
        ),
      });
    }

    // Create a buffer and populate it with a full-screen quad
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW,
    );

    // Set up the attribute pointer
    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.vertexAttribPointer(
      this.positionLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0,
    );
  }

  onResize() {
    if (!this.gl) {
      return;
    }

    this.gl.canvas.width = window.innerWidth;
    this.gl.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.uniform2f(
      this.resolutionLocation,
      this.gl.canvas.width,
      this.gl.canvas.height,
    );
  }

  render(deltaSeconds: number) {
    // Animate point positions
    this.points.forEach((p) => {
      // rotate each point around the center
      const angle = ANIMATION_SPEED * deltaSeconds; // rotation speed
      const cosAngle = Math.cos(angle);
      const sinAngle = Math.sin(angle);
      const x = p.x - 0.5;
      const y = p.y - 0.5;
      const newX = x * cosAngle - y * sinAngle;
      const newY = x * sinAngle + y * cosAngle;
      p.x = newX + 0.5;
      p.y = newY + 0.5;
    });

    // Update uniforms in the shader

    this.points.forEach((p, i) => {
      this.gl.uniform3fv(this.pointLocations[i].color, p.color);
      this.gl.uniform2f(this.pointLocations[i].position, p.x, p.y);
      this.gl.uniform1f(this.pointLocations[i].intensity, p.intensity);
    });

    // Draw the quad
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}
