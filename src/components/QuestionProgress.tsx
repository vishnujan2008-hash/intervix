import React from 'react';
import { motion } from 'framer-motion';

interface QuestionProgressProps {
  currentNumber: number;
  totalQuestions: number;
  curriculumDay: number;
}

export const QuestionProgress: React.FC<QuestionProgressProps> = ({
  currentNumber,
  totalQuestions,
  curriculumDay,
}) => {
  const percent = Math.round((currentNumber / totalQuestions) * 100);

  const stages = [
    { label: 'Introduction', minDay: 1 },
    { label: 'Technical', minDay: 5 },
    { label: 'Coding', minDay: 12 },
    { label: 'Architecture', minDay: 18 },
    { label: 'Behavioral', minDay: 26 },
    { label: 'Summary', minDay: 31 },
  ];

  const currentStageIndex = stages.findIndex((s, i) => {
    const nextStage = stages[i + 1];
    return curriculumDay >= s.minDay && (!nextStage || curriculumDay < nextStage.minDay);
  });

  return (
    <div className="w-full space-y-3">
      {/* REQUIREMENT 8: Stage Progression Pipeline */}
      <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 overflow-x-auto pb-1 gap-1">
        {stages.map((stage, idx) => {
          const isActive = idx === Math.max(0, currentStageIndex);
          const isPassed = idx < Math.max(0, currentStageIndex);

          return (
            <div key={idx} className="flex items-center space-x-1.5 flex-shrink-0">
              <span className={`px-2 py-0.5 rounded-lg border transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-bold border-blue-400/40 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                  : isPassed
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                  : 'bg-white/5 text-gray-500 border-white/5'
              }`}>
                {stage.label}
              </span>
              {idx < stages.length - 1 && <span className="text-gray-600">→</span>}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
        <span>Day {curriculumDay} / 31 (Mission {currentNumber})</span>
        <span className="text-blue-400 font-bold">{percent}% Curriculum Progress</span>
      </div>

      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-400 rounded-full"
        />
      </div>
    </div>
  );
};
