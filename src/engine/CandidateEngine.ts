import { Candidate } from '../types';
import { CANDIDATES_50 } from '../data/candidatesData';

export class CandidateEngine {
  private candidates: Candidate[] = CANDIDATES_50;

  public getCandidateById(id: string): Candidate | undefined {
    return this.candidates.find(c => c.id === id);
  }

  public getAllCandidates(): Candidate[] {
    return [...this.candidates];
  }

  public updateCandidateStatus(id: string, status: 'Ready' | 'In Progress' | 'Completed', score?: number): void {
    this.candidates = this.candidates.map(c => 
      c.id === id ? { ...c, status, score: score !== undefined ? score : c.score } : c
    );
  }
}
