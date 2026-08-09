import { PROMPT_TEMPLATES } from '../prompts/templates';

export class PromptEngine {
  public assembleGreetingPrompt(candidateName: string, candidateRole: string, focus: string): string {
    return PROMPT_TEMPLATES.GREETING
      .replace('{{candidateName}}', candidateName)
      .replace('{{candidateRole}}', candidateRole)
      .replace('{{curriculumFocus}}', focus);
  }

  public assembleQuestionPrompt(candidateName: string, category: string, topic: string, day: number, difficulty: string): string {
    return PROMPT_TEMPLATES.QUESTION_GENERATION
      .replace('{{category}}', category)
      .replace('{{candidateName}}', candidateName)
      .replace('{{topic}}', topic)
      .replace('{{curriculumDay}}', day.toString())
      .replace('{{difficulty}}', difficulty);
  }

  public assembleEvaluationPrompt(questionText: string, candidateResponse: string): string {
    return PROMPT_TEMPLATES.EVALUATION
      .replace('{{questionText}}', questionText)
      .replace('{{candidateResponse}}', candidateResponse);
  }
}
