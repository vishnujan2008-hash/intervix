import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ScreenRoute, 
  AIStatus, 
  InterviewMode,
  Candidate, 
  CurriculumTopic, 
  Question, 
  TranscriptMessage, 
  LiveScores, 
  InterviewMetrics 
} from '../types';
import { 
  MOCK_CANDIDATES, 
  INITIAL_CURRICULUM, 
  MOCK_QUESTIONS 
} from '../data/mockData';
import { DEMO_TIMELINE } from '../engine/DemoPlayer';
import { CandidateService } from '../services/data/CandidateService';
import { InterviewResultStore } from '../services/data/InterviewResultStore';
import { globalVoiceService } from '../services/voice/VoiceService';
import { globalComprehensiveReportEngine } from '../engine/ComprehensiveReportEngine';
import { globalConversationStateMachine } from '../engine/ConversationStateMachine';

interface InterviewContextType {
  currentRoute: ScreenRoute;
  historyStack: ScreenRoute[];
  navigateTo: (route: ScreenRoute) => void;
  goBack: () => void;
  
  aiStatus: AIStatus;
  setAIStatus: (status: AIStatus) => void;
  
  selectedCandidate: Candidate;
  setSelectedCandidate: (candidate: Candidate) => void;
  candidates: Candidate[];
  
  curriculum: CurriculumTopic[];
  setCurriculum: React.Dispatch<React.SetStateAction<CurriculumTopic[]>>;
  
  questions: Question[];
  currentQuestionIndex: number;
  currentQuestion: Question;
  nextQuestion: () => void;
  skipQuestion: () => void;
  
  startNewInterviewSession: () => void;
  finishInterviewSession: () => void;

  transcript: TranscriptMessage[];
  addTranscriptMessage: (sender: 'ai' | 'candidate', text: string) => void;
  
  scores: LiveScores;
  metrics: InterviewMetrics;
  
  isMicMuted: boolean;
  toggleMic: () => void;
  isSpeakerMuted: boolean;
  toggleSpeaker: () => void;
  
  interviewMode: InterviewMode;
  setInterviewMode: (mode: InterviewMode) => void;
  
  timeElapsed: number;
  interviewStartTimestamp: number;
  interviewEndTimestamp: number;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  
  triggerSimulationEvent: (event: 'speak' | 'think' | 'listen' | 'idle') => void;

  // Demo Mode
  isDemoActive: boolean;
  demoStepIndex: number;
  isDemoPaused: boolean;
  startDemoMode: () => void;
  stopDemoMode: () => void;
  togglePauseDemo: () => void;
  skipDemoStep: () => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<ScreenRoute>('splash');
  const [historyStack, setHistoryStack] = useState<ScreenRoute[]>(['splash']);
  
  const [aiStatus, setAIStatus] = useState<AIStatus>('listening');
  const candidates = CandidateService.getAllCandidates() as any[];
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidates[0]?.id || 'cand-001');
  const selectedCandidate = (CandidateService.getCandidate(selectedCandidateId) || candidates[0]) as any;
  const setSelectedCandidate = (cand: Candidate) => setSelectedCandidateId(cand.id);
  const [curriculum, setCurriculum] = useState<CurriculumTopic[]>(INITIAL_CURRICULUM);
  
  const [questions] = useState<Question[]>(MOCK_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  
  // Real Session States (Initialized empty for clean interview behavior)
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [scores, setScores] = useState<LiveScores>({
    communication: 0,
    technicalAccuracy: 0,
    reasoning: 0,
    problemSolving: 0,
    architectureThinking: 0,
    confidence: 0,
    overallScore: 0
  });

  const [metrics, setMetrics] = useState<InterviewMetrics>({
    questionsAsked: 1,
    questionsRemaining: 7,
    timeElapsedSeconds: 0,
    adaptiveDifficulty: selectedCandidate?.targetDifficulty || 'Standard',
    candidateEnergy: 'Optimal',
    candidateConfidence: 0,
    sessionHealth: 'Optimal (99.8%)'
  });
  
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [interviewMode, setInterviewMode] = useState<InterviewMode>('voice');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [interviewStartTimestamp, setInterviewStartTimestamp] = useState<number>(0);
  const [interviewEndTimestamp, setInterviewEndTimestamp] = useState<number>(0);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  // Demo Mode state
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [demoStepIndex, setDemoStepIndex] = useState(1);
  const [isDemoPaused, setIsDemoPaused] = useState(false);

  // Live timer tick during interview-session
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentRoute === 'interview-session') {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentRoute]);

  // Demo Mode Auto-Player Timeline Engine
  useEffect(() => {
    let demoTimer: NodeJS.Timeout;
    if (isDemoActive && !isDemoPaused) {
      const currentStep = DEMO_TIMELINE.find(s => s.stepIndex === demoStepIndex);
      if (currentStep) {
        if (currentStep.route) {
          setCurrentRoute(currentStep.route as ScreenRoute);
        }
        if (currentStep.aiStatus) {
          setAIStatus(currentStep.aiStatus as AIStatus);
        }
        if (currentStep.aiText) {
          addTranscriptMessage('ai', currentStep.aiText);
        }
        if (currentStep.candidateText) {
          addTranscriptMessage('candidate', currentStep.candidateText);
          setScores({
            communication: 96,
            technicalAccuracy: 98,
            reasoning: 96,
            problemSolving: 95,
            architectureThinking: 98,
            confidence: 94,
            overallScore: 97,
          });
        }

        demoTimer = setTimeout(() => {
          if (demoStepIndex < DEMO_TIMELINE.length) {
            setDemoStepIndex(prev => prev + 1);
          } else {
            setIsDemoActive(false);
          }
        }, currentStep.durationMs);
      }
    }
    return () => clearTimeout(demoTimer);
  }, [isDemoActive, demoStepIndex, isDemoPaused]);

  const startDemoMode = () => {
    setDemoStepIndex(1);
    setIsDemoActive(true);
    setIsDemoPaused(false);
    setSelectedCandidate(MOCK_CANDIDATES[0]);
    setCurrentRoute('candidate-selection');
  };

  const stopDemoMode = () => {
    setIsDemoActive(false);
    setCurrentRoute('dashboard');
  };

  const togglePauseDemo = () => {
    setIsDemoPaused(prev => !prev);
  };

  const skipDemoStep = () => {
    if (demoStepIndex < DEMO_TIMELINE.length) {
      setDemoStepIndex(prev => prev + 1);
    } else {
      stopDemoMode();
    }
  };

  const startNewInterviewSession = () => {
    setTranscript([]);
    setTimeElapsed(0);
    setCurrentQuestionIndex(0);
    const start = Date.now();
    setInterviewStartTimestamp(start);
    setInterviewEndTimestamp(0);
    
    setScores({
      communication: 0,
      technicalAccuracy: 0,
      reasoning: 0,
      problemSolving: 0,
      architectureThinking: 0,
      confidence: 0,
      overallScore: 0
    });

    globalConversationStateMachine.resetSession();

    setMetrics({
      questionsAsked: 1,
      questionsRemaining: questions.length - 1,
      timeElapsedSeconds: 0,
      adaptiveDifficulty: selectedCandidate?.targetDifficulty || 'Standard',
      candidateEnergy: 'Optimal',
      candidateConfidence: 0,
      sessionHealth: 'Optimal (99.8%)'
    });

    // 1 second after Start Interview: AI generates Question 1 (Greeting ONLY ONCE)
    setTimeout(() => {
      globalConversationStateMachine.markIntroduced();
      const q1 = questions[0];
      const initialAiMsg: TranscriptMessage = {
        id: `t-${Date.now()}`,
        sender: 'ai',
        text: `Hello ${selectedCandidate.name}! Welcome to Intervix. I am your Lead AI System Assessor today for the ${selectedCandidate.role} position. We'll begin with a technical assessment.\n\nQuestion 1: ${q1.title} — ${q1.content}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        audioDuration: '00:15'
      };
      setTranscript([initialAiMsg]);
      setAIStatus('speaking');
      if (interviewMode === 'voice') {
        globalVoiceService.speak(initialAiMsg.text);
      }
    }, 1000);
  };

  const finishInterviewSession = () => {
    const end = Date.now();
    setInterviewEndTimestamp(end);
    const start = interviewStartTimestamp > 0 ? interviewStartTimestamp : end - (timeElapsed * 1000);
    const res = globalComprehensiveReportEngine.buildInterviewResult(
      selectedCandidate,
      transcript,
      metrics,
      start,
      end
    );
    InterviewResultStore.saveResult(res);
  };

  const navigateTo = (route: ScreenRoute) => {
    if (route === 'interview-session') {
      if (transcript.length === 0) {
        startNewInterviewSession();
      }
    } else if (route === 'interview-summary') {
      finishInterviewSession();
    }
    setHistoryStack(prev => [...prev, route]);
    setCurrentRoute(route);
  };

  const goBack = () => {
    if (historyStack.length > 1) {
      const newStack = [...historyStack];
      newStack.pop();
      const previousRoute = newStack[newStack.length - 1];
      setHistoryStack(newStack);
      setCurrentRoute(previousRoute);
    } else {
      setCurrentRoute('dashboard');
    }
  };

  const addTranscriptMessage = (sender: 'ai' | 'candidate', text: string) => {
    const newMsg: TranscriptMessage = {
      id: `t-${Date.now()}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      audioDuration: sender === 'ai' ? '00:18' : '00:22',
      metrics: sender === 'candidate' ? { confidence: Math.floor(Math.random() * 10) + 90, clarity: Math.floor(Math.random() * 10) + 88 } : undefined
    };
    setTranscript(prev => [...prev, newMsg]);

    if (sender === 'candidate') {
      // REQUIREMENT: Instantly interrupt any active AI speech when candidate starts responding
      globalVoiceService.interruptSpeaking();

      const wordCount = text.trim().split(/\s+/).length;
      const lower = text.toLowerCase();
      const hasKeywords = /system|redis|cache|latency|rest|api|vector|hnsw|docker|sql|concurrency|queue/i.test(lower);
      const turnScore = Math.min(98, Math.max(65, 75 + (hasKeywords ? 15 : 5) + Math.min(10, Math.floor(wordCount / 5))));

      setScores(prev => ({
        communication: Math.min(99, Math.max(60, prev.communication > 0 ? Math.round((prev.communication + turnScore) / 2) : turnScore)),
        technicalAccuracy: Math.min(99, Math.max(60, prev.technicalAccuracy > 0 ? Math.round((prev.technicalAccuracy + turnScore + 2) / 2) : turnScore + 2)),
        reasoning: Math.min(99, Math.max(60, prev.reasoning > 0 ? Math.round((prev.reasoning + turnScore - 1) / 2) : turnScore - 1)),
        problemSolving: Math.min(99, Math.max(60, prev.problemSolving > 0 ? Math.round((prev.problemSolving + turnScore + 1) / 2) : turnScore + 1)),
        architectureThinking: Math.min(99, Math.max(60, prev.architectureThinking > 0 ? Math.round((prev.architectureThinking + turnScore + 3) / 2) : turnScore + 3)),
        confidence: Math.min(99, Math.max(60, prev.confidence > 0 ? Math.round((prev.confidence + turnScore) / 2) : turnScore)),
        overallScore: Math.min(99, Math.max(60, turnScore))
      }));

      setAIStatus('thinking');

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          const nextIdx = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIdx);
          setMetrics(prev => ({
            ...prev,
            questionsAsked: prev.questionsAsked + 1,
            questionsRemaining: Math.max(0, prev.questionsRemaining - 1)
          }));

          const qNext = questions[nextIdx];
          
          // Process via state machine (guarantees NO repeated greeting)
          const smResult = globalConversationStateMachine.processCandidateMessage(
            selectedCandidate,
            qNext.title,
            text
          );

          const followUpText = `Turn Evaluation: ${smResult.evaluation?.feedbackSummary || 'Demonstrated structured reasoning.'}\n\nQuestion ${nextIdx + 1}: ${qNext.title} — ${qNext.content}`;

          const aiMsg: TranscriptMessage = {
            id: `t-${Date.now()}`,
            sender: 'ai',
            text: followUpText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            audioDuration: '00:18'
          };
          setTranscript(prev => [...prev, aiMsg]);
          setAIStatus('speaking');
          if (interviewMode === 'voice') {
            globalVoiceService.speak(aiMsg.text);
          }
        } else {
          finishInterviewSession();
          navigateTo('interview-summary');
        }
      }, 1400);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setMetrics(prev => ({
        ...prev,
        questionsAsked: prev.questionsAsked + 1,
        questionsRemaining: Math.max(0, prev.questionsRemaining - 1)
      }));
      triggerSimulationEvent('think');
      setTimeout(() => triggerSimulationEvent('speak'), 1200);
    } else {
      finishInterviewSession();
      navigateTo('interview-summary');
    }
  };

  const skipQuestion = () => {
    const skipMsg: TranscriptMessage = {
      id: `t-${Date.now()}`,
      sender: 'candidate',
      text: '[Question skipped by interviewer]',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setTranscript(prev => [...prev, skipMsg]);
    setScores(prev => ({
      ...prev,
      overallScore: Math.max(0, prev.overallScore - 5)
    }));

    if (currentQuestionIndex < questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setMetrics(prev => ({
        ...prev,
        questionsAsked: prev.questionsAsked + 1,
        questionsRemaining: Math.max(0, prev.questionsRemaining - 1)
      }));

      setTimeout(() => {
        const qNext = questions[nextIdx];
        const aiNextMsg: TranscriptMessage = {
          id: `t-${Date.now()}`,
          sender: 'ai',
          text: `Question skipped. Moving to Question ${nextIdx + 1}: ${qNext.title} — ${qNext.content}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          audioDuration: '00:15'
        };
        setTranscript(prev => [...prev, aiNextMsg]);
        setAIStatus('speaking');
      }, 800);
    } else {
      finishInterviewSession();
      navigateTo('interview-summary');
    }
  };

  const toggleMic = () => setIsMicMuted(prev => !prev);
  const toggleSpeaker = () => setIsSpeakerMuted(prev => !prev);

  const triggerSimulationEvent = (event: 'speak' | 'think' | 'listen' | 'idle') => {
    switch (event) {
      case 'speak':
        setAIStatus('speaking');
        break;
      case 'think':
        setAIStatus('thinking');
        break;
      case 'listen':
        setAIStatus('listening');
        break;
      case 'idle':
        setAIStatus('idle');
        break;
    }
  };

  return (
    <InterviewContext.Provider
      value={{
        currentRoute,
        historyStack,
        navigateTo,
        goBack,
        aiStatus,
        setAIStatus,
        selectedCandidate,
        setSelectedCandidate,
        candidates,
        curriculum,
        setCurriculum,
        questions,
        currentQuestionIndex,
        currentQuestion,
        nextQuestion,
        skipQuestion,
        startNewInterviewSession,
        finishInterviewSession,
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
        interviewStartTimestamp,
        interviewEndTimestamp,
        isSettingsOpen,
        setSettingsOpen,
        triggerSimulationEvent,
        isDemoActive,
        demoStepIndex,
        isDemoPaused,
        startDemoMode,
        stopDemoMode,
        togglePauseDemo,
        skipDemoStep,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
