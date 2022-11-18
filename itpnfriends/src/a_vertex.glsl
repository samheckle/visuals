#ifdef GL_ES
precision lowp float;
#endif
uniform float u_time;
void main() {
    vec4 result;
    // result = vec4(4.0 / 3.0 * sin(u_time * 10.0) * position.x, position.y, position.z, 1.0);
    result = vec4(position.x, position.y, position.z, 1.0);

    float scaleX = 5.;
    float scaleY = 5.;
    float scaleZ = 1.;

    mat4 sPos = mat4(vec4(scaleX,0.0,0.0,0.0),
                       vec4(0.0,scaleY,0.0,0.0),
                       vec4(0.0,0.0,scaleZ,0.0),
                       vec4(0.0,0.0,0.0,1.0));

    result = result * sPos;

    gl_Position = projectionMatrix * modelViewMatrix * result;
}