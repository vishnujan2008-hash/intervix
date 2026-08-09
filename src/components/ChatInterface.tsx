import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TranscriptMessage, Candidate } from '../types';
import { Send, Bot, Code, CornerDownLeft, FastForward } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { CandidateVoiceInputButton } from './CandidateVoiceInputButton';

interface ChatInterfaceProps {
  messages: TranscriptMessage[];
  candidate: Candidate;
  isAIThinking: boolean;
  onSendMessage: (text: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  candidate,
  isAIThinking,
  onSendMessage,
}) => {
  const { skipQuestion } = useInterview();
  const [inputText, setInputText] = useState('');
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const baseTextRef = useRef('');

  // Speech-to-Text Integration for Candidate Input
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

  const thinkingStates = [
    'Thinking...',
    'Reviewing architecture...',
    'Comparing trade-offs...',
    'Generating follow-up...'
  ];

  // Cycle thinking message every 1.5s when AI is thinking
  useEffect(() => {
    if (!isAIThinking) return;
    const interval = setInterval(() => {
      setThinkingIndex((prev) => (prev + 1) % thinkingStates.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isAIThinking]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAIThinking]);

  // Sync baseTextRef when candidate manually types
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);
    baseTextRef.current = val;
  };

  // Keyboard Shortcuts: Enter (send), Shift+Enter (newline), Ctrl+L (clear draft), Esc (focus)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setInputText('');
        baseTextRef.current = '';
      } else if (e.key === 'Escape') {
        textareaRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSend = () => {
    if (!inputText.trim() || isAIThinking) return;
    onSendMessage(inputText.trim());
    setInputText('');
    baseTextRef.current = '';
  };

  const handleKeyDownTextarea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl border border-white/10 shadow-2xl flex flex-col h-[650px] overflow-hidden relative bg-[#050507]/90">
      
      {/* Top Header */}
      <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-[#0B0F19]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center space-x-2">
              <span>ChatGPT Enterprise AI Interviewer</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ACTIVE
              </span>
            </h3>
            <p className="text-[11px] text-gray-400">Evaluating <span className="text-white font-semibold">{candidate.name}</span></p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-mono text-gray-400">
          <span>Shortcuts: <kbd className="px-1 bg-white/10 rounded text-white">Enter</kbd> Send | <kbd className="px-1 bg-white/10 rounded text-white">Ctrl+M</kbd> Voice Input</span>
        </div>
      </div>

      {/* Scrolling Chat Conversation Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg, idx) => {
          const isAI = msg.sender === 'ai';
          const msgType = msg.messageType || (isAI ? 'question' : 'answer');

          return (
            <motion.div
              key={msg.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-start space-x-3 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400 flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-1.5 ${isAI ? 'text-left' : 'text-right'}`}>
                <div className={`flex items-center space-x-2 text-[10px] font-mono text-gray-400 ${isAI ? 'justify-start' : 'justify-end'}`}>
                  <span className="font-bold text-gray-200">{isAI ? 'Senior AI Assessor' : candidate.name}</span>
                  <span>• {msg.timestamp}</span>
                  {msgType === 'question' && (
                    <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">QUESTION</span>
                  )}
                  {msgType === 'followup' && (
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">FOLLOW-UP</span>
                  )}
                  {msgType === 'evaluation' && (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">EVALUATION</span>
                  )}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed transition-all ${
                    isAI
                      ? 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm shadow-lg'
                      : 'bg-blue-600 border border-blue-400/40 text-white rounded-tr-sm shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {msg.codeSnippet && (
                    <div className="mt-3 p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-blue-300 overflow-x-auto">
                      <div className="flex items-center space-x-1.5 text-[10px] text-gray-500 mb-1">
                        <Code className="w-3 h-3 text-blue-400" />
                        <span>Code Reference Snippet</span>
                      </div>
                      <pre>{msg.codeSnippet}</pre>
                    </div>
                  )}

                  {!isAI && msg.metrics && (
                    <div className="mt-2 flex items-center justify-end space-x-2 text-[10px] font-mono text-blue-200/90 border-t border-white/10 pt-1.5">
                      <span>Confidence: {msg.metrics.confidence}%</span>
                      <span>Clarity: {msg.metrics.clarity}%</span>
                    </div>
                  )}
                </div>
              </div>

              {!isAI && (
                <img
                  src={candidate.avatar}
                  alt={candidate.name}
                  className="w-8 h-8 rounded-xl object-cover border border-white/20 flex-shrink-0 mt-1"
                />
              )}
            </motion.div>
          );
        })}

        {/* Dynamic AI Thinking Animation */}
        {isAIThinking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 justify-start"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-purple-300 flex items-center space-x-3 rounded-tl-sm">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="font-mono text-[11px] text-gray-300 font-semibold">{thinkingStates[thinkingIndex]}</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Bottom Input Bar with Voice Input Enhancement */}
      <div className="p-4 bg-[#0B0F19] border-t border-white/10 space-y-2">
        <div className="relative flex items-center">
          <textarea
            ref={textareaRef}
            rows={2}
            disabled={isAIThinking}
            value={inputText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDownTextarea}
            placeholder={
              sttStatus === 'listening'
                ? 'Listening... Speak your answer now (Ctrl+M to stop)'
                : isAIThinking
                ? 'AI is evaluating your response...'
                : 'Type or speak your answer... (Ctrl+M for Voice Mic, Enter to send)'
            }
            className={`w-full bg-[#09090B] border rounded-2xl p-3.5 pr-28 text-xs text-white placeholder-gray-500 focus:outline-none transition-all resize-none font-sans ${
              sttStatus === 'listening'
                ? 'border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.3)] bg-red-950/10'
                : 'border-white/10 focus:border-blue-500'
            }`}
          />

          <div className="absolute right-3 flex items-center space-x-2">
            {/* Candidate Voice Input Microphone Button */}
            <CandidateVoiceInputButton
              sttStatus={sttStatus}
              isSupported={isSupported}
              errorMessage={errorMessage}
              onToggle={toggleListening}
              onClearError={clearError}
            />

            <button
              type="button"
              onClick={skipQuestion}
              disabled={isAIThinking}
              className="px-2 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-[10px] font-mono flex items-center space-x-1 transition-all disabled:opacity-40"
              title="Skip question"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Skip</span>
            </button>

            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isAIThinking}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white border border-blue-400/30 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              title="Send Answer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 px-1">
          <span className="flex items-center space-x-2">
            <span>Voice Input: <span className="text-gray-300 font-bold">Ctrl + M</span></span>
            <span>•</span>
            <span>Type or speak answer freely</span>
          </span>
          <span className="flex items-center space-x-1">
            <CornerDownLeft className="w-3 h-3 text-blue-400" />
            <span>Enter to Submit</span>
          </span>
        </div>
      </div>
    </div>
  );
};
