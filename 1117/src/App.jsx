import { useEffect } from 'react';

import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

import vertexShaderFile from './a_vertex.glsl';
import fragmentShaderFile from './a_fragment.glsl';

import SceneInit from './lib/SceneInit';
import { Vector3 } from 'three';

function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    let uniformData = {
      u_time: {
        type: 'f',
        value: test.clock.getElapsedTime(),
      },
      u_resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    };
    const render = () => {
      uniformData.u_time.value = test.clock.getElapsedTime();
      window.requestAnimationFrame(render);
    };
    render();

    const loader = new FontLoader();

    // insanity is irrational and indicates a structural failure of reality
    // ekphrasis translating the language of one form into another
    // If  science  fiction  is  the  mythology  of  modern technology,  then  its  myth  is  tragic.
    // 🤠
    loader.load('../static/helvetiker_regular.typeface.json', function (font) {
      // const geometry = new TextGeometry('pog', {
      //   font: font,
      //   size: 3,
      //   height: 0.1,
      //   curveSegments: 10,
      //   bevelEnabled: true,
      //   bevelThickness: 0.1,
      //   bevelSize: 0.1,
      //   bevelOffset: 0.01,
      //   bevelSegments: 4,
      // });

      const geometry = new THREE.BoxGeometry(16, 16, 16, 16, 16, 16);

      const boxMaterial = new THREE.ShaderMaterial({
        uniforms: uniformData,
        vertexShader: vertexShaderFile,
        fragmentShader: fragmentShaderFile,
      });
      // let words = [];
      // for (let i = 0; i < 20; i++) {
      //   words[i] = [];
      //   for (let j = 0; j < 20; j++) {
      //     words[i].push(new THREE.Mesh(geometry, boxMaterial));
      //   }
      // }
      // for (let i = 0; i < words.length; i++) {
      //   for (let j = 0; j < words[i].length; j++) {
      //     test.scene.add(words[i][j]);
      //     words[i][j].position.set(i * 10 - 50, j * 10 - 50, 0);
      //   }
      // }
      test.scene.add(new THREE.Mesh(geometry, boxMaterial))
    });
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
