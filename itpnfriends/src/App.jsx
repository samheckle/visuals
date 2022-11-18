import { useEffect } from 'react';

import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

import vert from './a_vertex.glsl';
import frag from './a_fragment.glsl';

import text_vert from './text_vert.glsl';
import text_frag from './text_frag.glsl';

import SceneInit from './lib/SceneInit';
import { Vector3 } from 'three';

function App() {
  useEffect(() => {
    const scene = new SceneInit('myThreeJsCanvas');
    scene.initialize();
    scene.animate();

    let uniformData = {
      u_time: {
        type: 'f',
        value: scene.clock.getElapsedTime(),
      },
      u_resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    };
    const render = () => {
      uniformData.u_time.value = scene.clock.getElapsedTime();
      window.requestAnimationFrame(render);
    };
    render();

    const loader = new FontLoader();

    // insanity is irrational and indicates a structural failure of reality
    // ekphrasis translating the language of one form into another
    // If  science  fiction  is  the  mythology  of  modern technology,  then  its  myth  is  tragic.
    // 🤠
    loader.load('../static/Comic_Bold.json', function (font) {
      const geometry = new TextGeometry('pog', {
        font: font,
        size: 3,
        height: 0.1,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0.01,
        bevelSegments: 4,
      });

      // const geometry = new THREE.BoxGeometry(16, 16, 16, 16, 16, 16);
      // const geometry = new THREE.PlaneGeometry(30, 15);

      const boxMaterial = new THREE.ShaderMaterial({
        uniforms: uniformData,
        vertexShader: text_vert,
        fragmentShader: text_frag,
      });

      const heck = new TextGeometry('@samanthiik', {
        font: font,
        size: 1,
        height: 0.1,
        curveSegments: 10,
        bevelEnabled: false,
      });
      const darn = new TextGeometry('@darnyill', {
        font: font,
        size: 1,
        height: 0.1,
        curveSegments: 10,
        bevelEnabled: false,
      });

      const normMat = new THREE.MeshNormalMaterial();
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
      scene.scene.add(new THREE.Mesh(geometry, boxMaterial));

      const h = new THREE.Mesh(heck, normMat);
      const d = new THREE.Mesh(darn, normMat);
      h.position.set(-40,-15,0);
      d.position.set(33,-15,0);
      scene.scene.add(h);
      scene.scene.add(d);
    });

    const background = new THREE.PlaneGeometry(10, 5);

    const backgroundMat = new THREE.ShaderMaterial({
      uniforms: uniformData,
      vertexShader: vert,
      fragmentShader: frag,
    });
    scene.scene.add(new THREE.Mesh(background, backgroundMat));
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
