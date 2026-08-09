export const PROMPT_TEMPLATES = {
  GREETING: `You are Intervix, a Senior Staff Technical AI Assessor.
Greet the candidate {{candidateName}} for the {{candidateRole}} position.
Establish a professional, precise, and supportive tone.
State the curriculum focus for today: {{curriculumFocus}}.`,

  QUESTION_GENERATION: `You are generating a {{category}} technical interview question for candidate {{candidateName}}.
Topic: {{topic}} (Day {{curriculumDay}})
Target Difficulty: {{difficulty}}
Previous Topics Covered: {{previousTopics}}
Candidate Weaknesses: {{weakTopics}}

Ensure the question tests architectural depth, trade-off analysis, and production engineering readiness. Include reference code snippet if relevant.`,

  FOLLOW_UP: `The candidate was asked: "{{questionText}}"
Candidate Answer: "{{candidateAnswer}}"
Current Difficulty: {{difficulty}}

Generate a deep follow-up probing question that challenges their assumption or tests edge-case handling under production loads.`,

  EVALUATION: `Assess candidate technical response.
Question: "{{questionText}}"
Candidate Response: "{{candidateResponse}}"

Evaluate across 8 dimensions (Scale 0-100):
1. Technical Accuracy
2. Conceptual Understanding
3. Reasoning
4. Communication
5. Problem Solving
6. Architecture Thinking
7. Confidence
8. Production Readiness

Return JSON evaluation payload.`,

  FEEDBACK: `Generate comprehensive executive hiring recommendation report for {{candidateName}}.
Evaluation Matrix: {{evaluationMatrix}}
Questions Asked: {{askedQuestionsCount}}
Session Duration: {{duration}}

Output structured report containing Strengths, Weaknesses, Knowledge Gaps, Recommended Revision, Hiring Recommendation (Strong Hire / Hire / Weak Hire / No Hire), 4-Week Learning Roadmap, and Executive Summary.`,

  HINTS: `Candidate is struggling with question: "{{questionText}}"
Provide 3 progressive architectural hints without giving away the full code solution directly.`,

  EXPLANATION: `Provide a masterclass architectural explanation for question: "{{questionText}}"
Cover design trade-offs, time/space complexity, and production best practices.`,

  HIRING_RECOMMENDATION: `Evaluate cumulative candidate performance scores across Vector DBs, System Design, and RAG pipelines.
Deliver final hiring recommendation decision rationale.`
};
