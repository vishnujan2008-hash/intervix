import candidatesRaw from '../../data/candidates.json';
import { MissionProgress } from '../../types/data';
import { CurriculumService } from './CurriculumService';
import { InterviewResultStore } from './InterviewResultStore';
import { globalComprehensiveReportEngine } from '../../engine/ComprehensiveReportEngine';

const CUSTOM_CANDIDATES_KEY = 'interview_os_custom_candidates_v1';

export interface NormalizedCandidate {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  education: string;
  avatar: string;
  email: string;
  status: 'Ready' | 'In Progress' | 'Completed';
  targetDifficulty: 'Standard' | 'Adaptive High' | 'Hardcore';
  missionsCompleted: number;
  totalMissions: number;
  commitDays: number;
  firstTryRate: number;
  avgAttempts: number;
  currentModule: number;
  currentMission: number;
  signals: {
    completionRate: number;
    firstTryRate: number;
    avgAttempts: number;
    avgCommitDays: number;
    technicalDepth: number;
    reasoningScore: number;
    communicationScore: number;
    missionsCompleted: number;
    missionsFirstTry: number;
    commitDays: number;
  };
  missions: MissionProgress[];
  techStack?: string[];
  score?: number;
  lastInterviewDate?: string;
}

class CandidateServiceClass {
  private getRawCandidatesList(): any[] {
    if (Array.isArray(candidatesRaw)) {
      return candidatesRaw;
    }
    if (candidatesRaw && typeof candidatesRaw === 'object' && Array.isArray((candidatesRaw as any).candidates)) {
      return (candidatesRaw as any).candidates;
    }
    return [];
  }

  public normalizeCandidate(c: any): NormalizedCandidate {
    const member = c.member || {};
    const id = member.id || c.id || `cand-${Math.random().toString(36).substr(2, 5)}`;
    const name = member.name || c.name || 'Anonymous Candidate';
    const role = member.jobRole || c.role || 'Software Engineer';
    const experienceYears = member.yearsExperience ?? c.experienceYears ?? 3;
    const education = member.education || c.education || 'B.S. Computer Science';
    const status = member.status || c.status || 'Ready';
    const avatar = c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
    const email = c.email || `${name.toLowerCase().replace(/\s+/g, '.')}@enterprise.ai`;
    const targetDifficulty = c.targetDifficulty || 'Adaptive High';

    const missionsList: any[] = Array.isArray(c.missions) ? c.missions : [];
    const passedMissions = missionsList.filter(m => m.passed);
    const missionsCompleted = c.signals?.missionsCompleted ?? passedMissions.length;
    const missionsFirstTry = c.signals?.missionsFirstTry ?? missionsList.filter(m => m.firstTry || (m.passed && m.attempts === 1)).length;
    
    const attemptsArray = missionsList.filter(m => (m.attempts || 0) > 0).map(m => m.attempts);
    const avgAttempts = c.signals?.avgAttempts ?? (attemptsArray.length > 0 ? parseFloat((attemptsArray.reduce((a: number, b: number) => a + b, 0) / attemptsArray.length).toFixed(2)) : 1.1);

    const commitDays = c.signals?.commitDays ?? c.signals?.avgCommitDays ?? 1.5;

    const highestCompletedDay = passedMissions.reduce((max, m) => Math.max(max, m.dayNumber || m.day || 0), 0);
    const highestMissionDay = missionsList.reduce((max, m) => Math.max(max, m.dayNumber || m.day || 0), 0);

    const currentModule = highestCompletedDay > 0 ? Math.min(8, Math.ceil(highestCompletedDay / 4)) : 1;
    const currentMission = highestCompletedDay > 0 ? highestCompletedDay : 1;

    const completionRate = Math.round((missionsCompleted / 31) * 100);
    const firstTryRate = missionsCompleted > 0 ? Math.round((missionsFirstTry / missionsCompleted) * 100) : (c.signals?.firstTryRate ?? 80);

    const normalizedMissions: MissionProgress[] = missionsList.map((m, idx) => ({
      missionId: m.missionId || `m-${idx + 1}`,
      dayNumber: m.dayNumber || m.day || (idx + 1),
      passed: !!m.passed,
      skipped: !!m.skipped,
      attempts: m.attempts || (m.passed ? 1 : 0),
      firstTry: m.firstTry !== undefined ? !!m.firstTry : (m.passed && (m.attempts === 1 || !m.attempts)),
      commitDays: m.commitDays || 1
    }));

    const normalized: NormalizedCandidate = {
      id,
      name,
      role,
      experienceYears,
      education,
      avatar,
      email,
      status,
      targetDifficulty,
      missionsCompleted,
      totalMissions: 31,
      commitDays,
      firstTryRate,
      avgAttempts,
      currentModule,
      currentMission: highestMissionDay || currentMission,
      signals: {
        completionRate: c.signals?.completionRate ?? completionRate,
        firstTryRate: c.signals?.firstTryRate ?? firstTryRate,
        avgAttempts,
        avgCommitDays: commitDays,
        technicalDepth: c.signals?.technicalDepth ?? 90,
        reasoningScore: c.signals?.reasoningScore ?? 88,
        communicationScore: c.signals?.communicationScore ?? 92,
        missionsCompleted,
        missionsFirstTry,
        commitDays
      },
      missions: normalizedMissions,
      score: completionRate,
      lastInterviewDate: `2026-08-0${(missionsCompleted % 7) + 1}`
    };

    normalized.techStack = this.generateSkills(normalized);
    return normalized;
  }

  public getAllCandidates(): NormalizedCandidate[] {
    const rawList = this.getRawCandidatesList();
    const baseList = rawList.map(c => this.normalizeCandidate(c));

    let customList: any[] = [];
    try {
      const stored = localStorage.getItem(CUSTOM_CANDIDATES_KEY);
      if (stored) {
        customList = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load custom candidates from localStorage:', e);
    }

    const normalizedCustom = customList.map(c => this.normalizeCandidate(c));
    return [...baseList, ...normalizedCustom];
  }

  public getCandidate(id: string): NormalizedCandidate | undefined {
    const all = this.getAllCandidates();
    return all.find(c => c.id === id) || all[0];
  }

  public addCandidate(data: {
    name: string;
    jobRole: string;
    yearsExperience: number;
    education: string;
    email?: string;
    targetDifficulty?: 'Standard' | 'Adaptive High' | 'Hardcore';
  }): NormalizedCandidate {
    const uniqueId = `cand-${Date.now()}`;
    const rawObj = {
      member: {
        id: uniqueId,
        name: data.name,
        jobRole: data.jobRole,
        yearsExperience: data.yearsExperience,
        education: data.education,
        status: 'Ready'
      },
      email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@enterprise.ai`,
      targetDifficulty: data.targetDifficulty || 'Adaptive High',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      missions: [
        { day: 1, passed: true, attempts: 1, firstTry: true, commitDays: 1 },
        { day: 2, passed: true, attempts: 1, firstTry: true, commitDays: 1 }
      ],
      signals: {
        completionRate: 70,
        firstTryRate: 85,
        avgAttempts: 1.1,
        avgCommitDays: 1.5,
        technicalDepth: 88,
        reasoningScore: 86,
        communicationScore: 90,
        missionsCompleted: 20,
        missionsFirstTry: 17,
        commitDays: 1.5
      }
    };

    try {
      const existingStr = localStorage.getItem(CUSTOM_CANDIDATES_KEY);
      const existing = existingStr ? JSON.parse(existingStr) : [];
      existing.push(rawObj);
      localStorage.setItem(CUSTOM_CANDIDATES_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to save custom candidate to localStorage:', e);
    }

    const normalized = this.normalizeCandidate(rawObj);

    // Also seed an initial InterviewResult in InterviewResultStore for this candidate
    try {
      const res = globalComprehensiveReportEngine.buildInterviewResult(
        normalized,
        [],
        {
          questionsAsked: 4,
          questionsRemaining: 0,
          timeElapsedSeconds: 520,
          adaptiveDifficulty: normalized.targetDifficulty,
          candidateEnergy: 'Optimal',
          candidateConfidence: 88,
          sessionHealth: 'Optimal (99.8%)'
        },
        Date.now() - 520000,
        Date.now()
      );
      InterviewResultStore.saveResult(res);
    } catch (e) {
      console.warn('Failed to seed InterviewResult for new candidate:', e);
    }

    return normalized;
  }

  public getCompletedMissions(id: string): MissionProgress[] {
    const candidate = this.getCandidate(id);
    if (!candidate) return [];
    return candidate.missions.filter(m => m.passed);
  }

  public getMissionProgress(id: string): MissionProgress[] {
    const candidate = this.getCandidate(id);
    return candidate ? candidate.missions : [];
  }

  public getSignals(id: string) {
    const candidate = this.getCandidate(id);
    return candidate ? candidate.signals : undefined;
  }

  public getCandidateSummary(id: string): string {
    const candidate = this.getCandidate(id);
    if (!candidate) return '';
    return `${candidate.name} (${candidate.role}) — ${candidate.experienceYears} yrs exp, ${candidate.education}. Completed ${candidate.missionsCompleted}/31 missions (${candidate.signals.completionRate}% completion rate).`;
  }

  public generateSkills(candidate: NormalizedCandidate): string[] {
    const passedDays = candidate.missions.filter(m => m.passed).map(m => m.dayNumber);
    const skillSet = new Set<string>();

    for (const dayNum of passedDays) {
      const tools = CurriculumService.getTools(dayNum);
      tools.forEach(t => skillSet.add(t));
    }

    if (skillSet.size === 0) {
      return ['Prompting', 'LLM Basics', 'Python'];
    }

    return Array.from(skillSet).slice(0, 6);
  }
}

export const CandidateService = new CandidateServiceClass();
