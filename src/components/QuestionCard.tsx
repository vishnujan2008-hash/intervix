import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../types';
import { Lightbulb, ChevronDown, ChevronUp, Clock, Sparkles, FastForward, ArrowRight, Copy, Check, Terminal } from 'lucide-react';
import { QuestionProgress } from './QuestionProgress';

interface QuestionCardProps {
  question: Question;
  onNext: () => void;
  onSkip: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onNext,
  onSkip,
}) => {
  const [showHints, setShowHints] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Dynamic code snippet selection based on question topic
  const dynamicCodeSnippet = getTopicCodeSnippet(question.title, question.content, question.codeSnippet);

  const handleCopyCode = () => {
    if (!dynamicCodeSnippet) return;
    navigator.clipboard.writeText(dynamicCodeSnippet.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden space-y-6 bg-[#050507]/90"
    >
      {/* Top Accent Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-400 opacity-90" />

      {/* Question Progress Meter */}
      <QuestionProgress
        currentNumber={question.number}
        totalQuestions={question.totalQuestions || 8}
        curriculumDay={question.curriculumDay}
      />

      {/* PRIORITY 10: Clean Stage & Header Format (Backend Architecture • Question 1 of 8) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-white/5 pb-4">
        <div className="flex items-center space-x-2.5">
          <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 tracking-wider uppercase">
            Backend Architecture • Question {question.number} of {question.totalQuestions || 8}
          </span>
          <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Difficulty: {question.difficulty}</span>
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs text-gray-400 font-mono">
          <span className="flex items-center space-x-1 text-gray-300">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Estimated: {question.estimatedTime}</span>
          </span>
        </div>
      </div>

      {/* Question Title & Prompt */}
      <div className="space-y-2">
        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug">
          {question.title}
        </h2>
        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-normal">
          {question.content}
        </p>
      </div>

      {/* PRIORITY 9: Topic-Specific Code Snippet (Redis / Docker / React / Architecture) */}
      {dynamicCodeSnippet && (
        <div className="rounded-2xl bg-[#09090B] border border-white/10 overflow-hidden font-mono text-xs shadow-2xl">
          <div className="px-4 py-2.5 bg-[#0D1117] border-b border-white/10 flex items-center justify-between text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 mr-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-gray-300">{dynamicCodeSnippet.filename}</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 flex items-center space-x-1 transition-colors"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 text-blue-200 overflow-x-auto relative flex">
            <div className="pr-4 border-r border-white/10 text-gray-600 text-right select-none font-mono text-[11px]">
              {dynamicCodeSnippet.code.split('\n').map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>
            <pre className="pl-4 leading-relaxed font-mono">{dynamicCodeSnippet.code}</pre>
          </div>
        </div>
      )}

      {/* PRIORITY 6: Clean Progressive Disclosure Drawers */}
      <div className="space-y-3 pt-2">
        {question.hints && question.hints.length > 0 && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 overflow-hidden transition-colors">
            <button
              onClick={() => setShowHints(!showHints)}
              className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-amber-300 hover:bg-amber-500/10 transition-colors"
            >
              <span className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Subtle Architectural Hint ({question.hints.length})</span>
              </span>
              {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {showHints && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-4 pb-4 pt-1 space-y-2 border-t border-amber-500/15"
                >
                  {question.hints.map((hint, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-amber-200/90 leading-relaxed">
                      <span className="font-mono text-amber-400 font-bold">•</span>
                      <span>{hint}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {question.explanation && (
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 overflow-hidden transition-colors">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-blue-300 hover:bg-blue-500/10 transition-colors"
            >
              <span className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Reference System Solution</span>
              </span>
              {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-4 pb-4 pt-2 border-t border-blue-500/15 text-xs text-blue-100 leading-relaxed"
                >
                  <p>{question.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Action Footer Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <button
          onClick={onSkip}
          className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-center space-x-1.5 font-mono"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Skip Question</span>
        </button>

        <button
          onClick={onNext}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center space-x-2 group"
        >
          <span>Next Question</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

// Priority 9: Dynamic Code Snippet Generator matching question topics
function getTopicCodeSnippet(title: string, content: string, existing?: string): { filename: string; code: string } {
  const combined = `${title} ${content}`.toLowerCase();

  if (combined.includes('redis') || combined.includes('cache')) {
    return {
      filename: 'redis_cache_service.ts',
      code: `import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

export async function getCachedOrFetch<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const freshData = await fetcher();
  await redis.setEx(key, ttl, JSON.stringify(freshData));
  return freshData;
}`
    };
  }

  if (combined.includes('docker') || combined.includes('container') || combined.includes('kubernetes')) {
    return {
      filename: 'Dockerfile',
      code: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`
    };
  }

  if (combined.includes('react') || combined.includes('frontend') || combined.includes('component')) {
    return {
      filename: 'VirtualizedFeed.tsx',
      code: `import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

export const VirtualizedFeed: React.FC<{ items: any[] }> = ({ items }) => {
  const Row = useMemo(() => ({ index, style }: any) => (
    <div style={style} className="p-3 border-b border-white/5 text-xs text-white font-mono">
      {items[index]?.title || 'Item'}
    </div>
  ), [items]);

  return <List height={400} itemCount={items.length} itemSize={45} width="100%">{Row}</List>;
};`
    };
  }

  // Default: System Design / Vector DB snippet
  return {
    filename: 'vector_search_indexer.ts',
    code: existing || `export interface VectorIndexConfig {
  dimensions: 1536;
  distanceMetric: 'cosine' | 'dotProduct';
  hnswM: 16;
  efConstruction: 200;
}

export async function queryVectorIndex(vector: number[], topK = 10) {
  const neighbors = await index.query({ vector, topK, includeMetadata: true });
  return neighbors.matches.map(m => ({ id: m.id, score: m.score }));
}`
  };
}
