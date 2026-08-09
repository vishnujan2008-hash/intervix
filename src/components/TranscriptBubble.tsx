import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TranscriptMessage, Candidate } from '../types';
import { Bot, User, Volume2, Code, Copy, Check } from 'lucide-react';

interface TranscriptBubbleProps {
  message: TranscriptMessage;
  candidate: Candidate;
  isLatestAI?: boolean;
}

export const TranscriptBubble: React.FC<TranscriptBubbleProps> = ({
  message,
  candidate,
  isLatestAI,
}) => {
  const isAI = message.sender === 'ai';
  const [displayedText, setDisplayedText] = useState(isAI && isLatestAI ? '' : message.text);
  const [copied, setCopied] = useState(false);

  // Simulated typing streaming effect for newest AI message
  useEffect(() => {
    if (isAI && isLatestAI) {
      let index = 0;
      const textToStream = message.text;
      const timer = setInterval(() => {
        if (index < textToStream.length) {
          setDisplayedText(prev => prev + textToStream.charAt(index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 18);
      return () => clearInterval(timer);
    } else {
      setDisplayedText(message.text);
    }
  }, [message.text, isAI, isLatestAI]);

  const handleCopyCode = () => {
    if (message.codeSnippet) {
      navigator.clipboard.writeText(message.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start space-x-3 ${isAI ? '' : 'flex-row-reverse space-x-reverse'}`}
    >
      {/* Avatar Icon */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
        isAI 
          ? 'bg-blue-600/20 border-blue-400/40 text-blue-400' 
          : 'bg-indigo-600/20 border-indigo-400/40 text-indigo-300'
      }`}>
        {isAI ? (
          <Bot className="w-4 h-4" />
        ) : candidate.avatar ? (
          <img src={candidate.avatar} alt={candidate.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <User className="w-4 h-4" />
        )}
      </div>

      {/* Bubble Box */}
      <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed border shadow-md ${
        isAI
          ? 'bg-secCardDark/90 border-white/10 text-gray-200 rounded-tl-none'
          : 'bg-blue-600/20 border-blue-500/30 text-white rounded-tr-none'
      }`}>
        {/* Subheader */}
        <div className="flex items-center justify-between text-[10px] text-textSec mb-2 pb-1 border-b border-white/5 font-mono">
          <span className="font-semibold text-gray-300">
            {isAI ? 'Intervix Neural AI' : candidate.name}
          </span>
          <span className="flex items-center space-x-1 text-gray-400">
            <Volume2 className="w-3 h-3 text-blue-400" />
            <span>{message.timestamp}</span>
          </span>
        </div>

        {/* Text Paragraph */}
        <p className="text-gray-100 font-normal whitespace-pre-wrap">{displayedText}</p>

        {/* Formatted Code Block (If message contains code) */}
        {message.codeSnippet && (
          <div className="mt-3 rounded-xl bg-[#09090B] border border-white/10 p-3 font-mono text-[11px] text-blue-200 relative group overflow-x-auto">
            <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1.5 pb-1 border-b border-white/5">
              <span className="flex items-center space-x-1 text-blue-400">
                <Code className="w-3 h-3" />
                <span>Code Example</span>
              </span>
              <button 
                onClick={handleCopyCode} 
                className="text-gray-400 hover:text-white flex items-center space-x-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre>{message.codeSnippet}</pre>
          </div>
        )}

        {/* Candidate Confidence Metrics */}
        {!isAI && message.metrics && (
          <div className="mt-2.5 pt-2 border-t border-blue-500/20 flex items-center space-x-3 text-[10px] text-blue-200">
            <span className="bg-blue-500/20 px-2 py-0.5 rounded border border-blue-400/30 font-mono">
              Confidence: {message.metrics.confidence}%
            </span>
            <span className="bg-blue-500/20 px-2 py-0.5 rounded border border-blue-400/30 font-mono">
              Clarity: {message.metrics.clarity}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
