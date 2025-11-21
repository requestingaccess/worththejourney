import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

const PHRASES = [
  "NOT GOOD ENOUGH", "THEY KNOW", "FRAUD", "DONT BELONG", 
  "EVERYONE SEES IT", "FAKE", "ERROR", "WHO AM I", 
  "IMPOSTER", "FAILURE", "DISAPPOINTMENT"
];
const FONT_URL = "https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_bold.typeface.json";

interface TunnelProps {
  speed: number;
}

interface TunnelLayerProps {
  initialZ: number;
  index: number;
  zOffset: number;
}

const TunnelLayer: React.FC<TunnelLayerProps> = ({ initialZ, index, zOffset }) => {
  const groupRef = useRef<THREE.Group>(null);
  const phrase = useMemo(() => PHRASES[index % PHRASES.length], [index]);
  
  // TUNNEL DIMENSIONS
  const tunnelRadius = 4; 
  const wallWidth = tunnelRadius * 2; // Total width of one side (8 units)

  // SCALING LOGIC (Preserved from your input)
  const targetWidth = wallWidth * 0.75;
  
  const fontSize = 0.6;
  const approxTextWidth = phrase.length * fontSize * 0.7;
  
  const scaleX = Math.max(0.5, targetWidth / approxTextWidth);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // MOVEMENT UPDATE: 
      // Move AWAY from camera (Negative Z).
      // This creates the effect of flying FORWARD through the tunnel.
      groupRef.current.position.z -= 5 * delta; 
      
      // LOOP LOGIC UPDATE:
      // Since we are moving negative, we check if we are too deep in the fog.
      // The fog ends around -30, so -45 is safely invisible.
      if (groupRef.current.position.z < -45) {
        // Snap the layer back to the start (behind the camera)
        groupRef.current.position.z += zOffset;
      }
    }
  });

  const color = index % 2 === 0 ? "#ef4444" : "#ffffff"; 

  const textProps = {
    font: FONT_URL,
    size: fontSize,        
    height: 0.1,      
    curveSegments: 4, 
    bevelEnabled: false,
  };

  const Wall = ({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => (
    <group position={position} rotation={rotation}>
      <Center>
        <group scale={[scaleX, 1, 1]}>
          <Text3D {...textProps}>
            {phrase}
            <meshBasicMaterial color={color} toneMapped={false} />
          </Text3D>
        </group>
      </Center>
    </group>
  );

  return (
    <group ref={groupRef} position={[0, 0, initialZ]}>
      {/* Floor: Reads Left-to-Right */}
      <Wall position={[0, -tunnelRadius, 0]} rotation={[-Math.PI / 2, 0, 0]} />

      {/* Right Wall: Reads Upwards (Vertical) */}
      <Wall position={[tunnelRadius, 0, 0]} rotation={[0, -Math.PI / 2, Math.PI / 2]} />

      {/* Ceiling: Reads Right-to-Left (Inverted) */}
      <Wall position={[0, tunnelRadius, 0]} rotation={[Math.PI / 2, Math.PI, 0]} />

      {/* Left Wall: Reads Downwards (Vertical) */}
      <Wall position={[-tunnelRadius, 0, 0]} rotation={[0, Math.PI / 2, -Math.PI / 2]} />
    </group>
  );
};

export const Tunnel: React.FC<TunnelProps> = ({ speed }) => {
  const groupRef = useRef<THREE.Group>(null);

  const { layers, totalLength } = useMemo(() => {
    const items = [];
    const spacing = 0.8; 
    const numLayers = 60; 
    const totalDepth = numLayers * spacing;

    for (let i = 0; i < numLayers; i++) {
      // Start positions remain the same, covering the depth from camera to fog
      const zPos = 5 - (i * spacing);
      items.push(
        <TunnelLayer 
          key={i} 
          index={i} 
          initialZ={zPos} 
          zOffset={totalDepth} 
        />
      );
    }
    return { layers: items, totalLength: totalDepth };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
        groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {layers}
    </group>
  );
};