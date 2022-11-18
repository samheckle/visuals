// #ifdef GL_ES
// precision mediump float;
// #endif
// uniform float u_time;
// uniform vec2 u_resolution;
// vec3 colorA = vec3(0.149, 0.141, 0.912);
// vec3 colorB = vec3(1.000, 0.833, 0.224);
// float random(vec2 st) {
//     return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) *
//         43758.5453123);
// }

// float noise (in vec2 st) {
//     vec2 i = floor(st);
//     vec2 f = fract(st);

//     // Four corners in 2D of a tile
//     float a = random(i);
//     float b = random(i + vec2(1.0, 0.0));
//     float c = random(i + vec2(0.0, 1.0));
//     float d = random(i + vec2(1.0, 1.0));

//     // Smooth Interpolation

//     // Cubic Hermine Curve.  Same as SmoothStep()
//     vec2 u = f*f*(3.0-2.0*f);
//     // u = smoothstep(0.,1.,f);

//     // Mix 4 coorners percentages
//     return mix(a, b, u.x) +
//             (c - a)* u.y * (1.0 - u.x) +
//             (d - b) * u.x * u.y;
// }
// void main() {
//                   // 1
//                   // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);

//                   // 2
//                   // vec3 color = vec3(0.0);

//                   // float pct = abs(sin(u_time));

//                   // // Mix uses pct (a value from 0-1) to
//                   // // mix the two colors
//                   // color = mix(colorA, colorB, pct);

//                   // gl_FragColor = vec4(color,1.0);

//                   // 3
//                   // vec2 st = gl_FragCoord.xy/u_resolution.xy;
//                   // st.x *= u_resolution.x/u_resolution.y;
//                   // vec3 color = vec3(0.0);
//                   // float d = 0.0;

//                   // // Remap the space to -1. to 1.
//                   // st = st *2.-1.;

//                   // // Make the distance field
//                   // d = length( abs(st)-.3 );

//                   // // Visualize the distance field
//                   // gl_FragColor = vec4(vec3(fract(d*10.0)),1.0);

//                   // 4
//     // vec2 st = gl_FragCoord.xy / u_resolution;
//     // vec3 color = vec3(0.0);

//     // st *= 3.0;      // Scale up the space by 3
//     // st = fract(st); // Wrap around 1.0

//     // color = vec3(st, 0.0);

//     // gl_FragColor = vec4(color, 1.0);

//     vec2 st = gl_FragCoord.xy/u_resolution.xy;

//     // Scale the coordinate system to see
//     // some noise in action
//     vec2 pos = vec2(st*u_time);

//     // Use the noise function
//     float n = noise(pos);

//     gl_FragColor = vec4(vec3(n), 1.0);
// }

// #ifdef GL_ES
// precision mediump float;
// #endif

// uniform vec2 u_resolution;
// uniform vec2 u_mouse;
// uniform float u_time;

// void main() {
//     vec2 st = gl_FragCoord.xy/u_resolution.xy;
//     st.x *= u_resolution.x/u_resolution.y;

//     vec3 color = vec3(.0);

//     // Cell positions
//     vec2 point[5];
//     point[0] = vec2(0.83,0.75);
//     point[1] = vec2(0.60,0.07);
//     point[2] = vec2(0.28,0.64);
//     point[3] =  vec2(0.31,0.26);
//     point[4] = u_mouse/u_resolution;

//     float m_dist = 1.;  // minimum distance
//     vec2 m_point;        // minimum position

//     // Iterate through the points positions
//     for (int i = 0; i < 5; i++) {
//         float dist = distance(st, point[i]);
//         if ( dist < m_dist ) {
//             // Keep the closer distance
//             m_dist = dist;

//             // Kepp the position of the closer point
//             m_point = point[i];
//         }
//     }

//     // Add distance field to closest point center
//     color += m_dist*2.;

//     // tint acording the closest point position
//     color.rg = m_point;

//     // Show isolines
//     color -= abs(sin(80.0*m_dist*u_time))*0.07;

//     // Draw point center
//     color += 1.-step(.02, m_dist);

//     gl_FragColor = vec4(color,1.0);
// }

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy*3.;
    // st += st * abs(sin(u_time*0.1)*3.0);
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*u_time);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);

    float f = fbm(st+r);

    color = mix(vec3(0.101961,0.619608,0.666667),
                vec3(0.666667,0.666667,0.498039),
                clamp((f*f)*4.0,0.0,1.0));

    color = mix(color,
                vec3(0,0,0.164706),
                clamp(length(q),0.0,1.0));

    color = mix(color,
                vec3(0.666667,1,1),
                clamp(length(r.x),0.0,1.0));

    gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color,1.);
}
