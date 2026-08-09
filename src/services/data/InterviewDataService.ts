import { CandidateService } from './CandidateService';
import { CurriculumService } from './CurriculumService';
import { Candidate, CurriculumDay } from '../../types/data';

class InterviewDataServiceClass {
  public buildGeminiPromptContext(candidateId: string, currentDayNumber: number): string {
    const candidate = CandidateService.getCandidate(candidateId);
    if (!candidate) {
      return 'Generic AI Candidate Context';
    }

    const completedMissions = candidate.missions.filter(m => m.passed);
    const weakMissions = candidate.missions.filter(m => !m.firstTry && m.passed);
    const skippedMissions = candidate.missions.filter(m => m.skipped);
    const currentDay: CurriculumDay | undefined = CurriculumService.getDay(currentDayNumber);

    return `
CANDIDATE CONTEXT INJECTION:
- Candidate: ${candidate.name}
- Role: ${candidate.role}
- Experience: ${candidate.experienceYears} years
- Education: ${candidate.education}
- Target Difficulty: ${candidate.targetDifficulty}

TELEMETRY & HISTORICAL SIGNALS:
- Completion Rate: ${candidate.signals.completionRate}% (${completedMissions.length}/${candidate.missions.length} missions passed)
- First Try Pass Rate: ${candidate.signals.firstTryRate}%
- Average Attempts Per Mission: ${candidate.signals.avgAttempts}
- Average Commit Days: ${candidate.signals.avgCommitDays}
- Weak Areas (Required Multiple Attempts): Day(s) ${weakMissions.map(m => m.dayNumber).join(', ') || 'None'}
- Skipped Missions: Day(s) ${skippedMissions.map(m => m.dayNumber).join(', ') || 'None'}

CURRENT EVALUATION STAGE:
- Curriculum Day: ${currentDayNumber} (${currentDay?.title || 'Advanced AI Evaluation'})
- Module: ${currentDay ? `Module ${currentDay.moduleNumber}` : 'Enterprise AI'}
- Objectives: ${currentDay?.objectives.join('; ') || 'Evaluate architectural depth'}
- Expected Tools/Frameworks: ${currentDay?.tools.join(', ') || 'Standard AI Stack'}
`.trim();
  }
}

export const InterviewDataService = new InterviewDataServiceClass();
