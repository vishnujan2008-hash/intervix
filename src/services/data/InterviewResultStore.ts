import { CandidateService } from './CandidateService';
import { globalComprehensiveReportEngine, InterviewResult } from '../../engine/ComprehensiveReportEngine';

const STORAGE_KEY = 'interview_os_completed_results_v2';

class InterviewResultStoreService {
  private resultsMap: Map<string, InterviewResult> = new Map();
  private initialized = false;

  private ensureInitialized() {
    if (this.initialized) return;
    this.initialized = true;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: InterviewResult[] = JSON.parse(stored);
        parsed.forEach(r => this.resultsMap.set(r.sessionId, r));
      }
    } catch (e) {
      console.warn('Failed to load stored interview results:', e);
    }

    this.ensureSeedResults();
  }

  private ensureSeedResults() {
    try {
      const candidates = CandidateService.getAllCandidates();
      candidates.forEach(cand => {
        const candidateResults = this.getResultsForCandidate(cand.id);
        if (candidateResults.length === 0) {
          const seedResult = globalComprehensiveReportEngine.buildInterviewResult(
            cand,
            [],
            {
              questionsAsked: cand.id === 'cand-002' ? 8 : cand.id === 'cand-001' ? 6 : 4,
              questionsRemaining: 0,
              timeElapsedSeconds: cand.id === 'cand-002' ? 872 : cand.id === 'cand-001' ? 645 : 410,
              adaptiveDifficulty: cand.targetDifficulty || 'Adaptive High',
              candidateEnergy: 'Optimal',
              candidateConfidence: cand.id === 'cand-002' ? 98 : cand.id === 'cand-001' ? 88 : 72,
              sessionHealth: 'Optimal (99.8%)'
            },
            Date.now() - (cand.id === 'cand-002' ? 872000 : cand.id === 'cand-001' ? 645000 : 410000),
            Date.now()
          );
          this.resultsMap.set(seedResult.sessionId, seedResult);
        }
      });
      this.persist();
    } catch (e) {
      console.warn('Failed to seed default interview results:', e);
    }
  }

  private persist() {
    try {
      const arr = Array.from(this.resultsMap.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch (e) {
      console.warn('Failed to persist interview results:', e);
    }
  }

  public getAllResults(): InterviewResult[] {
    this.ensureInitialized();
    return Array.from(this.resultsMap.values()).sort((a, b) => b.interviewEndTimestamp - a.interviewEndTimestamp);
  }

  public getResultsForCandidate(candidateId: string): InterviewResult[] {
    this.ensureInitialized();
    const all = Array.from(this.resultsMap.values()).filter(r => r.candidateId === candidateId);
    return all.sort((a, b) => b.interviewEndTimestamp - a.interviewEndTimestamp);
  }

  public getLatestResultForCandidate(candidateId: string): InterviewResult | undefined {
    const list = this.getResultsForCandidate(candidateId);
    return list[0];
  }

  public getResultForCandidate(candidateId: string): InterviewResult | undefined {
    return this.getLatestResultForCandidate(candidateId);
  }

  public getResultBySessionId(sessionId: string): InterviewResult | undefined {
    this.ensureInitialized();
    return this.resultsMap.get(sessionId);
  }

  public saveResult(result: InterviewResult): void {
    this.ensureInitialized();
    this.resultsMap.set(result.sessionId, result);
    this.persist();
  }
}

export const InterviewResultStore = new InterviewResultStoreService();
