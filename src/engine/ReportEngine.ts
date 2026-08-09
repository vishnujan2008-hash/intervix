import { InterviewResult } from './ComprehensiveReportEngine';

export class ReportEngine {
  public exportJSON(result: InterviewResult): string {
    return JSON.stringify(result, null, 2);
  }

  public exportMarkdown(result: InterviewResult): string {
    return `# Intervix Executive Assessment Brief

**Candidate:** ${result.candidateName} (${result.candidateRole})  
**Session ID:** ${result.sessionId}  
**Overall Index:** ${result.overallScore} / 100  
**Hiring Recommendation:** **${result.recommendationBadge}** (${result.recommendationReason})  
**Session Duration:** ${result.durationFormatted}  
**Completed At:** ${new Date(result.interviewEndTimestamp || Date.now()).toISOString()}  

---

## 1. Executive Summary
${result.executiveSummary}

## 2. Hiring Recommendation
**Verdict:** ${result.recommendationBadge}  
**Reasoning:** ${result.recommendationReason}

## 3. Core Technical Strengths
${result.strengths.map(s => `- ${s}`).join('\n')}

## 4. Areas for Improvement (Weaknesses)
${result.weaknesses.map(w => `- ${w}`).join('\n')}

## 5. Question Timeline & Reasoning Log
${result.questionTimeline.map(q => `### Question ${q.questionNumber}: ${q.questionTitle} (${q.result})
- **Candidate Answer:** "${q.candidateAnswerText}"
- **Gemini Evaluation:** ${q.geminiEvaluation}
${q.followUpQuestion ? `- **Adaptive Follow-up:** ${q.followUpQuestion}` : ''}
`).join('\n')}

## 6. Qualitative Skill Evaluation
${result.skillRadar.map(s => `- **${s.skill}:** ${s.rating}`).join('\n')}

## 7. Evidence-Based Statements & Quotes
${result.evidenceQuotes.map(eq => `- ${eq}`).join('\n')}

## 8. Missed Opportunities
${result.missedOpportunities.map(m => `- ${m}`).join('\n')}

## 9. Next Learning Focus (Roadmap)
${result.improvementPlan.map((p, idx) => `${idx + 1}. ${p}`).join('\n')}

## 10. Interview Analytics
- **Questions Asked:** ${result.statistics.questionsAsked}
- **Questions Answered:** ${result.statistics.questionsAnswered}
- **Average Response Length:** ${result.statistics.avgAnswerLengthChars} chars
- **Adaptive Rigor Reached:** ${result.statistics.adaptiveDifficultyReached}

## 11. AI Assessor Confidence
**Rating:** ${result.aiConfidence} Confidence  
**Reasoning:** ${result.aiConfidenceReason}

## 12. Final Hiring Committee Verdict
"${result.finalVerdict}"
`;
  }
}

export const globalReportEngine = new ReportEngine();
