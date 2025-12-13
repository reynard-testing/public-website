precision mediump float;

// Screen resolution for normalization
uniform vec2 u_resolution;

// Structure for a single gradient point
struct Point {
    vec3 color;
    vec2 position;
    float intensity;
};

// Array of points. The number must match the JS code.
#define NUM_POINTS 3
uniform Point u_points[NUM_POINTS];

void main() {
    // Normalize the fragment coordinate to a 0-1 range
    vec2 normalizedFragCoord = gl_FragCoord.xy / u_resolution;

    // We want to map to a square aspect ratio
    // 0-1 in y is kept, but the x is adjusted based on aspect ratio
    // So, if the screen is wider, we compress x towards the center
    vec2 squareFragCoord = vec2(
        (normalizedFragCoord.x - 0.5) * (u_resolution.x / u_resolution.y) + 0.5,
        normalizedFragCoord.y
    );

    vec3 colorSum = vec3(0.0, 0.0, 0.0);
    float factorSum = 0.0;

    for (int i = 0; i < NUM_POINTS; i++) {
        // Calculate the distance vector from the current pixel to the point
        vec2 distVector = squareFragCoord - u_points[i].position;
        
        // Calculate the squared distance for performance
        float dist2 = dot(distVector, distVector);
        float invDist2 = 0.0;
        if (dist2 > 0.0) {
            invDist2 = 1.0 / dist2;
        } else {
            invDist2 = 1.0 / 0.0001; // Prevent division by zero
        }

        float factor = u_points[i].intensity * invDist2;

        colorSum += u_points[i].color * factor;
        factorSum += factor;
    }

    // Normalize the final color by the sum factor
    if (factorSum > 0.0) {
        colorSum /= factorSum;
    }

    // Output the final color
    gl_FragColor = vec4(colorSum, 1.0);
}