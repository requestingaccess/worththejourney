import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Fragments: React.FC = () => {
  const count = 300;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Initial positions and velocities
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const speed = 0.2 + Math.random() * 0.5;
      const direction = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize().multiplyScalar(speed);
      
      temp.push({
        position: new THREE.Vector3(0, 0, -5), // Start from tunnel center
        rotation: new THREE.Euler(Math.random(), Math.random(), Math.random()),
        velocity: direction,
        rotSpeed: {
          x: Math.random() * 0.2,
          y: Math.random() * 0.2
        }
      });
    }
    return temp;
  }, []);

  const dummy = new THREE.Object3D();

  useFrame(() => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      // Move
      particle.position.add(particle.velocity);
      
      // Rotate
      particle.rotation.x += particle.rotSpeed.x;
      particle.rotation.y += particle.rotSpeed.y;

      // Update matrix
      dummy.position.copy(particle.position);
      dummy.rotation.copy(particle.rotation);
      dummy.scale.setScalar(Math.max(0, 1 - particle.position.length() / 20)); // Fade out scale
      dummy.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <coneGeometry args={[0.2, 0.8, 3]} /> 
      <meshBasicMaterial color="white" transparent opacity={0.8} />
    </instancedMesh>
  );
};
