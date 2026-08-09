import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const THINKING_MESSAGES = [
  'Analyzing candidate response...',
  'Checking curriculum progress...',
  'Evaluating technical depth...',
  'Generating next question...',
  'Preparing recruiter feedback...',
];

export const TypingIndicator: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % THINKING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#1A2233]/90 border border-blue-500/30 w-fit shadow-[0_0_15px_rgba(59,130,246,0.2)]">
      <AnimatePresence mode="wait">
        <motion.span
          key={THINKING_MESSAGES[index]}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.25 }}
          className="text-xs font-mono text-blue-300 font-medium"
        >
          {THINKING_MESSAGES[index]}
        </motion.span>
      </AnimatePresence>

      <div className="flex items-center space-x-1 pl-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: ['0px', '-4px', '0px'],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
            className="w-1.5 h-1.5 rounded-full bg-blue-400"
          />
        ))}
      </div>
    </div>
  );
};
