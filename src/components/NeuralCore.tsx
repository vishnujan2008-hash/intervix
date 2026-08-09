import React from 'react';
import { motion } from 'framer-motion';
import { AIStatus } from '../types';

interface NeuralCoreProps {
  status: AIStatus;
  onStatusClick?: () => void;
}

export const NeuralCore: React.FC<NeuralCoreProps> = ({ status, onStatusClick }) => {
  const themeMap = {
    idle: {
      primaryColor: '#3B82F6',
      accentColor: '#60A5FA',
      glowFilter: 'shadow-[0_0_60px_rgba(59,130,246,0.25)]',
      gradient: 'from-blue-500/25 via-slate-800/10 to-transparent',
      label: 'IDLE / READY',
      sublabel: 'Neural Core Ready • Awaiting Candidate Response',
      particleColor: '#93C5FD',
      pulseSpeed: 3.5,
    },
    listening: {
      primaryColor: '#22D3EE',
      accentColor: '#67E8F9',
      glowFilter: 'shadow-[0_0_90px_rgba(34,211,238,0.4)]',
      gradient: 'from-cyan-500/35 via-blue-600/20 to-transparent',
      label: 'LISTENING...',
      sublabel: 'Capturing Audio Frequency & Speech Telemetry',
      particleColor: '#A5F3FC',
      pulseSpeed: 1.4,
    },
    thinking: {
      primaryColor: '#A855F7',
      accentColor: '#C084FC',
      glowFilter: 'shadow-[0_0_100px_rgba(168,85,247,0.45)]',
      gradient: 'from-purple-500/40 via-indigo-600/25 to-transparent',
      label: 'THINKING & REASONING...',
      sublabel: 'Searching Breeth Memory Context & Evaluating Vector Depth',
      particleColor: '#E9D5FF',
      pulseSpeed: 1.8,
    },
    speaking: {
      primaryColor: '#60A5FA',
      accentColor: '#93C5FD',
      glowFilter: 'shadow-[0_0_110px_rgba(96,165,250,0.5)]',
      gradient: 'from-blue-400/45 via-indigo-500/30 to-transparent',
      label: 'SPEAKING...',
      sublabel: 'Synthesizing Adaptive Follow-up & Evaluation Guidance',
      particleColor: '#BFDBFE',
      pulseSpeed: 0.85,
    },
    paused: {
      primaryColor: '#F59E0B',
      accentColor: '#FCD34D',
      glowFilter: 'shadow-[0_0_50px_rgba(245,158,11,0.3)]',
      gradient: 'from-amber-500/25 via-slate-800/10 to-transparent',
      label: 'PAUSED',
      sublabel: 'Session Paused by Recruiter',
      particleColor: '#FDE68A',
      pulseSpeed: 4.5,
    },
  };

  const theme = themeMap[status] || themeMap.idle;

  const particleNodes = [
    { cx: 30, cy: 40, r: 2.5 },
    { cx: 70, cy: 25, r: 2 },
    { cx: 120, cy: 50, r: 3 },
    { cx: 160, cy: 30, r: 2 },
    { cx: 190, cy: 70, r: 2.5 },
    { cx: 40, cy: 110, r: 2 },
    { cx: 85, cy: 140, r: 3 },
    { cx: 135, cy: 125, r: 2 },
    { cx: 175, cy: 155, r: 2.5 },
    { cx: 60, cy: 180, r: 2 },
    { cx: 110, cy: 190, r: 3 },
    { cx: 150, cy: 185, r: 2 },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center py-2 w-full select-none">
      {/* Ambient Mesh Glow Backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{
            scale: status === 'speaking' ? [1, 1.25, 1] : status === 'thinking' ? [1, 1.18, 1] : [1, 1.05, 1],
            opacity: [0.45, 0.75, 0.45],
          }}
          transition={{
            duration: theme.pulseSpeed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr ${theme.gradient} blur-3xl transition-colors duration-700`}
        />
      </div>

      {/* Floating 3D Orb Stage */}
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        onClick={onStatusClick}
        className="relative group cursor-pointer flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72"
      >
        {/* Ring 1: Outer Rotating Track */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-white/10 opacity-40"
        />

        {/* Ring 2: Counter-Rotating Dashed Orbit Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full border border-dashed border-white/20"
        >
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: theme.accentColor, boxShadow: `0 0 12px ${theme.accentColor}` }}
          />
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
            style={{ backgroundColor: theme.primaryColor, boxShadow: `0 0 8px ${theme.primaryColor}` }}
          />
        </motion.div>

        {/* Ring 3: Concentric Breathing Ring */}
        <motion.div
          animate={{
            scale: status === 'speaking' ? [1, 1.1, 1] : [1, 1.04, 1],
            opacity: [0.4, 0.85, 0.4],
          }}
          transition={{
            duration: theme.pulseSpeed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute inset-7 rounded-full border-2 ${theme.glowFilter} transition-all duration-700`}
          style={{ borderColor: `${theme.primaryColor}60` }}
        />

        {/* Ring 4: Core Glass Orb Sphere */}
        <div className="absolute inset-12 rounded-full border border-white/20 bg-[#050507]/90 backdrop-blur-2xl flex items-center justify-center overflow-hidden shadow-2xl">
          <svg className="absolute inset-0 w-full h-full opacity-60">
            <path
              d="M 30 40 L 70 25 L 120 50 L 160 30 L 190 70 M 40 110 L 85 140 L 135 125 M 60 180 L 110 190"
              stroke={theme.primaryColor}
              strokeWidth="0.75"
              strokeDasharray="3 3"
              fill="none"
              opacity="0.6"
            />
            
            {particleNodes.map((node, i) => (
              <motion.circle
                key={i}
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                fill={theme.particleColor}
                animate={{
                  opacity: [0.3, 0.9, 0.3],
                  scale: [1, 1.25, 1],
                }}
                transition={{
                  duration: 2 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </svg>

          {/* Core Wave Frequency Visualizer */}
          <motion.div
            animate={{
              scale: status === 'speaking' ? [1, 1.2, 1] : status === 'thinking' ? [1, 1.1, 1] : [1, 1.03, 1],
            }}
            transition={{
              duration: status === 'speaking' ? 0.7 : 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr ${theme.gradient} border border-white/30 backdrop-blur-md flex items-center justify-center shadow-inner relative z-10`}
          >
            <div className="flex items-center space-x-1.5">
              {[0.4, 0.8, 1.2, 0.7, 1.0].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: status === 'speaking'
                      ? ['8px', '36px', '8px']
                      : status === 'listening'
                      ? ['6px', '22px', '6px']
                      : status === 'thinking'
                      ? ['10px', '20px', '10px']
                      : ['5px', '10px', '5px'],
                  }}
                  transition={{
                    duration: status === 'speaking' ? 0.4 : 0.85,
                    repeat: Infinity,
                    delay: i * 0.12,
                    ease: 'easeInOut',
                  }}
                  className="w-1.5 rounded-full"
                  style={{ backgroundColor: theme.particleColor }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Status Label */}
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 flex flex-col items-center space-y-1 text-center"
      >
        <div 
          className="px-3.5 py-1 rounded-full border text-[10px] font-mono font-bold tracking-wider flex items-center space-x-2 backdrop-blur-md shadow-lg transition-all duration-500"
          style={{ 
            borderColor: `${theme.primaryColor}50`, 
            color: theme.accentColor,
            backgroundColor: `${theme.primaryColor}15` 
          }}
        >
          <span className="relative flex h-2 w-2">
            <span 
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: theme.accentColor }}
            />
            <span 
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: theme.accentColor }}
            />
          </span>
          <span>{theme.label}</span>
        </div>
        <p className="text-[11px] text-gray-400 font-medium">{theme.sublabel}</p>
      </motion.div>
    </div>
  );
};
