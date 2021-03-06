import * as THREE from 'three';
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from "@react-three/fiber";
import Random from 'canvas-sketch-util/random';
import { Sphere, Trail } from "@react-three/drei"
import "./App.css"


function Particles({ count }) {
  const mesh = useRef();
  const light = useRef();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Random.range(0, 100);
      const factor = Random.range(20, 120);
      const speed = Random.range(0.01, 0.015) / 2;
      const x = Random.range(-50, 50);
      const y = Random.range(-50, 50);
      const z = Random.range(-50, 50);

      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    particles.forEach((particle, index) => {
      let { factor, speed, x, y, z } = particle;
      const t = (particle.time += speed);
      dummy.position.set(
        x + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        y + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        z + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      const s = Math.cos(t);
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="lightblue" />
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <dodecahedronBufferGeometry args={[0.2, 0]} />
        <meshPhongMaterial color="#050505" />
      </instancedMesh>
    </>
  );
}



function Comet(props) {
  const sphere = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    sphere.current.position.x = props.factor*Math.sin(t) * 3
    sphere.current.position.y = Math.cos(t) * 3
    sphere.current.position.z = Math.cos(t) * 3
  })

  return (
    <>
      <Trail
        width={1}
        length={4}
        color={'black'}
        attenuation={(t) => {
          return t * t
        }}
      >
        <Sphere ref={sphere} args={[0.05, 32, 32]} position-x={props.position} position-y={0}>
          <meshBasicMaterial color="black" />
        </Sphere>
      </Trail>
    </>
  )
}


function App() {

  return (
    <div className="Parent">
      <Canvas>
        <Comet factor={1}/>
        <Particles count={400} />
      </Canvas>
    </div>
  );
}

export default App;
