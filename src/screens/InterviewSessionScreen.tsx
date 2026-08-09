import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInterview } from '../context/InterviewContext';
import { useVoiceEngine } from '../hooks/useVoiceEngine';
import { NeuralCore } from '../components/NeuralCore';
import { StatusIndicator } from '../components/StatusIndicator';
import { QuestionCard } from '../components/QuestionCard';
import { VoiceControls } from '../components/VoiceControls';
import { Transcript } from '../components/Transcript';
import { ChatInterface } from '../components/ChatInterface';
import { ProgressPanel } from '../components/ProgressPanel';
import { ScoreCard } from '../components/ScoreCard';
import { CurriculumTimeline } from '../components/CurriculumTimeline';
import { DevDebugPanel } from '../components/DevDebugPanel';
import { globalBreethMemoryService } from '../services/ai/BreethMemoryService';
import { CandidateService } from '../services/data/CandidateService';
import { Keyboard, AlertCircle, MessageSquare, Mic, Database, ChevronDown, ChevronUp } from 'lucide-react';
import { globalConversationStateMachine } from '../engine/ConversationStateMachine';

export const InterviewSessionScreen: React.FC = () => {
  const {
    aiStatus,
    setAIStatus,
    currentQuestion,
    nextQuestion,
    skipQuestion,
    transcript,
    addTranscriptMessage,
    scores,
    metrics,
    isMicMuted,
    toggleMic,
    isSpeakerMuted,
    toggleSpeaker,
    interviewMode,
    setInterviewMode,
    timeElapsed,
    selectedCandidate,
    triggerSimulationEvent,
  } = useInterview();

  const { voiceState, lastError, interruptSpeaking, speakText } = useVoiceEngine();
  const [showMemory, setShowMemory] = useState(false);

  // Sync Voice Engine state
  useEffect(() => {
    if (interviewMode === 'voice' && voiceState !== 'error') {
      setAIStatus(voiceState as any);
    }
  }, [voiceState, setAIStatus, interviewMode]);

  // Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.code === 'KeyM') {
        toggleMic();
      } else if (e.code === 'KeyN') {
        nextQuestion();
      } else if (e.code === 'KeyI') {
        interruptSpeaking();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMic, nextQuestion, interruptSpeaking]);

  const handleSendAnswerText = (text: string) => {
    interruptSpeaking();
    addTranscriptMessage('candidate', text);
  };

  const memoryContext = globalBreethMemoryService.getCandidateMemoryContext(selectedCandidate.id);
  const completedMissions = CandidateService.getCompletedMissions(selectedCandidate.id);

  return (
    <div className="space-y-6 pb-16 relative">
      {/* Developer Debug Panel */}
      <DevDebugPanel />

      {/* Voice Error Toast */}
      {lastError && interviewMode === 'voice' && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>Voice Engine Status: {lastError}</span>
        </div>
      )}

      {/* Mode Switcher Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 rounded-3xl bg-[#050507]/90 border border-white/10 text-xs font-mono text-gray-300 backdrop-blur-xl shadow-xl">
        <div className="flex items-center space-x-3">
          <span className="text-gray-400 font-semibold font-sans">Active Interview Mode:</span>
          <button
            onClick={() => setInterviewMode('voice')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center space-x-2 transition-all ${
              interviewMode === 'voice'
                ? 'bg-blue-600 text-white font-bold border border-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.35)]'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>🎤 Voice Mode</span>
          </button>
          <button
            onClick={() => setInterviewMode('text')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center space-x-2 transition-all ${
              interviewMode === 'text'
                ? 'bg-purple-600 text-white font-bold border border-purple-400/40 shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>⌨️ Text Chat Mode</span>
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-3 text-[11px] text-gray-400">
          <span className="flex items-center space-x-1">
            <Keyboard className="w-3.5 h-3.5 text-blue-400" />
            <span>Hotkeys: <kbd className="px-1 bg-black/40 rounded border border-white/10 text-white">N</kbd> Next | <kbd className="px-1 bg-black/40 rounded border border-white/10 text-white">I</kbd> Interrupt</span>
          </span>
        </div>
      </div>

      {/* REQUIREMENT 1: 3-Column Enterprise Workspace Layout (20% / 60% / 20%) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (20% - 3 cols): Candidate Workspace */}
        <div className="xl:col-span-3 space-y-6">
          {/* REQUIREMENT 10: Professional Candidate Profile Widget */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4 bg-[#050507]/80">
            <div className="flex items-center space-x-4">
              <img
                src={selectedCandidate.avatar}
                alt={selectedCandidate.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-md"
              />
              <div>
                <h3 className="text-base font-extrabold text-white">{selectedCandidate.name}</h3>
                <p className="text-xs text-gray-400">{selectedCandidate.role}</p>
                <span className="text-[11px] font-mono text-blue-400 font-semibold">{selectedCandidate.experienceYears} Years Exp.</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-2 text-xs">
              <div className="flex justify-between items-center text-gray-400">
                <span>Completed Missions:</span>
                <span className="font-mono text-white font-bold">{completedMissions.length} / 31</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Readiness Index:</span>
                <span className="font-mono text-emerald-400 font-bold">HIGH (96%)</span>
              </div>
            </div>
          </div>

          {/* Breeth Memory Context Drawer */}
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden bg-[#050507]/80">
            <button
              onClick={() => setShowMemory(!showMemory)}
              className="w-full p-4 flex items-center justify-between text-xs font-semibold text-blue-300 hover:bg-white/5 transition-colors"
            >
              <span className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span>Breeth AI Memory Context</span>
              </span>
              {showMemory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {showMemory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-4 pt-0 border-t border-white/5 text-[11px] font-mono text-gray-300 leading-relaxed"
                >
                  <p className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-200">
                    {memoryContext}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Collapsible Curriculum (Collapsed by Default) */}
          <CurriculumTimeline defaultExpanded={false} />
        </div>

        {/* CENTER COLUMN (60% - 6 cols): Hero Question & Interaction Stage */}
        <div className="xl:col-span-6 space-y-6 flex flex-col items-center">
          {interviewMode === 'text' ? (
            <div className="w-full space-y-6">
              <QuestionCard
                question={currentQuestion}
                onNext={() => nextQuestion()}
                onSkip={skipQuestion}
              />
              <ChatInterface
                messages={transcript}
                candidate={selectedCandidate}
                isAIThinking={aiStatus === 'thinking'}
                onSendMessage={handleSendAnswerText}
              />
            </div>
          ) : (
            <>
              <div className="w-full glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[360px] bg-radial-sphere bg-[#050507]/90">
                <NeuralCore
                  status={aiStatus}
                  onStatusClick={() => {
                    const nextState = aiStatus === 'listening' ? 'think' : aiStatus === 'thinking' ? 'speak' : 'listen';
                    triggerSimulationEvent(nextState);
                  }}
                />

                <div className="mt-2">
                  <StatusIndicator
                    currentStatus={aiStatus}
                    onStatusChange={setAIStatus}
                  />
                </div>
              </div>

              <QuestionCard
                question={currentQuestion}
                onNext={() => {
                  nextQuestion();
                  speakText(`Moving to Question ${currentQuestion.number + 1}. Please explain the system architecture.`);
                }}
                onSkip={skipQuestion}
              />

              <VoiceControls
                status={aiStatus}
                isMicMuted={isMicMuted}
                onToggleMic={toggleMic}
                isSpeakerMuted={isSpeakerMuted}
                onToggleSpeaker={toggleSpeaker}
                timeElapsedSeconds={timeElapsed}
                onInterrupt={interruptSpeaking}
              />

              <Transcript
                messages={transcript}
                candidate={selectedCandidate}
                isAIThinking={aiStatus === 'thinking'}
                onSendMessage={handleSendAnswerText}
              />
            </>
          )}
        </div>

        {/* RIGHT COLUMN (20% - 3 cols): AI Assessment Matrix */}
        <div className="xl:col-span-3 space-y-6">
          <ProgressPanel scores={scores} metrics={metrics} />
        </div>
      </div>

      {/* Bottom Session Metrics Bar */}
      <div className="pt-4 border-t border-white/10">
        <ScoreCard metrics={metrics} timeElapsedSeconds={timeElapsed} />
      </div>
    </div>
  );
};
