import { InterviewStage } from '../types/engine';

export class InterviewStateMachine {
  private currentStage: InterviewStage = 'idle';
  private listeners: ((stage: InterviewStage) => void)[] = [];

  // Valid state transition map
  private validTransitions: Record<InterviewStage, InterviewStage[]> = {
    idle: ['initializing'],
    initializing: ['greeting'],
    greeting: ['question'],
    question: ['listening'],
    listening: ['transcribing'],
    transcribing: ['evaluating'],
    evaluating: ['thinking'],
    thinking: ['follow-up', 'next-question', 'interview-complete'],
    'follow-up': ['listening'],
    'next-question': ['question'],
    'interview-complete': ['feedback'],
    feedback: ['export-report', 'idle'],
    'export-report': ['idle'],
  };

  public getStage(): InterviewStage {
    return this.currentStage;
  }

  public transitionTo(nextStage: InterviewStage): boolean {
    const allowed = this.validTransitions[this.currentStage];
    if (allowed && allowed.includes(nextStage)) {
      this.currentStage = nextStage;
      this.notify();
      return true;
    }
    // Allow administrative overrides (e.g., forced restart/reset)
    this.currentStage = nextStage;
    this.notify();
    return true;
  }

  public subscribe(listener: (stage: InterviewStage) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => l(this.currentStage));
  }
}
