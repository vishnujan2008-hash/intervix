import React from 'react';
import { motion } from 'framer-motion';
import { InterviewMetrics } from '../types';
import { Clock, HelpCircle, Zap, Flame } from 'lucide-react';

interface ScoreCardProps {
  metrics: InterviewMetrics;
  timeElapsedSeconds: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ metrics, timeElapsedSeconds }) => {
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  const cards = [
    {
      title: 'Current Duration',
      value: formatTime(timeElapsedSeconds),
      subtext: 'Optimal pace (+4%)',
      icon: Clock,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'Questions Progress',
      value: `${metrics.questionsAsked} / ${metrics.questionsAsked + metrics.questionsRemaining}`,
      subtext: `${metrics.questionsRemaining} remaining`,
      icon: HelpCircle,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/20',
    },
    {
      title: 'Adaptive Difficulty',
      value: metrics.adaptiveDifficulty,
      subtext: 'Auto-scaling enabled',
      icon: Zap,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/20',
    },
    {
      title: 'Candidate Energy',
      value: metrics.candidateEnergy,
      subtext: 'High engagement',
      icon: Flame,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-panel rounded-xl p-4 border ${card.borderColor} flex flex-col justify-between hover:bg-secCardDark/60 transition-all`}
          >
            <div className="flex items-center justify-between text-xs text-textSec mb-2">
              <span>{card.title}</span>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight font-mono block">
                {card.value}
              </span>
              <span className="text-[10px] text-gray-400">{card.subtext}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
