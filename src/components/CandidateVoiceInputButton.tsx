import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Check, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { STTStatus } from '../hooks/useSpeechToText';

interface CandidateVoiceInputButtonProps {
  sttStatus: STTStatus;
  isSupported: boolean;
  errorMessage: string | null;
  onToggle: () => void;
  onClearError?: () => void;
}

export const CandidateVoiceInputButton: React.FC<CandidateVoiceInputButtonProps> = ({
  sttStatus,
  isSupported,
  errorMessage,
  onToggle,
  onClearError,
}) => {
  // Keyboard Shortcut: Ctrl + M or Cmd + M
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        onToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);

  return (
    <div className="relative inline-flex items-center space-x-2">
      {/* Voice Input Status Badge */}
      <AnimatePresence>
        {sttStatus === 'listening' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold shadow-[0_0_12px_rgba(239,68,68,0.3)]"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>Recording... (Ctrl+M)</span>
          </motion.div>
        )}

        {sttStatus === 'processing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold"
          >
            <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
            <span>Processing...</span>
          </motion.div>
        )}

        {sttStatus === 'ready' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Transcript Ready</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Microphone Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={onToggle}
        className={`p-2.5 rounded-xl border transition-all flex items-center justify-center relative focus-visible:ring-2 focus-visible:ring-blue-400 ${
          sttStatus === 'listening'
            ? 'bg-red-600 text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
            : sttStatus === 'ready'
            ? 'bg-emerald-600 text-white border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
            : sttStatus === 'processing'
            ? 'bg-purple-600 text-white border-purple-400/50'
            : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/10'
        }`}
        title={
          !isSupported
            ? 'Speech recognition unavailable'
            : sttStatus === 'listening'
            ? 'Stop Recording (Ctrl+M)'
            : 'Start Voice Recording (Ctrl+M)'
        }
      >
        {sttStatus === 'listening' && (
          <span className="animate-ping absolute inset-0 rounded-xl bg-red-400 opacity-40 pointer-events-none" />
        )}
        {sttStatus === 'processing' ? (
          <Loader2 className="w-4 h-4 animate-spin text-white" />
        ) : sttStatus === 'ready' ? (
          <Check className="w-4 h-4 text-white" />
        ) : sttStatus === 'listening' ? (
          <Mic className="w-4 h-4 text-white" />
        ) : (
          <Mic className="w-4 h-4 text-gray-300 group-hover:text-white" />
        )}
      </motion.button>

      {/* Error Notification Toast Popover */}
      {errorMessage && (
        <div className="absolute bottom-12 right-0 z-50 p-3 rounded-2xl bg-red-950/90 border border-red-500/50 text-red-200 text-xs font-mono shadow-2xl flex items-center space-x-2.5 max-w-xs whitespace-normal backdrop-blur-md">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="flex-1 text-[11px] leading-tight">{errorMessage}</span>
          {onClearError && (
            <button onClick={onClearError} className="text-red-400 hover:text-white font-bold text-xs ml-1">
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
};
