import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import '../types';

export const Debris: React.FC = () => {
  const count = 400;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        // Random positions within the tunnel volume
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 60 // Deep depth range
        ),
        speed: 0.05 + Math.random() * 0.2,
        size: Math.random()
      });
    }
    return temp;
  }, []);

  const dummy = new THREE.Object3D();

  useFrame((state) => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      // Move particles towards camera slightly to create counter-flow or alongside tunnel
      // Let's make them move with the tunnel but faster/slower for parallax
      particle.position.z -= 10 * state.clock.getDelta(); 

      // Reset if too far
      if (particle.position.z < -45) {
        particle.position.z = 5;
        particle.position.x = (Math.random() - 0.5) * 10;
        particle.position.y = (Math.random() - 0.5) * 10;
      }

      dummy.position.copy(particle.position);
      // Scale particles based on depth (closer = smaller? or constant)
      dummy.scale.setScalar(particle.size * 0.05);
      dummy.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#404040" transparent opacity={0.4} />
    </instancedMesh>
  );
};