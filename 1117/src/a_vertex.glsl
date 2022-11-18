#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
void main() {
    vec4 result;
    // result = vec4(4.0 / 3.0 * sin(u_time * 10.0) * position.x, position.y, position.z, 1.0);
    result = vec4(position.x, position.y, position.z, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * result;
}