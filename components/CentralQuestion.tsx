import React, { useState, useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';

interface CentralQuestionProps {
  onShatter: () => void;
}

// Characters to scramble through
const SCRAMBLE_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface GlitchButtonProps {
  text: string;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

const GlitchButton: React.FC<GlitchButtonProps> = ({ text, onClick, className = "" }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<number | null>(null);
  
  // Mobile double-tap handling
  const isTouchRef = useRef(false);
  const [isActive, setIsActive] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const stopScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(text);
    setIsActive(false); 
  };

  // Handle outside clicks/touches to reset state
  useEffect(() => {
    const handleOutsideInteraction = (event: Event) => {
      if (isActive && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        stopScramble();
      }
    };

    document.addEventListener('touchstart', handleOutsideInteraction);
    document.addEventListener('click', handleOutsideInteraction);

    return () => {
      document.removeEventListener('touchstart', handleOutsideInteraction);
      document.removeEventListener('click', handleOutsideInteraction);
    };
  }, [isActive, text]);

  const startScramble = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = window.setInterval(() => {
      setDisplayText(prev => 
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join("")
      );
      
      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      
      iteration += 1 / 2; 
    }, 30);
  };

  const handleTouchStart = () => {
    isTouchRef.current = true;
  };

  const handleMouseEnter = () => {
    if (isTouchRef.current) return;
    startScramble();
  };

  const handleMouseLeave = () => {
    if (isTouchRef.current) return;
    stopScramble();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isTouchRef.current) {
      if (!isActive) {
        setIsActive(true);
        startScramble(); 
        return;
      }
    }
    onClick(e);
  };

  const activeBorder = isActive ? 'border-red-500 shadow-[0_0_25px_rgba(220,38,38,0.6)] scale-105 -skew-x-6' : '';
  const activeBg = isActive ? 'translate-x-[200%]' : 'group-hover:translate-x-[200%]';
  const activeNoise = isActive ? 'opacity-10' : 'opacity-0 group-hover:opacity-10';
  const activeText = isActive ? 'text-red-100' : 'text-white group-hover:text-red-100';

  return (
    <button
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      className={`
        relative group 
        w-full sm:w-auto
        px-6 py-3 sm:px-8 sm:py-4
        border border-white/30 
        bg-black/60 backdrop-blur-md
        overflow-hidden
        transition-all duration-300
        hover:border-red-500 hover:shadow-[0_0_25px_rgba(220,38,38,0.6)]
        hover:scale-105 hover:-skew-x-6
        pointer-events-auto
        ${activeBorder}
        ${className}
      `}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-red-600/20 to-transparent -translate-x-[200%] transition-transform duration-700 ease-in-out ${activeBg}`} />
      <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none ${activeNoise}`} />
      <span className={`relative z-10 font-bold text-sm sm:text-base tracking-[0.2em] sm:tracking-[0.3em] uppercase transition-colors duration-200 drop-shadow-[0_0_5px_rgba(0,0,0,1)] ${activeText}`}>
        {displayText}
      </span>
    </button>
  );
};

export const CentralQuestion: React.FC<CentralQuestionProps> = ({ onShatter }) => {
  const [step, setStep] = useState(0);

  return (
    <Html
      position={[0, 0, -4]}
      center
      zIndexRange={[100, 0]}
      transform
    >
      <div className="w-[90vw] max-w-[500px] flex flex-col items-center justify-center font-sans select-none p-4">
        {step === 0 ? (
          <GlitchButton 
            text="worth?" 
            onClick={(e) => {
              setStep(1);
            }} 
          />
        ) : (
          <div className="flex flex-col items-center gap-6 w-full animate-in fade-in zoom-in duration-500">
            <div className="bg-black/60 backdrop-blur-sm px-6 py-4 border-l-2 border-r-2 border-red-500/50 w-full text-center shadow-lg">
              <h2 className="text-white text-base sm:text-lg md:text-xl font-bold tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] leading-relaxed">
                do you have worth?
              </h2>
            </div>
            
            {/* Wrap flex container for very small screens */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center w-full">
              <GlitchButton 
                text="yes" 
                onClick={(e) => {
                  onShatter();
                }} 
              />
              <GlitchButton 
                text="yes" 
                onClick={(e) => {
                  onShatter();
                }} 
              />
            </div>
          </div>
        )}
      </div>
    </Html>
  );
};