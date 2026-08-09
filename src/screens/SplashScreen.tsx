import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInterview } from '../context/InterviewContext';
import { IntervixLogo } from '../components/IntervixLogo';
import { Cpu, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { navigateTo } = useInterview();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#09090B] bg-radial-glow flex flex-col items-center justify-between p-8 select-none relative overflow-hidden">
      {/* Background Animated Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="w-[500px] h-[500px] rounded-full border border-blue-500/20"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          className="w-[700px] h-[700px] rounded-full border border-indigo-500/10"
        />
      </div>

      {/* Top Branding Pill */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-textSec font-mono backdrop-blur-md"
      >
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span>Intervix Enterprise AI Edition</span>
      </motion.div>

      {/* Center Hero Identity */}
      <div className="flex flex-col items-center text-center max-w-xl z-10">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <IntervixLogo variant="hero" iconSize={110} />
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-textSec font-light mt-3 tracking-wide"
        >
          The AI Technical Interviewer.
        </motion.p>

        {/* System Loading Bar */}
        <div className="w-full max-w-md mt-10 space-y-2">
          <div className="flex justify-between text-xs font-mono text-textSec">
            <span>Booting Neural Assessment Engines...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden border border-white/5">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_15px_#3B82F6]"
            />
          </div>
        </div>

        {/* Enter Button */}
        {progress === 100 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => navigateTo('welcome')}
            className="mt-8 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm border border-blue-400/40 shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all flex items-center space-x-3 group cursor-pointer"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </div>

      {/* Footer Security Tag */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center space-x-2 text-xs text-gray-500 font-mono"
      >
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Autonomous Assessment Engine Ready • Zero Human Bias</span>
      </motion.div>
    </div>
  );
};
