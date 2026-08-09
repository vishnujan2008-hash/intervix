export interface DemoStep {
  stepIndex: number;
  label: string;
  durationMs: number;
  route: string;
  action: string;
  aiStatus: 'idle' | 'listening' | 'thinking' | 'speaking';
  candidateText?: string;
  aiText?: string;
}

export const DEMO_TIMELINE: DemoStep[] = [
  {
    stepIndex: 1,
    label: 'Selecting Candidate Profile',
    durationMs: 3500,
    route: 'candidate-selection',
    action: 'SELECT_CANDIDATE',
    aiStatus: 'idle',
  },
  {
    stepIndex: 2,
    label: 'Configuring Pre-Session Rigor',
    durationMs: 3500,
    route: 'interview-config',
    action: 'CONFIGURE_SESSION',
    aiStatus: 'idle',
  },
  {
    stepIndex: 3,
    label: 'AI Assessor Greeting & Intro',
    durationMs: 12000,
    route: 'interview-session',
    action: 'GREETING',
    aiStatus: 'speaking',
    aiText: "Welcome Alex. I am your Lead AI Assessor. Today we'll evaluate your mastery over Vector Databases, RAG Indexing, and High-Throughput Model Architectures. Shall we begin with Question 4?",
  },
  {
    stepIndex: 4,
    label: 'Presenting Vector DB Question',
    durationMs: 8000,
    route: 'interview-session',
    action: 'PRESENT_QUESTION',
    aiStatus: 'listening',
  },
  {
    stepIndex: 5,
    label: 'Candidate Speech Response',
    durationMs: 14000,
    route: 'interview-session',
    action: 'CANDIDATE_SPEECH',
    aiStatus: 'listening',
    candidateText: "HNSW graph indexing structures high-dimensional embeddings into hierarchical skip-list layers. This enables logarithmic search complexity O(log N) while preserving 95%+ recall under high query loads.",
  },
  {
    stepIndex: 6,
    label: 'Neural Core Vector Evaluation',
    durationMs: 9000,
    route: 'interview-session',
    action: 'EVALUATING',
    aiStatus: 'thinking',
  },
  {
    stepIndex: 7,
    label: 'AI Follow-up & Adaptive Scaling',
    durationMs: 14000,
    route: 'interview-session',
    action: 'FOLLOW_UP',
    aiStatus: 'speaking',
    aiText: "Impressive observation on hierarchical skip-lists. How do you handle graph reconstruct overhead when vectors are continuously inserted in a live streaming database?",
  },
  {
    stepIndex: 8,
    label: 'Generating Executive Report',
    durationMs: 15000,
    route: 'interview-summary',
    action: 'FINAL_REPORT',
    aiStatus: 'idle',
  },
];
