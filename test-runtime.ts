import { handleInterviewApi } from './src/api/interview.js';
import { CandidateService } from './src/services/data/CandidateService.js';
import { InterviewDataService } from './src/services/data/InterviewDataService.js';

async function runRuntimeVerification() {
  console.log('--- STARTING TEXT INTERVIEW MODE RUNTIME VERIFICATION ---');

  // 1. Candidate lookup
  const candidate = CandidateService.getCandidate('cand-001');
  console.log('Candidate:', candidate?.name, '(', candidate?.role, ')');

  // 2. Build prompt context
  const context = InterviewDataService.buildGeminiPromptContext('cand-001', 15);
  console.log('\n[Gemini Prompt Context Injected]:\n', context);

  // 3. Execute API call
  const req = {
    sessionId: `test-session-${Date.now()}`,
    candidateId: 'cand-001',
    message: 'In HNSW graph indexing, memory consumption scales linearly with connectivity parameter M. To prevent vector retrieval drift, we implement hybrid keyword re-ranking with BM25.',
    dayNumber: 15
  };

  const response = await handleInterviewApi(req);
  console.log('\n[InterviewEngine Response]:\n', JSON.stringify(response, null, 2));

  console.log('--- RUNTIME VERIFICATION COMPLETE ---');
}

runRuntimeVerification().catch(console.error);
