const scene = new THREE.Scene();
const clock = new THREE.Clock();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let uniformData = {
  u_time: {
    type: "f",
    value: 1.0,
  },
  u_resolution: { type: "v2", value: new THREE.Vector2() },
  u_mouse: { type: "v2", value: new THREE.Vector2() },
};
const render = () => {
  uniformData.u_time.value = clock.getElapsedTime();
  window.requestAnimationFrame(render);
};
render();

onWindowResize();
window.addEventListener( 'resize', onWindowResize, false );

document.onmousemove = function (e) {
  uniformData.u_mouse.value.x = e.pageX;
  uniformData.u_mouse.value.y = e.pageY;
};

const geometry = new THREE.BoxGeometry(1, 1, 1);
// var geometry = new THREE.PlaneGeometry(5, 5);

// sin(), cos(), tan(), asin(), acos(), atan(), pow(), exp(), log(), sqrt(), abs(), sign(), floor(), ceil(), fract(), mod(), min(), max() and clamp().
const material = new THREE.ShaderMaterial({
  uniforms: uniformData,
    wireframe: true,
  vertexShader: `
        #ifdef GL_ES
        precision mediump float;
        #endif
        uniform float u_time;
        void main()	{
          vec4 result;
              result = vec4(position.x,  position.y+sin(u_time), position.z, 1.0);
      
              gl_Position = projectionMatrix
                * modelViewMatrix
                * result;
            }
            `,
  fragmentShader: `
        #ifdef GL_ES
        precision mediump float;
        #endif
        
        #define PI 3.14159265359
        
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform float u_time;
        
        float plot(vec2 st, float pct){
            return  smoothstep( pct-0.02, pct, st.y) -
                    smoothstep( pct, pct+0.02, st.y);
        }
        
        void main() {
            vec2 st = gl_FragCoord.xy/u_resolution;
        
            // Smooth interpolation between 0.1 and 0.9
            float y = smoothstep(0.1,0.9,st.x);
        
            vec3 color = vec3(y);
        
            float pct = plot(st,y);
            color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);
        
            gl_FragColor = vec4(color,1.0);
        }
            `,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 2;

function animate() {
  requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    uniformData.u_resolution.value.x = renderer.domElement.width;
    uniformData.u_resolution.value.y = renderer.domElement.height;
}
animate();
