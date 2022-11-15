import { useEffect } from 'react';

import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

import SceneInit from './lib/SceneInit';
import { Vector3 } from 'three';

function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    // part 1 -- boilerplate with basic cube and wireframe
    // // last three params are width, height and depth segments
    // const boxGeometry = new THREE.BoxGeometry(16, 16, 16, 16, 16, 16);
    // // const boxMaterial = new THREE.MeshNormalMaterial();
    // // change material to be wireframe
    // const boxMaterial = new THREE.MeshStandardMaterial({
    //   color: 0xff0000,
    //   wireframe: true
    // })

    // // part 2 -- adding shader material
    // const boxGeometry = new THREE.BoxGeometry(16, 16, 16, 16, 16, 16);
    // const boxMaterial = new THREE.ShaderMaterial({
    //   wireframe: true,
    //   vertexShader: `
    //   void main()	{
    //     // projectionMatrix, modelViewMatrix, position -> passed in from Three.js
    //     gl_Position = projectionMatrix
    //       * modelViewMatrix
    //       * vec4(position.x, position.y, position.z, 1.0);
    //   }
    //   `,
    //   fragmentShader: `
    //   void main() {
    //     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    //   }
    //   `,
    // });

    let uniformData = {
      u_time: {
        type: 'f',
        value: test.clock.getElapsedTime(),
      },
    };
    const render = () => {
      uniformData.u_time.value = test.clock.getElapsedTime();
      window.requestAnimationFrame(render);
    };
    render();

    // const boxGeometry = new THREE.BoxGeometry(16, 16, 16, 16, 16, 16);
    // const boxMaterial = new THREE.ShaderMaterial({
    //   wireframe: true,
    //   uniforms: uniformData,
    //   vertexShader: `
    //   uniform float u_time;
    //   void main()	{
    //     // // gl_Position = projectionMatrix
    //     // //   * modelViewMatrix
    //     // //   * vec4(position.x, position.y, position.z, 1.0);
    //     // gl_Position = projectionMatrix
    //     //   * modelViewMatrix
    //     //   * vec4(position.x, sin(position.z), position.z, 1.0);
    //     // // gl_Position = projectionMatrix
    //     // //   * modelViewMatrix
    //     // //   * vec4(position.x, sin(position.z) + position.y, position.z, 1.0);
    //     // // gl_Position = projectionMatrix
    //     // //   * modelViewMatrix
    //     // //   * vec4(position.x, sin(position.z/4.0) + position.y, position.z, 1.0);
    //     // // gl_Position = projectionMatrix
    //     // //   * modelViewMatrix
    //     // //   * vec4(position.x, 4.0*sin(position.z/4.0) + position.y, position.z, 1.0);

    //     vec4 result;

    //     // result = vec4(position.x, position.y + sin(u_time), position.z, 1.0);
    //     result = vec4(position.x,  sin(position.z + u_time), position.z, 1.0);

    //     gl_Position = projectionMatrix
    //       * modelViewMatrix
    //       * result;
    //   }
    //   `,
    //   fragmentShader: `
    //   void main() {
    //     // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    //     gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    //   }
    //   `,
    // });
    // const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

    // test.scene.add(boxMesh);
    const loader = new FontLoader();

    loader.load('../static/helvetiker_regular.typeface.json', function (font) {
      const geometry = new TextGeometry('pog', {
        font: font,
        size: 3,
        height: .1,
        curveSegments: 1,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0.01,
        bevelSegments: 1,
      });
      
      const boxMaterial = new THREE.ShaderMaterial({
        uniforms: uniformData,
        vertexShader: `
            uniform float u_time;
            void main()	{
              vec4 result;
                  result = vec4(sin(u_time) * position.x,  position.y * sin(u_time), position.z, 1.0);
          
                  gl_Position = projectionMatrix
                    * modelViewMatrix
                    * result;
                }
                `,
        fragmentShader: `
                void main() {
                  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
                }
                `,
      });
      let words = [];
      for (let i = 0; i < 20; i++) {
        words[i] = [];
        for (let j = 0; j < 20; j++){
          words[i].push(new THREE.Mesh(geometry, boxMaterial));
        }

        // test.scene.add(words[i][0]);
      }
      for (let i = 0; i < words.length; i++) {
        console.log('test')
        for (let j = 0; j < words[i].length; j++) {
          test.scene.add(words[i][j]);
          words[i][j].position.set(i * 10 - 50, (j*10) - 50, 0);
        }
      }
      // for (let i = 0; i < words[0].length; i++) {
      //   // for (let j = -5; j < 5; j += 1) {
      //     for (let k = 0; k < words[i].length; k += 1) {
      //       // words[i].translateX(j)
      //       // words[i].translateY(k)
      //       words[i].position.set(i * 10, k, 0);
      //       // console.log(words[i].worldToLocal(new Vector3()))
      //     }
      //   // }
      // }
    });
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
