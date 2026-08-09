import React from 'react';
import { AnalyticsPanel } from '../components/AnalyticsPanel';
import { BarChart3 } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';

export const AnalyticsScreen: React.FC = () => {
  const { selectedCandidate } = useInterview();

  return (
    <div className="space-y-8 pb-12">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>ENTERPRISE CANDIDATE TELEMETRY</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Candidate Analytics & Assessment Telemetry
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-light">
          Real-time evaluation insights and knowledge radar for <span className="text-white font-semibold">{selectedCandidate.name}</span> ({selectedCandidate.role}).
        </p>
      </div>

      <AnalyticsPanel />
    </div>
  );
};
