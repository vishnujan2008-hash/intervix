import { Candidate } from '../../types';

export interface CandidateMemoryEpisode {
  sessionId: string;
  candidateId: string;
  questionId: string;
  candidateAnswer: string;
  score: number;
  weakTopics: string[];
  timestamp: string;
}

export class BreethMemoryService {
  private memoryStore: Map<string, CandidateMemoryEpisode[]> = new Map();
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = (import.meta as any).env?.VITE_BREETH_API_KEY || '';
    this.baseUrl = (import.meta as any).env?.VITE_BREETH_API_URL || 'https://api.thebreeth.com/v1';
  }

  public async storeEpisode(candidate: Candidate, episode: CandidateMemoryEpisode): Promise<void> {
    // 1. Store in local fallback memory Map unconditionally
    const existing = this.memoryStore.get(candidate.id) || [];
    existing.push(episode);
    this.memoryStore.set(candidate.id, existing);

    // 2. Attempt remote Breeth API store with strict timeout and silent error protection
    if (this.apiKey) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);

      try {
        await fetch(`${this.baseUrl}/episodes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            candidateId: candidate.id,
            candidateName: candidate.name,
            score: episode.score,
            content: `Interview episode for ${candidate.name}: Score ${episode.score} on question ${episode.questionId}. Weak topics: ${episode.weakTopics.join(', ')}`,
            timestamp: episode.timestamp,
          }),
          signal: controller.signal,
        });
        clearTimeout(timer);
      } catch (err: any) {
        clearTimeout(timer);
        console.warn(`[BreethMemoryService] Remote Breeth API store bypassed (${err.message}). Safe local memory active.`);
      }
    }
  }

  public async retrieveHistory(candidateId: string): Promise<CandidateMemoryEpisode[]> {
    if (this.apiKey) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);

      try {
        const res = await fetch(`${this.baseUrl}/episodes?candidateId=${candidateId}`, {
          headers: { 'Authorization': `Bearer ${this.apiKey}` },
          signal: controller.signal,
        });
        clearTimeout(timer);
        if (res.ok) {
          const remoteData = await res.json();
          if (Array.isArray(remoteData)) {
            return remoteData;
          }
        }
      } catch (err) {
        clearTimeout(timer);
      }
    }

    // Fallback to local memory store
    return this.memoryStore.get(candidateId) || [];
  }

  public getCandidateMemoryContext(candidateId: string): string {
    const episodes = this.memoryStore.get(candidateId) || [];
    if (episodes.length === 0) {
      return 'No prior interview session history. Candidate starting fresh.';
    }
    const weakTopics = Array.from(new Set(episodes.flatMap(e => e.weakTopics)));
    const avgScore = Math.round(episodes.reduce((acc, e) => acc + e.score, 0) / episodes.length);

    return `Previous sessions: ${episodes.length} evaluated questions. Average score: ${avgScore}%. Identified weak topics: ${weakTopics.join(', ') || 'None'}.`;
  }
}

export const globalBreethMemoryService = new BreethMemoryService();
