import { CandidateService } from './CandidateService';
import { CurriculumService } from './CurriculumService';
import { Candidate } from '../../types/data';

export interface DashboardStats {
  totalCandidates: number;
  completedInterviews: number;
  inProgress: number;
  averageExperience: number;
  averageMissionsCompleted: number;
  highestPerformingCandidate: Candidate | null;
  lowestPerformingCandidate: Candidate | null;
  averageFirstAttemptSuccess: number;
  candidatesRequiringReview: Candidate[];
  mostCommonFailedMission: string;
  recentCandidateActivity: Array<{ candidateName: string; action: string; time: string }>;
}

class AnalyticsServiceClass {
  public candidateCount(): number {
    return CandidateService.getAllCandidates().length;
  }

  public completedCount(): number {
    return CandidateService.getAllCandidates().filter(c => c.status === 'Completed').length;
  }

  public inProgressCount(): number {
    return CandidateService.getAllCandidates().filter(c => c.status === 'In Progress' || c.status === 'Ready').length;
  }

  public averageExperience(): number {
    const candidates = CandidateService.getAllCandidates();
    if (candidates.length === 0) return 0;
    const totalExp = candidates.reduce((acc, c: any) => acc + (c.yearsExperience || c.experienceYears || 0), 0);
    return Math.round((totalExp / candidates.length) * 10) / 10;
  }

  public averageCommitDays(): number {
    const candidates = CandidateService.getAllCandidates();
    if (candidates.length === 0) return 0;
    const totalCommitDays = candidates.reduce((acc, c) => acc + c.signals.avgCommitDays, 0);
    return Math.round((totalCommitDays / candidates.length) * 10) / 10;
  }

  public averageMissionCompletion(): number {
    const candidates = CandidateService.getAllCandidates();
    if (candidates.length === 0) return 0;
    const totalCompletion = candidates.reduce((acc, c) => acc + c.signals.completionRate, 0);
    return Math.round((totalCompletion / candidates.length) * 10) / 10;
  }

  public averageAttempts(): number {
    const candidates = CandidateService.getAllCandidates();
    if (candidates.length === 0) return 0;
    const totalAttempts = candidates.reduce((acc, c) => acc + c.signals.avgAttempts, 0);
    return Math.round((totalAttempts / candidates.length) * 100) / 100;
  }

  public firstTryRate(): number {
    const candidates = CandidateService.getAllCandidates();
    if (candidates.length === 0) return 0;
    const totalFirstTry = candidates.reduce((acc, c) => acc + c.signals.firstTryRate, 0);
    return Math.round((totalFirstTry / candidates.length) * 10) / 10;
  }

  public completionRate(): number {
    return this.averageMissionCompletion();
  }

  public calculateCompletion(candidateId: string): number {
    const candidate = CandidateService.getCandidate(candidateId);
    if (!candidate) return 0;
    return candidate.signals.completionRate;
  }

  public calculateSuccessRate(candidateId: string): number {
    const candidate = CandidateService.getCandidate(candidateId);
    if (!candidate) return 0;
    return candidate.signals.firstTryRate;
  }

  public calculateAttempts(candidateId: string): number {
    const candidate = CandidateService.getCandidate(candidateId);
    if (!candidate) return 0;
    return candidate.signals.avgAttempts;
  }

  public calculateCurrentModule(candidateId: string): number {
    const candidate = CandidateService.getCandidate(candidateId);
    if (!candidate) return 1;
    const completed = candidate.missions.filter(m => m.passed).length;
    return Math.min(8, Math.floor(completed / 4) + 1);
  }

  public calculateModuleCoverage(): Array<{ moduleTitle: string; coveragePercent: number }> {
    const modules = CurriculumService.getModules();
    const candidates = CandidateService.getAllCandidates();

    return modules.map(mod => {
      let totalPassed = 0;
      let totalMissions = mod.days.length * candidates.length;

      for (const cand of candidates) {
        for (const day of mod.days) {
          const mission = cand.missions.find(m => m.dayNumber === day.dayNumber);
          if (mission && mission.passed) totalPassed++;
        }
      }

      const coveragePercent = Math.round((totalPassed / (totalMissions || 1)) * 100);
      return {
        moduleTitle: mod.title.replace(/Module \d+ — /, ''),
        coveragePercent: Math.min(100, Math.max(10, coveragePercent))
      };
    });
  }

  public highestPerformingCandidate(): Candidate | null {
    const candidates = CandidateService.getAllCandidates();
    if (candidates.length === 0) return null;
    return [...candidates].sort((a, b) => b.signals.completionRate - a.signals.completionRate)[0];
  }

  public lowestPerformingCandidate(): Candidate | null {
    const candidates = CandidateService.getAllCandidates();
    if (candidates.length === 0) return null;
    return [...candidates].sort((a, b) => a.signals.completionRate - b.signals.completionRate)[0];
  }

  public candidatesRequiringReview(): Candidate[] {
    return CandidateService.getAllCandidates().filter(c => c.signals.completionRate < 80 || c.signals.avgAttempts > 1.5);
  }

  public mostCommonFailedMission(): string {
    const candidates = CandidateService.getAllCandidates();
    const failureCountMap = new Map<number, number>();

    for (const cand of candidates) {
      for (const m of cand.missions) {
        if (!m.passed) {
          failureCountMap.set(m.dayNumber, (failureCountMap.get(m.dayNumber) || 0) + 1);
        }
      }
    }

    let worstDay = 7;
    let maxFailures = 0;
    failureCountMap.forEach((count, day) => {
      if (count > maxFailures) {
        maxFailures = count;
        worstDay = day;
      }
    });

    const dayObj = CurriculumService.getDay(worstDay);
    return dayObj ? `Day ${worstDay}: ${dayObj.title}` : 'Day 7: Model Context Protocol';
  }

  public calculateDashboardStats(): DashboardStats {
    const candidates = CandidateService.getAllCandidates();
    const completedMissionsCount = candidates.reduce((acc, c) => acc + c.missions.filter(m => m.passed).length, 0);

    return {
      totalCandidates: candidates.length,
      completedInterviews: this.completedCount(),
      inProgress: this.inProgressCount(),
      averageExperience: this.averageExperience(),
      averageMissionsCompleted: Math.round((completedMissionsCount / (candidates.length || 1)) * 10) / 10,
      highestPerformingCandidate: this.highestPerformingCandidate(),
      lowestPerformingCandidate: this.lowestPerformingCandidate(),
      averageFirstAttemptSuccess: this.firstTryRate(),
      candidatesRequiringReview: this.candidatesRequiringReview(),
      mostCommonFailedMission: this.mostCommonFailedMission(),
      recentCandidateActivity: candidates.map(c => ({
        candidateName: c.name,
        action: `Passed Day ${c.missions.filter(m => m.passed).length} Mission`,
        time: `${(c.missions.filter(m => m.passed).length % 5) + 1} hours ago`
      }))
    };
  }
}

export const AnalyticsService = new AnalyticsServiceClass();
