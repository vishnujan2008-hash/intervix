import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TranscriptMessage, Candidate } from '../types';
import { Sparkles, Send, MessageSquare } from 'lucide-react';
import { TranscriptBubble } from './TranscriptBubble';
import { TypingIndicator } from './TypingIndicator';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { CandidateVoiceInputButton } from './CandidateVoiceInputButton';

interface TranscriptProps {
  messages: TranscriptMessage[];
  candidate: Candidate;
  isAIThinking?: boolean;
  onSendMessage: (text: string) => void;
}

export const Transcript: React.FC<TranscriptProps> = ({
  messages,
  candidate,
  isAIThinking,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const baseTextRef = useRef('');

  // Speech-to-Text Integration
  const handleSTTUpdate = useCallback((transcriptText: string, isFinal: boolean) => {
    const prefix = baseTextRef.current ? `${baseTextRef.current.trim()} ` : '';
    setInputText(prefix + transcriptText);
    if (isFinal) {
      baseTextRef.current = prefix + transcriptText;
    }
  }, []);

  const {
    sttStatus,
    errorMessage,
    isSupported,
    toggleListening,
    clearError,
  } = useSpeechToText({
    onTranscriptUpdate: handleSTTUpdate,
    silenceTimeoutMs: 3500,
  });

  // Auto scroll to bottom when new messages or thinking indicator arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAIThinking]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    baseTextRef.current = val;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    baseTextRef.current = '';
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-white/10 shadow-xl flex flex-col h-[440px]">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Live Conversation Transcript</h3>
        </div>
        <span className="text-[11px] text-textSec font-mono">{messages.length} exchanges</span>
      </div>

      {/* Auto-scrolling Messages Container */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto pr-2 space-y-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          /* Empty State Illustration */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 opacity-60">
            <MessageSquare className="w-10 h-10 text-gray-500" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">No Transcript Entries Yet</h4>
            <p className="text-[11px] text-textSec max-w-xs">
              Audio speech will automatically convert into live transcript bubbles during the session.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <TranscriptBubble
                key={msg.id}
                message={msg}
                candidate={candidate}
                isLatestAI={msg.sender === 'ai' && index === messages.length - 1}
              />
            ))}
          </AnimatePresence>
        )}

        {/* AI Typing Loader Indicator */}
        {isAIThinking && (
          <div className="pl-11">
            <TypingIndicator />
          </div>
        )}
      </div>

      {/* Candidate Voice & Text Input */}
      <form onSubmit={handleSubmit} className="mt-4 pt-3 border-t border-white/10 flex items-center space-x-2 relative">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder={
            sttStatus === 'listening'
              ? 'Listening... Speak your answer now (Ctrl+M to stop)'
              : 'Speak or type candidate answer... (Ctrl+M for Mic)'
          }
          className={`flex-1 bg-[#09090B] border rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-all ${
            sttStatus === 'listening'
              ? 'border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.3)] bg-red-950/10'
              : 'border-white/10 focus:border-blue-500/50'
          }`}
        />

        {/* Candidate Voice Mic Button */}
        <CandidateVoiceInputButton
          sttStatus={sttStatus}
          isSupported={isSupported}
          errorMessage={errorMessage}
          onToggle={toggleListening}
          onClearError={clearError}
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-all focus-visible:ring-2 focus-visible:ring-blue-400"
          title="Send Answer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
