import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Shield, AlertCircle, Heart, Instagram, ArrowDown, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SilenceViewProps {
  onReset: (e: React.MouseEvent) => void;
}

interface SectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  themeColor: string;
}

const QUIZ_QUESTIONS = [
  "Do you often worry that others will discover you aren't as capable as they think?",
  "Do you attribute your success to luck, timing, or error rather than your own skills?",
  "Do you agonize over even the smallest mistakes in your work?",
  "Do you feel crushed by constructive criticism, seeing it as proof of your incompetence?",
  "When you succeed, do you feel like you 'fooled' everyone again?"
];

const ImposterQuiz: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (isYes: boolean) => {
    if (isYes) setScore(s => s + 1);
    
    if (index < QUIZ_QUESTIONS.length - 1) {
      setIndex(i => i + 1);
    } else {
      setFinished(true);
    }
  };

  const getResult = () => {
    if (score <= 1) return { label: "Low Risk", text: "You seem to have a healthy relationship with your achievements. Keep building on this foundation." };
    if (score <= 3) return { label: "Moderate Risk", text: "You likely experience imposter feelings that periodically hinder your confidence." };
    return { label: "High Risk", text: "Imposter feelings may be a constant companion, significantly affecting your well-being." };
  };

  const result = getResult();

  if (finished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 rounded-2xl shadow-lg border border-rose-100 text-center relative overflow-hidden h-full flex flex-col justify-center"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-rose-600" />
        
        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto">
           <CheckCircle2 className="w-6 h-6" />
        </div>

        <h3 className="font-serif text-2xl text-slate-900 mb-2">{result.label}</h3>
        <p className="font-sans text-stone-600 mb-6 text-sm leading-relaxed">{result.text}</p>
        
        <div className="bg-amber-50 p-3 rounded-lg mb-6 text-left border border-amber-100">
             <p className="text-amber-800 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                <AlertCircle className="w-3 h-3" /> Disclaimer
             </p>
             <p className="text-amber-700/80 text-[10px] leading-relaxed">
                This assessment is for self-reflection only. It is not a clinical diagnosis or a substitute for professional mental health advice.
             </p>
        </div>

        <a 
          href="https://ctl.stanford.edu/students/imposter-syndrome" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-2 text-rose-600 hover:text-rose-700 font-bold tracking-wide uppercase text-xs border-b border-rose-200 hover:border-rose-600 transition-all pb-1 hover:gap-3 mx-auto"
        >
          Stanford CTL Resources
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" /> 
        </a>
        
        <button 
            onClick={() => { setIndex(0); setScore(0); setFinished(false); }}
            className="block mx-auto mt-6 text-stone-400 hover:text-stone-600 text-[10px] uppercase tracking-widest transition-colors"
        >
            Retake Assessment
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-stone-200 relative h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Risk Assessment</span>
        <div className="flex gap-1">
          {QUIZ_QUESTIONS.map((_, i) => (
             <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i <= index ? 'w-4 bg-rose-500' : 'w-1.5 bg-stone-100'}`} />
          ))}
        </div>
      </div>
      
      <div className="flex-grow flex items-center mb-8">
        <h3 className="font-serif text-xl text-slate-900 leading-snug">
          {QUIZ_QUESTIONS[index]}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button 
          onClick={() => handleAnswer(false)}
          className="py-3 px-4 rounded-xl border border-stone-100 hover:border-stone-300 hover:bg-stone-50 text-stone-500 font-sans text-sm font-semibold transition-all"
        >
          No
        </button>
        <button 
          onClick={() => handleAnswer(true)}
          className="py-3 px-4 rounded-xl bg-slate-900 text-white font-sans text-sm font-semibold shadow-md hover:bg-rose-600 transition-all"
        >
          Yes
        </button>
      </div>
    </div>
  );
};

const Section: React.FC<SectionProps> = ({ title, description, icon, children, themeColor }) => (
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-15%" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="w-full max-w-7xl mx-auto py-24 px-6 md:px-12 border-b border-stone-200 last:border-0"
  >
    <div className="flex flex-col lg:flex-row gap-16 items-start">
      {/* Sticky Sidebar Info */}
      <div className="lg:w-1/3 lg:sticky lg:top-32">
        <motion.div 
          className={`mb-6 p-3 rounded-2xl w-fit ${themeColor} bg-opacity-10`}
          whileHover={{ scale: 1.05 }}
        >
          {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `w-8 h-8 ${themeColor}` })}
        </motion.div>
        <h2 className="font-serif text-4xl md:text-5xl text-slate-900 mb-6 leading-tight">{title}</h2>
        <p className="font-sans text-slate-600 leading-relaxed text-lg">{description}</p>
        <div className={`h-1 w-20 mt-8 rounded-full ${themeColor} opacity-40`} />
      </div>

      {/* Content Grid */}
      <div className="lg:w-2/3 w-full">
        {children}
      </div>
    </div>
  </motion.section>
);

const InstagramPlaceholder: React.FC<{ caption?: string, aspectRatio?: string, imageSrc?: string }> = ({ caption, aspectRatio = "aspect-[4/5]", imageSrc }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="bg-white p-4 shadow-sm border border-stone-100 rounded-lg group cursor-pointer hover:shadow-xl transition-shadow duration-300 h-full"
  >
    <div className={`${aspectRatio} bg-stone-100 mb-4 rounded-md flex items-center justify-center relative overflow-hidden`}>
      {imageSrc ? (
        <img 
          src={imageSrc} 
          alt={caption} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <Instagram className="w-10 h-10 text-stone-300 group-hover:scale-110 transition-transform duration-500" />
      )}
      
      {/* Overlay for depth on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Fake UI Elements for realism */}
      <div className="absolute top-3 right-3 flex gap-1 z-10">
        <div className={`w-1.5 h-1.5 rounded-full drop-shadow-sm ${imageSrc ? 'bg-white' : 'bg-stone-300'}`} />
        <div className={`w-1.5 h-1.5 rounded-full drop-shadow-sm ${imageSrc ? 'bg-white' : 'bg-stone-300'}`} />
        <div className={`w-1.5 h-1.5 rounded-full drop-shadow-sm ${imageSrc ? 'bg-white' : 'bg-stone-300'}`} />
      </div>
    </div>
    
    <div className="space-y-3 px-1">
      <div className="flex items-center justify-between mb-2">
         <div className="flex gap-2">
            <Heart className={`w-4 h-4 transition-colors ${imageSrc ? 'text-rose-500 fill-rose-500' : 'text-stone-300'}`} />
            <div className="w-4 h-4 rounded-full border border-stone-300" />
         </div>
         <div className="w-4 h-4 border border-stone-300 rounded-sm" />
      </div>
      <div className="h-2 w-3/4 bg-stone-100 rounded" />
      <div className="h-2 w-1/2 bg-stone-100 rounded" />
    </div>
    {caption && (
      <p className="mt-4 text-xs font-mono text-stone-400 uppercase tracking-widest border-t border-stone-50 pt-3">
        {caption}
      </p>
    )}
  </motion.div>
);

export const SilenceView: React.FC<SilenceViewProps> = ({ onReset }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }} 
      transition={{ duration: 1.5 }}
      className="absolute inset-0 bg-[#F5F2E8] overflow-y-auto z-20"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Hero / Intro */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-4xl"
        >
          <span className="font-sans text-stone-500 tracking-[0.4em] text-xs md:text-sm uppercase mb-6 block font-semibold">
            The Shadows Have Lifted
          </span>
          <h1 className="font-serif text-6xl md:text-8xl text-slate-900 mb-8 tracking-tight">
            Clarity
          </h1>
          <p className="font-sans text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed mb-12">
            You have emerged from the darkness. Now, we rebuild. Understanding the mechanics of imposter syndrome is the first step to dismantling it permanently.
          </p>
          <div className="w-px h-24 bg-gradient-to-b from-red-500/80 to-transparent mx-auto" />
        </motion.div>
        
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 animate-bounce text-stone-400"
        >
            <ArrowDown className="w-6 h-6" />
        </motion.div>
      </div>

      <div className="bg-[#F5F2E8] pb-40">
        
        {/* Risk Factors Section */}
        <Section 
          title="Risk Factors" 
          description="Identify the triggers. Certain situations—new roles, toxic environments, or perfectionist tendencies—act as accelerants for imposter feelings."
          icon={<AlertCircle />}
          themeColor="text-amber-700 bg-amber-500"
        >
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
             <InstagramPlaceholder caption="Perfectionism" imageSrc="riskfactor_1.png" />
             <InstagramPlaceholder caption="Comparison Trap" imageSrc="riskfactor_2.png" />
             <InstagramPlaceholder caption="Fear of Failure" imageSrc="riskfactor_3.png" />
           </div>
        </Section>

        {/* Protective Factors Section */}
        <Section 
          title="Protective Factors" 
          description="These are your shields. Protective factors are the internal mindsets and external environments that buffer against the shadows of self-doubt."
          icon={<Shield />}
          themeColor="text-emerald-700 bg-emerald-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <InstagramPlaceholder caption="Building a Support System" imageSrc="protectivefactor_1.png" />
             <InstagramPlaceholder caption="Documenting Wins" imageSrc="protectivefactor_2.png" />
             <InstagramPlaceholder caption="The Growth Mindset" imageSrc="protectivefactor_3.png" />
             <InstagramPlaceholder caption="Positive Affirmations" imageSrc="protectivefactor_4.png" />
          </div>
        </Section>

        {/* Community Interaction Section */}
        <Section 
          title="Community" 
          description="You are not alone. Assessing your own feelings is the first step towards connecting with others who share this experience."
          icon={<Heart />}
          themeColor="text-rose-700 bg-rose-500"
        >
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
             <ImposterQuiz />
             <InstagramPlaceholder caption="Shared Vulnerability" imageSrc="community_1.jpg" />
           </div>
        </Section>

      </div>

      {/* Footer / Reset Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none flex justify-center bg-gradient-to-t from-[#F5F2E8] via-[#F5F2E8]/80 to-transparent z-30">
        <button 
          onClick={onReset}
          className="pointer-events-auto group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-red-600 transition-all duration-500 hover:scale-105"
        >
          <RefreshCw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-700" />
          <span className="font-sans text-sm tracking-[0.2em] font-bold">RESTART EXPERIENCE</span>
        </button>
      </div>

    </motion.div>
  );
};