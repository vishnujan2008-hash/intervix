import { Question } from '../types';

export const QUESTIONS_100: Question[] = Array.from({ length: 100 }).map((_, index) => {
  const qNum = index + 1;
  const curriculumDay = ((index % 10) + 1);
  const difficulties: ('Easy' | 'Medium' | 'Hard' | 'Adaptive')[] = ['Easy', 'Medium', 'Hard', 'Adaptive'];
  const difficulty = difficulties[index % difficulties.length];

  const topics = [
    { title: 'LLM Tokenization & Context Windows', day: 1 },
    { title: 'Chain-of-Thought & System Prompt Engineering', day: 2 },
    { title: 'RAG Retrieval Chunking & Hybrid Search', day: 3 },
    { title: 'HNSW Graph Indexing & Vector Databases', day: 4 },
    { title: 'Semantic Embeddings & Cosine Similarity', day: 5 },
    { title: 'PEFT, LoRA & QLoRA Quantization', day: 6 },
    { title: 'ReAct Agent Loops & Multi-Agent Systems', day: 7 },
    { title: 'Model Context Protocol (MCP) Tool Specs', day: 8 },
    { title: 'vLLM & Continuous Batching Deployment', day: 9 },
    { title: 'Prompt Injection & Red-Teaming Defense', day: 10 },
  ];

  const topicObj = topics[(curriculumDay - 1) % topics.length];

  return {
    id: `q-${qNum.toString().padStart(3, '0')}`,
    number: qNum,
    totalQuestions: 100,
    title: `${topicObj.title} — Part ${Math.floor(index / 10) + 1}`,
    difficulty,
    curriculumDay,
    estimatedTime: `${6 + (index % 6)} mins`,
    content: `When architecting production ${topicObj.title.toLowerCase()}, how do you optimize throughput and memory bandwidth under high concurrent query loads? Explain the key trade-offs between precision and latency.`,
    codeSnippet: `// Reference Architecture Code snippet for Question #${qNum}
async function executePipeline(query: VectorQuery): Promise<PipelineResult> {
  const embedding = await encoder.embed(query.text);
  const results = await vectorDb.query({
    vector: embedding,
    topK: ${10 + (index % 10)},
    indexParams: { efSearch: ${64 + index} }
  });
  return reranker.sort(results);
}`,
    hints: [
      `Analyze how O(log N) graph search complexity scales vs flat L2 distance metrics.`,
      `Consider memory bandwidth bottlenecks during GPU kernel execution.`,
      `Evaluate trade-offs when tuning hyperparameters M and efConstruction.`
    ],
    explanation: `Optimizing ${topicObj.title} requires balancing memory footprint against query recall. Hierarchical graph skip-lists achieve sub-linear latency while preserving 95%+ precision.`
  };
});
