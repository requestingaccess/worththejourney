import React, { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { Tunnel } from './components/Tunnel';
import { Fragments } from './components/Fragments';
import { Debris } from './components/Debris';
import { SilenceView } from './components/SilenceView';
import { CentralQuestion } from './components/CentralQuestion';
import { AppMode } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three';

// Camera Rig for Parallax Effect
const Rig = () => {
  const orientation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Gamma: Left/Right tilt (-90 to 90)
      // Beta: Front/Back tilt (-180 to 180)
      
      // Normalize gamma to -1 to 1 range (clamped)
      const gamma = event.gamma || 0;
      const beta = event.beta || 0;

      // Map -45..45 degrees to -1..1 range
      // We center beta around 45 degrees (typical holding angle)
      const x = Math.min(Math.max(gamma / 45, -1), 1);
      const y = Math.min(Math.max((beta - 45) / 45, -1), 1);

      orientation.current = { x, y };
    };

    // Add listener for mobile tilt
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  useFrame((state) => {
    // Combine mouse pointer (Desktop/Touch) and Device Orientation (Mobile Tilt)
    const targetX = state.pointer.x + orientation.current.x;
    const targetY = state.pointer.y + orientation.current.y;
    
    // Lerp camera position based on inputs
    // Increased intensity (0.8) for more dramatic parallax
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX * 0.8, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY * 0.8, 0.05);
    
    // Ensure camera always looks towards the tunnel depth
    state.camera.lookAt(0, 0, -20);
  });
  return null;
};

const Scene = ({ mode, onShatter }: { mode: AppMode, onShatter: () => void }) => {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 5, 30]} />
      
      {/* Camera Control */}
      <Rig />

      {/* Lighting Removed: Materials are MeshBasicMaterial (Unlit) so lights were wasted overhead */}
      
      {/* Content */}
      <group>
        {mode === AppMode.NOISE && (
          <>
            <Tunnel speed={0.1} />
            <Debris />
            <CentralQuestion onShatter={onShatter} />
          </>
        )}
        {mode === AppMode.SHATTER && (
          <Fragments />
        )}
      </group>

      {/* Post Processing for the "Noise" look */}
      {/* multisampling={0} significantly increases performance on high-DPI screens */}
      <EffectComposer enableNormalPass={false} multisampling={0}>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} opacity={1.5} />
        <Noise opacity={0.15} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <ChromaticAberration offset={new THREE.Vector2(0.002, 0.002)} radialModulation={true} modulationOffset={0} />
      </EffectComposer>
    </>
  );
};

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.NOISE);

  // Handle transition from shatter to silence
  useEffect(() => {
    if (mode === AppMode.SHATTER) {
      const timer = setTimeout(() => {
        setMode(AppMode.SILENCE);
      }, 2500); // Wait for particles to disperse
      return () => clearTimeout(timer);
    }
  }, [mode]);

  const reset = () => setMode(AppMode.NOISE);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* 3D Canvas */}
      <div className={`w-full h-full transition-opacity duration-1000 ${mode === AppMode.SILENCE ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* dpr prop capped to 1.5 to prevent massive render cost on Retina/High-DPI screens */}
        <Canvas camera={{ position: [0, 0, 2], fov: 75 }} dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            <Scene mode={mode} onShatter={() => setMode(AppMode.SHATTER)} />
          </Suspense>
        </Canvas>
      </div>

      {/* Silence Overlay */}
      {mode === AppMode.SILENCE && (
        <SilenceView onReset={(e) => { e.stopPropagation(); reset(); }} />
      )}

      {/* Flash Effect Overlay */}
      <AnimatePresence>
        {mode === AppMode.SHATTER && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;