
precision highp float;

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

    vec2 squareFagCoord = vec2(
        (normalizedFragCoord.x - 0.5) * (u_resolution.x / u_resolution.y) + 0.5,
        normalizedFragCoord.y
    );

    float maxLength = max(u_resolution.x / u_resolution.y, 1.0);
    float maxLength2 = maxLength * maxLength;

    // Initialize the final color to a dark blue/black
    vec3 finalColor = vec3(0.0, 0.0, 0.0);
    float sumFactor = 0.0;

    // Iterate through each point and calculate its influence
    for (int i = 0; i < NUM_POINTS; i++) {
        // Calculate the distance vector from the current pixel to the point
        vec2 distVector = squareFagCoord - u_points[i].position;
        
        // Calculate the squared distance for performance
        float dist2 = dot(distVector, distVector);
        float invDist2 = 0.0;
        if (dist2 > 0.0) {
            invDist2 = 1.0 / dist2;
        } else {
            invDist2 = 1.0 / 0.0001; // Prevent division by zero
        }

        float factor = u_points[i].intensity * invDist2;

        finalColor += u_points[i].color * factor;
        sumFactor += factor;
    }

    // Normalize the final color by the sum factor
    if (sumFactor > 0.0) {
        finalColor /= sumFactor;
    }

    // Output the final color
    gl_FragColor = vec4(finalColor, 1.0);
}