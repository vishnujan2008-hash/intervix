import React from 'react';
import { useInterview } from '../context/InterviewContext';
import { IntervixLogo } from './IntervixLogo';
import { ScreenRoute } from '../types';
import { 
  LayoutDashboard, 
  Mic, 
  Users, 
  History, 
  BarChart3, 
  Settings, 
  Cpu, 
  UserCheck,
  ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentRoute, navigateTo, setSettingsOpen } = useInterview();

  const navItems: { route: ScreenRoute; label: string; icon: React.ElementType }[] = [
    { route: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { route: 'interview-session', label: 'Live Interview', icon: Mic },
    { route: 'candidate-selection', label: 'Candidates', icon: Users },
    { route: 'history', label: 'History Archive', icon: History },
    { route: 'analytics', label: 'Analytics Matrix', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 h-screen bg-[#050507]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-5 z-40 fixed left-0 top-0 select-none">
      {/* Top Branding Header */}
      <div>
        <div 
          onClick={() => navigateTo('dashboard')}
          className="cursor-pointer group mb-8 pb-6 border-b border-white/10"
        >
          <IntervixLogo variant="full" />
        </div>

        {/* Navigation Menu Links */}
        <nav className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 px-3 block mb-2 font-bold">
            Workspace
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => navigateTo(item.route)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between group ${
                  isActive
                    ? 'bg-blue-600/20 text-white border border-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.2)] font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60A5FA]" />}
              </button>
            );
          })}

          <button
            onClick={() => setSettingsOpen(true)}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 border border-transparent transition-all flex items-center space-x-3"
          >
            <Settings className="w-4 h-4 text-gray-400" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Bottom User Card */}
      <div className="pt-4 border-t border-white/10">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs border border-white/20 shadow-md">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">Enterprise Recruiter</h4>
            <p className="text-[10px] text-emerald-400 font-mono font-medium truncate">● Gemini 3.6 Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
