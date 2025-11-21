import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getInsight } from '../services/geminiService';
import { RefreshCw, ArrowRight } from 'lucide-react';

interface SilenceViewProps {
  onReset: (e: React.MouseEvent) => void;
}

export const SilenceView: React.FC<SilenceViewProps> = ({ onReset }) => {
  const [insight, setInsight] = useState<string>("Breathing...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getInsight().then((text) => {
      if (mounted) {
        setInsight(text);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, backgroundColor: "#000" }}
      animate={{ opacity: 1, backgroundColor: "#F5F2E8" }} // Soft off-white
      transition={{ duration: 2, ease: "easeOut" }}
      className="absolute inset-0 flex flex-col items-center justify-start overflow-y-auto scrollbar-hide z-10 cursor-default"
    >
      <div className="w-full max-w-4xl px-6 py-16 md:py-24 flex flex-col items-center text-center">
        
        {/* Main Insight */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mb-16"
        >
          <h1 className="font-serif text-3xl md:text-5xl text-slate-900 mb-8 leading-tight tracking-tight">
            {loading ? "..." : `"${insight}"`}
          </h1>
          <div className="w-16 h-1 bg-red-500 mx-auto opacity-80" />
        </motion.div>

        {/* Educational Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left border-t border-slate-200 pt-12 w-full"
        >
          <div>
            <h3 className="font-serif text-xl md:text-2xl text-slate-800 mb-4">The Feedback Loop</h3>
            <p className="font-sans text-slate-600 leading-relaxed text-sm md:text-base">
              The visual tunnel you just experienced represents the psychological trap of <strong>Imposter Syndrome</strong>. 
              It begins as a single doubt ("I'm a fraud") and spirals into a distorted reality where every success feels accidental 
              and every mistake feels catastrophic.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-xl md:text-2xl text-slate-800 mb-4">The Reality</h3>
            <p className="font-sans text-slate-600 leading-relaxed text-sm md:text-base mb-4">
              Research estimates that <strong>70% of people</strong> will experience these feelings at some point in their lives. 
              High achievers are particularly susceptible.
            </p>
            <p className="font-sans text-slate-600 leading-relaxed text-sm md:text-base">
              The silence you feel now is the truth. The noise was just a habit of thought.
            </p>
          </div>
        </motion.div>

        {/* Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
          className="mt-20"
        >
          <button 
            onClick={onReset}
            className="group flex items-center justify-center gap-3 mx-auto px-8 py-4 rounded-full bg-slate-900 text-white hover:bg-red-600 transition-all duration-500 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
            <span className="font-medium tracking-wide text-sm">LEARN MORE</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};