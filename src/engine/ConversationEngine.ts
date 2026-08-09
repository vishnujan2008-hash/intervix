export class ConversationEngine {
  public generateGreeting(candidateName: string, role: string, topic: string): string {
    return `Welcome to Intervix, ${candidateName}. I am your Lead AI Assessor. Today we will evaluate your technical depth for the ${role} position, focusing on ${topic}. Shall we begin?`;
  }

  public generateFollowUp(questionTitle: string, candidateAnswer: string): string {
    return `I noticed your emphasis on ${candidateAnswer.substring(0, 30)}... How would your architecture handle sudden 10x traffic spikes under low memory constraints?`;
  }

  public generateClarificationRequest(candidateAnswer: string): string {
    return `Could you elaborate further on how you would configure the indexing trade-offs to balance recall vs latency?`;
  }
}
