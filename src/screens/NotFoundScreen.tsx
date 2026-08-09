import React from 'react';
import { useInterview } from '../context/InterviewContext';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export const NotFoundScreen: React.FC = () => {
  const { navigateTo } = useInterview();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-extrabold text-white">404 — Route Not Found</h1>
      <p className="text-xs text-textSec max-w-sm">
        The requested neural route or screen does not exist within the Intervix system matrix.
      </p>
      <button
        onClick={() => navigateTo('dashboard')}
        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Platform Dashboard</span>
      </button>
    </div>
  );
};
