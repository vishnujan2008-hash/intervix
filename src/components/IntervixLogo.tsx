import React from 'react';

interface IntervixLogoProps {
  variant?: 'full' | 'compact' | 'icon-only' | 'hero';
  className?: string;
  iconSize?: number;
}

export const IntervixIcon: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Ambient Gold Glow Aura */}
      <div 
        className="absolute inset-0 rounded-full blur-md opacity-60 animate-pulse pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(245, 208, 97, 0.4) 0%, rgba(212, 175, 55, 0.1) 70%, transparent 100%)'
        }}
      />
      
      {/* Scalable SVG Logo Icon */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_2px_10px_rgba(245,208,97,0.3)]"
      >
        <defs>
          <linearGradient id="goldMetallicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="30%" stopColor="#F5D061" />
            <stop offset="65%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8A6C1B" />
          </linearGradient>

          <linearGradient id="goldBevelDark" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E6C254" />
            <stop offset="50%" stopColor="#B38F24" />
            <stop offset="100%" stopColor="#5E460B" />
          </linearGradient>

          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Beveled Hexagon Ring */}
        <polygon 
          points="50,6 88,28 88,72 50,94 12,72 12,28" 
          fill="none" 
          stroke="url(#goldMetallicGrad)" 
          strokeWidth="5" 
          strokeLinejoin="round"
        />

        {/* Inner Hexagon Facet Line */}
        <polygon 
          points="50,13 82,31 82,69 50,87 18,69 18,31" 
          fill="none" 
          stroke="url(#goldBevelDark)" 
          strokeWidth="1.8" 
          strokeDasharray="4 2"
          opacity="0.8"
        />

        {/* Central Vertical Pillar "I" */}
        <rect 
          x="34" 
          y="28" 
          width="8" 
          height="44" 
          rx="1.5" 
          fill="url(#goldMetallicGrad)" 
        />

        {/* Right Arrow / Stylized "K/X" Motif */}
        <path 
          d="M 50,30 L 68,48 L 74,48 L 54,28 Z" 
          fill="url(#goldMetallicGrad)" 
        />
        <path 
          d="M 50,70 L 68,52 L 74,52 L 54,72 Z" 
          fill="url(#goldBevelDark)" 
        />
        <path 
          d="M 64,44 L 74,50 L 64,56 Z" 
          fill="url(#goldMetallicGrad)" 
        />
      </svg>
    </div>
  );
};

export const IntervixLogo: React.FC<IntervixLogoProps> = ({
  variant = 'full',
  className = '',
  iconSize
}) => {
  if (variant === 'icon-only') {
    return <IntervixIcon size={iconSize || 36} className={className} />;
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2.5 ${className}`}>
        <IntervixIcon size={iconSize || 32} />
        <div className="flex items-center space-x-0.5 font-sans tracking-widest font-extrabold text-sm">
          <span className="text-white">INTERVI</span>
          <span className="bg-gradient-to-r from-[#FFE893] via-[#F5D061] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(245,208,97,0.4)]">
            X
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        {/* Large Ambient Backlit Glow Container */}
        <div className="relative flex items-center justify-center p-6 rounded-full">
          <div 
            className="absolute inset-0 rounded-full blur-2xl opacity-70 animate-pulse pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(245, 208, 97, 0.35) 0%, rgba(212, 175, 55, 0.12) 60%, transparent 100%)'
            }}
          />
          <IntervixIcon size={iconSize || 96} />
        </div>

        {/* Brand Typography */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-1 text-3xl md:text-5xl font-black tracking-[0.25em] font-sans">
            <span className="text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.2)]">INTERVI</span>
            <span className="bg-gradient-to-br from-[#FFF2B2] via-[#F5D061] to-[#B38F24] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(245,208,97,0.6)]">
              X
            </span>
          </div>

          {/* Subheading & Line Separator */}
          <div className="flex items-center justify-center space-x-3 text-[10px] md:text-xs font-mono tracking-[0.35em] text-gray-300 font-semibold uppercase pt-1">
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#F5D061]/60" />
            <span className="text-amber-200/90 drop-shadow-[0_0_8px_rgba(245,208,97,0.3)]">AI-POWERED INTERVIEWS</span>
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#F5D061]/60" />
          </div>
        </div>
      </div>
    );
  }

  // Full Standard Variant (Sidebar / Topbar)
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <IntervixIcon size={iconSize || 40} />
      <div className="flex flex-col">
        <div className="flex items-center space-x-0.5 font-sans tracking-[0.2em] font-extrabold text-lg leading-none">
          <span className="text-white">INTERVI</span>
          <span className="bg-gradient-to-r from-[#FFF2B2] via-[#F5D061] to-[#D4AF37] bg-clip-text text-transparent">
            X
          </span>
        </div>
        <div className="flex items-center space-x-1 mt-1 text-[9px] font-mono tracking-[0.25em] text-amber-300/80 uppercase font-semibold">
          <span>AI-POWERED INTERVIEWS</span>
        </div>
      </div>
    </div>
  );
};
