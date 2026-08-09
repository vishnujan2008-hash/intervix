import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CurriculumService } from '../services/data/CurriculumService';
import { CheckCircle2, Circle, Layers, ChevronDown, ChevronUp } from 'lucide-react';

interface CurriculumTimelineProps {
  onSelectTopic?: (dayNumber: number) => void;
  defaultExpanded?: boolean;
}

export const CurriculumTimeline: React.FC<CurriculumTimelineProps> = ({
  onSelectTopic,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const modules = CurriculumService.getModules();

  return (
    <div className="w-full glass-panel rounded-3xl border border-white/10 shadow-xl overflow-hidden bg-[#050507]/80">
      {/* Timeline Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-xs font-semibold text-white hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>31-Day / 8-Module AI Curriculum</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400 font-mono text-[11px]">
          <span>Day 15 Active</span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {/* Modules List Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="p-4 pt-0 border-t border-white/5 space-y-4 max-h-[380px] overflow-y-auto"
          >
            {modules.map((mod) => (
              <div key={mod.moduleNumber} className="space-y-2 pt-2">
                <div className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                  Module {mod.moduleNumber}: {mod.title.replace(`Module ${mod.moduleNumber} — `, '')}
                </div>

                <div className="space-y-1.5 pl-1">
                  {mod.days.map((day) => {
                    const isCompleted = day.dayNumber < 15;
                    const isCurrent = day.dayNumber === 15;

                    return (
                      <motion.div
                        key={day.dayNumber}
                        onClick={() => onSelectTopic && onSelectTopic(day.dayNumber)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isCurrent
                            ? 'bg-blue-600/15 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                            : isCompleted
                            ? 'bg-white/5 border-emerald-500/20 hover:border-emerald-500/40'
                            : 'bg-transparent border-white/5 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          ) : isCurrent ? (
                            <Circle className="w-3.5 h-3.5 text-blue-400 fill-blue-400/30 flex-shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                          )}
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-mono text-gray-400">Day {day.dayNumber}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-gray-300 font-mono">{day.type}</span>
                            </div>
                            <h4 className="text-xs font-medium text-gray-200 line-clamp-1">{day.title}</h4>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
