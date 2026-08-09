import { Candidate } from '../types';

export type ConversationState =
  | 'IDLE'
  | 'INTRODUCTION'
  | 'QUESTION'
  | 'LISTENING'
  | 'EVALUATING'
  | 'NEXT_QUESTION'
  | 'COMPLETED';

export type CandidateMessageType =
  | 'greeting'
  | 'acknowledgement'
  | 'command'
  | 'technical_answer';

export interface ProcessedConversationResponse {
  messageType: CandidateMessageType;
  state: ConversationState;
  responseText: string;
  isEvaluated: boolean;
  evaluation?: {
    overallScore: number;
    feedbackSummary: string;
    strengths: string[];
    weaknesses: string[];
  };
}

export class ConversationStateMachine {
  private currentState: ConversationState = 'IDLE';
  private hasIntroduced = false;
  private turnCount = 0;
  private previousTopics: string[] = [];

  public resetSession(): void {
    this.currentState = 'IDLE';
    this.hasIntroduced = false;
    this.turnCount = 0;
    this.previousTopics = [];
  }

  public getState(): ConversationState {
    return this.currentState;
  }

  public setState(state: ConversationState): void {
    this.currentState = state;
    if (state === 'INTRODUCTION' || state === 'QUESTION') {
      this.hasIntroduced = true;
    }
  }

  public markIntroduced(): void {
    this.hasIntroduced = true;
    this.currentState = 'QUESTION';
  }

  public isIntroduced(): boolean {
    return this.hasIntroduced;
  }

  public processCandidateMessage(
    candidate: Candidate,
    currentQuestionTitle: string,
    text: string
  ): ProcessedConversationResponse {
    // CRITICAL FIX: Once INTRODUCTION has occurred, NEVER repeat greeting or restart session!
    if (!this.hasIntroduced) {
      this.hasIntroduced = true;
      this.currentState = 'QUESTION';
    }

    // Every message submitted after interview start is a technical turn
    this.turnCount++;
    this.currentState = 'EVALUATING';

    const lowerText = text.toLowerCase();
    let detectedTopic = 'REST API Architecture';
    if (lowerText.includes('redis') || lowerText.includes('cache')) detectedTopic = 'Redis Caching & Eviction';
    else if (lowerText.includes('vector') || lowerText.includes('hnsw')) detectedTopic = 'Vector Indexing & HNSW';
    else if (lowerText.includes('docker') || lowerText.includes('container')) detectedTopic = 'Docker Container Isolation';
    else if (lowerText.includes('sql') || lowerText.includes('postgres')) detectedTopic = 'Database Indexing';
    else if (lowerText.includes('queue') || lowerText.includes('kafka')) detectedTopic = 'Message Queue Buffering';
    else if (lowerText.includes('system') || lowerText.includes('scale')) detectedTopic = 'System Architecture';

    this.previousTopics.push(detectedTopic);

    const isStrong = text.length > 30 || lowerText.includes('scale') || lowerText.includes('latency') || lowerText.includes('cache') || lowerText.includes('concurrency');

    const strengths: string[] = [
      `Structured technical breakdown of ${detectedTopic}`,
      'Clear trade-off consideration under latency constraints'
    ];
    const weaknesses: string[] = [
      'Could elaborate further on cache invalidation bounds',
      'Didn\'t specify fallback circuit breaker thresholds'
    ];

    const feedbackSummary = isStrong
      ? `Strong analysis of ${detectedTopic}. Demonstrated practical architectural depth.`
      : `Baseline technical answer for ${detectedTopic}. Recommended deeper focus on edge cases.`;

    const followUpText = isStrong
      ? `Good evaluation on ${detectedTopic}. How would your architecture handle a sudden 10x traffic spike under memory-constrained bounds?`
      : `Understood. Consider how read-heavy workloads benefit from a caching layer. How would you prevent cache stampedes under high concurrency?`;

    this.currentState = 'NEXT_QUESTION';

    return {
      messageType: 'technical_answer',
      state: 'NEXT_QUESTION',
      responseText: followUpText,
      isEvaluated: true,
      evaluation: {
        overallScore: isStrong ? 92 : 78,
        feedbackSummary,
        strengths,
        weaknesses
      }
    };
  }
}

export const globalConversationStateMachine = new ConversationStateMachine();
