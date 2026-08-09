export interface CurriculumKnowledgeTopic {
  day: number;
  title: string;
  coreConcepts: string[];
  suggestedQuestions: string[];
}

export class NotebookLMKnowledgeService {
  private curriculumMap: Map<number, CurriculumKnowledgeTopic> = new Map([
    [1, { day: 1, title: 'Prompt Engineering & Few-Shot In-Context Learning', coreConcepts: ['CoT', 'ReAct', 'Few-Shot'], suggestedQuestions: ['q-1', 'q-2'] }],
    [2, { day: 2, title: 'Vector Embeddings & Semantic Search', coreConcepts: ['Cosine Similarity', 'Text Embeddings', 'Chunking'], suggestedQuestions: ['q-3'] }],
    [3, { day: 3, title: 'RAG Architecture & Knowledge Retrieval', coreConcepts: ['Hybrid Search', 'Reciprocal Rank Fusion', 'Parent-Child Chunking'], suggestedQuestions: ['q-4', 'q-5'] }],
    [4, { day: 4, title: 'HNSW Graph Indexing & High-Throughput Search', coreConcepts: ['Skip Lists', 'Recall vs Latency', 'Graph Compaction'], suggestedQuestions: ['q-6'] }],
    [5, { day: 5, title: 'Parameter-Efficient Fine-Tuning (PEFT & LoRA)', coreConcepts: ['Low-Rank Adaptation', 'QLoRA', 'Rank Selection'], suggestedQuestions: ['q-7'] }],
    [6, { day: 6, title: 'Autonomous Agents & Tool Calling Architectures', coreConcepts: ['Function Calling', 'ReAct Loops', 'Multi-Agent Teams'], suggestedQuestions: ['q-8'] }],
    [7, { day: 7, title: 'Model Context Protocol (MCP) & Local Tools', coreConcepts: ['MCP Protocol', 'JSON-RPC 2.0', 'Tool Registries'], suggestedQuestions: ['q-9'] }],
    [8, { day: 8, title: 'vLLM, PagedAttention & High-Throughput Inference', coreConcepts: ['PagedAttention', 'KV Cache Compaction', 'Continuous Batching'], suggestedQuestions: ['q-10'] }],
    [9, { day: 9, title: 'LLM Security, Prompt Injection & Red Teaming', coreConcepts: ['Indirect Prompt Injection', 'Jailbreak Guardrails', 'Output Sanitization'], suggestedQuestions: ['q-11'] }],
    [10, { day: 10, title: 'Enterprise AI Governance & Multi-Cloud Deployment', coreConcepts: ['SLA Monitoring', 'Cost Optimization', 'Model Observability'], suggestedQuestions: ['q-12'] }],
  ]);

  public getCurriculumKnowledge(day: number): CurriculumKnowledgeTopic | undefined {
    return this.curriculumMap.get(day) || this.curriculumMap.get(1);
  }
}

export const globalNotebookLMKnowledgeService = new NotebookLMKnowledgeService();
