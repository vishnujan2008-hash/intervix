import { EvaluationVector, EngineQuestion } from '../types/engine';

export class EvaluationEngine {
  public evaluateResponse(question: EngineQuestion, candidateAnswer: string): EvaluationVector {
    const textLength = candidateAnswer.length;
    const hasTechnicalKeywords = /hnsw|vector|embedding|logarithmic|recall|latency|mcp|rag/i.test(candidateAnswer);

    const baseScore = Math.min(99, Math.max(65, 75 + (hasTechnicalKeywords ? 18 : 5) + Math.min(10, Math.floor(textLength / 40))));

    return {
      technicalAccuracy: baseScore,
      conceptualUnderstanding: Math.min(99, baseScore + 2),
      reasoning: Math.min(99, baseScore - 1),
      communication: Math.min(99, baseScore + 1),
      problemSolving: Math.min(99, baseScore),
      architectureThinking: Math.min(99, baseScore + 3),
      confidence: Math.min(99, baseScore - 2),
      productionReadiness: Math.min(99, baseScore + 1),
      overallScore: baseScore,
      feedbackSummary: hasTechnicalKeywords 
        ? 'Strong technical precision with accurate architectural terminology.'
        : 'Good initial reasoning; recommend deeper quantitative trade-off analysis.',
    };
  }
}
