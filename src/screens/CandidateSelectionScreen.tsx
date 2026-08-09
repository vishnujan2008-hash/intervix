import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInterview } from '../context/InterviewContext';
import { CandidateCard } from '../components/CandidateCard';
import { AddCandidateModal } from '../components/AddCandidateModal';
import { CandidateService } from '../services/data/CandidateService';
import { UserPlus, Search, ArrowRight } from 'lucide-react';

export const CandidateSelectionScreen: React.FC = () => {
  const { selectedCandidate, setSelectedCandidate, navigateTo } = useInterview();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically load candidates list from CandidateService (merging static + custom candidates)
  const candidatesList = CandidateService.getAllCandidates();

  const filteredCandidates = candidatesList.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.techStack && c.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Candidate Roster Selection
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Select a candidate profile to configure real-time AI technical evaluation parameters.
          </p>
        </div>

        <button 
          onClick={() => navigateTo('interview-config')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center space-x-2"
        >
          <span>Proceed with {selectedCandidate.name}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3 flex-1 bg-[#09090B] px-4 py-2.5 rounded-xl border border-white/10">
          <Search className="w-4 h-4 text-gray-500" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name, role, or tech stack..."
            className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none w-full font-mono"
          />
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-xs text-blue-300 hover:text-white flex items-center space-x-2 transition-all font-mono"
        >
          <UserPlus className="w-4 h-4 text-blue-400" />
          <span className="hidden sm:inline">Add Candidate</span>
        </button>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((cand) => (
          <CandidateCard
            key={cand.id}
            candidate={cand}
            isSelected={selectedCandidate.id === cand.id}
            onSelect={(c) => {
              setSelectedCandidate(c);
              navigateTo('interview-config');
            }}
          />
        ))}
      </div>

      {/* Add Candidate Modal */}
      <AddCandidateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCandidateAdded={(newCand) => {
          setSelectedCandidate(newCand);
        }}
      />
    </div>
  );
};
