import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader, extend } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

// Extend TextGeometry so we can instantiate it for measurements
extend({ TextGeometry });

const PHRASES = [
  "NOT GOOD ENOUGH", "THEY KNOW", "FRAUD", "DONT BELONG", 
  "EVERYONE SEES IT", "FAKE", "ERROR", "WHO AM I", 
  "IMPOSTER", "FAILURE", "DISAPPOINTMENT", "WHY TRY",
  "GIVE UP", "EXPOSED", "INCOMPETENT", "WEAK"
];

const FONT_URL = "https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_bold.typeface.json";

// Tunnel Configuration
const WALL_RADIUS = 8.5; 
// Width of the text block. A square tunnel with apothem R has side length 2R.
// We add a tiny bit (1.02) to ensure corners overlap slightly.
const TARGET_WIDTH = WALL_RADIUS * 2 * 1; 
const VIEW_DEPTH = 120; 

// Materials
// We multiply the red color scalar to push values > 1.0, triggering a strong bloom/glow
const materialRed = new THREE.MeshBasicMaterial({ 
  color: new THREE.Color("#ef4444").multiplyScalar(1.5), 
  toneMapped: false 
});
const materialWhite = new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false });

interface TunnelProps {
  speed: number;
}

interface WordLayout {
  phrase: string;
  scale: number;
  height: number;
  yOffset: number;
  id: string;
}

interface WallConfig {
  items: WordLayout[];
  totalHeight: number;
}

// Helper to measure text and build a layout stack
const createWallLayout = (font: any, phrases: string[], seedOffset: number): WallConfig => {
  const items: WordLayout[] = [];
  let currentY = 0;

  // Reorder phrases based on seed to make walls look different
  const orderedPhrases = [...phrases];
  for(let i = 0; i < seedOffset; i++) {
    orderedPhrases.unshift(orderedPhrases.pop()!);
  }

  orderedPhrases.forEach((phrase, i) => {
    // Measure bounding box unscaled
    const geo = new TextGeometry(phrase, {
      font,
      size: 1,
      depth: 0.1,
      curveSegments: 1,
    });
    geo.computeBoundingBox();
    const box = geo.boundingBox!;
    const width = box.max.x - box.min.x;
    const height = box.max.y - box.min.y;

    // Calculate scale to force width to TARGET_WIDTH
    const scale = TARGET_WIDTH / width;
    const scaledHeight = height * scale;

    items.push({
      phrase,
      scale,
      height: scaledHeight,
      yOffset: currentY,
      id: `${seedOffset}-${i}-${phrase}`
    });

    // Stack upwards in Local Y
    currentY += scaledHeight; 
    
    geo.dispose();
  });

  return { items, totalHeight: currentY };
};

const WallSection: React.FC<{ 
  config: WallConfig, 
  speed: number 
}> = ({ config, speed }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Calculate how many copies we need to fill the depth
  const copiesNeeded = Math.ceil(VIEW_DEPTH / config.totalHeight) + 1;
  const blocks = Array.from({ length: copiesNeeded });

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      // Animate Local Y Positive.
      // Since this wall will be rotated X = -90, Local Y+ maps to World Z- (Distance).
      // To simulate "Moving Forward" (passing objects), objects must move towards Z+ (Camera).
      // So Local Y must DECREASE.
      const yScroll = (t * speed * 40) % config.totalHeight;
      groupRef.current.position.y = -yScroll;
    }
  });

  return (
    <group ref={groupRef}>
      {blocks.map((_, blockIndex) => {
        // Tile blocks in Local Y
        const blockY = blockIndex * config.totalHeight;
        return (
          <group key={blockIndex} position={[0, blockY, 0]}>
             {config.items.map((item, i) => (
               <group 
                  key={item.id} 
                  position={[0, item.yOffset, 0]}
               >
                  {/* Justified text: Center align X so it fits the wall width */}
                  <Center top>
                    <Text3D
                      font={FONT_URL}
                      size={1}
                      height={0.05}
                      scale={[item.scale, item.scale, 1]}
                      curveSegments={1}
                      bevelEnabled={false}
                      material={i % 2 === 0 ? materialRed : materialWhite}
                    >
                      {item.phrase}
                    </Text3D>
                 </Center>
               </group>
             ))}
          </group>
        );
      })}
    </group>
  );
};

export const Tunnel: React.FC<TunnelProps> = ({ speed }) => {
  const font = useLoader(FontLoader, FONT_URL);
  
  const wallConfigs = useMemo(() => {
    return [
      createWallLayout(font, PHRASES, 0),  // Floor
      createWallLayout(font, PHRASES, 3),  // Right
      createWallLayout(font, PHRASES, 7),  // Ceiling
      createWallLayout(font, PHRASES, 11), // Left
    ];
  }, [font]);

  return (
    <group>
      {/* 
        STRATEGY:
        1. Create a "Wall" that is a flat strip of text running along Local Y.
        2. Rotate it X = -90. Now the strip runs along World -Z.
        3. Position it at Y = -RADIUS (Floor).
        4. Rotate this whole assembly around Z to create the other 3 walls.
      */}

      {/* Floor */}
      <group rotation={[0, 0, 0]}>
         <group position={[0, -WALL_RADIUS, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <WallSection config={wallConfigs[0]} speed={speed} />
         </group>
      </group>

      {/* Right Wall (Rotated 90 deg Z) */}
      <group rotation={[0, 0, Math.PI/2]}>
         <group position={[0, -WALL_RADIUS, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <WallSection config={wallConfigs[1]} speed={speed} />
         </group>
      </group>

      {/* Ceiling (Rotated 180 deg Z) */}
      <group rotation={[0, 0, Math.PI]}>
         <group position={[0, -WALL_RADIUS, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <WallSection config={wallConfigs[2]} speed={speed} />
         </group>
      </group>

      {/* Left Wall (Rotated -90 deg Z) */}
      <group rotation={[0, 0, -Math.PI/2]}>
         <group position={[0, -WALL_RADIUS, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <WallSection config={wallConfigs[3]} speed={speed} />
         </group>
      </group>
    </group>
  );
};