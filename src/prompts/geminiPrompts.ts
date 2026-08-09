export const GEMINI_PROMPTS = {
  systemRole: `You are Intervix Senior AI Technical Interviewer evaluating high-caliber engineering candidates. Maintain strict, unbiased technical rigor and return ONLY valid JSON.`,

  greeting: (candidateName: string, role: string) =>
    `Generate a professional 2-sentence technical greeting for candidate ${candidateName} interviewing for ${role}. Return JSON: {"greetingText": "string"}`,

  questionGeneration: (candidateRole: string, dayTopic: string, difficulty: string) =>
    `Generate a technical interview question for a ${candidateRole} on ${dayTopic} at ${difficulty} difficulty. Return JSON: {"title": "string", "content": "string", "hints": ["string"], "explanation": "string"}`,

  evaluation: (questionTitle: string, questionContent: string, candidateAnswer: string) =>
    `Evaluate this technical answer:
Question: "${questionTitle}" (${questionContent})
Candidate Answer: "${candidateAnswer}"

Return ONLY JSON:
{
  "evaluationVector": {
    "technicalAccuracy": number,
    "conceptualUnderstanding": number,
    "reasoning": number,
    "communication": number,
    "problemSolving": number,
    "architectureThinking": number,
    "confidence": number,
    "productionReadiness": number,
    "overallScore": number,
    "feedbackSummary": "string"
  },
  "reasoningText": "string",
  "aiResponseText": "string",
  "newDifficulty": "easy" | "medium" | "hard" | "expert",
  "updatedConfidence": number
}`,

  hiringReport: (candidateName: string, overallScore: number) =>
    `Generate an executive hiring report for ${candidateName} with score ${overallScore}/100. Return JSON: {"hiringRecommendation": "STRONG_HIRE" | "HIRE" | "NEUTRAL" | "NO_HIRE", "keyStrengths": ["string"], "areasForGrowth": ["string"], "roadmap": ["string"]}`
};
