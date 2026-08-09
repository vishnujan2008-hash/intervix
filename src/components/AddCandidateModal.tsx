import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { CandidateService } from '../services/data/CandidateService';
import { useInterview } from '../context/InterviewContext';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCandidateAdded: (newCandidate: any) => void;
}

export const AddCandidateModal: React.FC<AddCandidateModalProps> = ({
  isOpen,
  onClose,
  onCandidateAdded,
}) => {
  const { setSelectedCandidate } = useInterview();

  const [name, setName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [yearsExperience, setYearsExperience] = useState<number>(3);
  const [education, setEducation] = useState('B.S. Computer Science');
  const [email, setEmail] = useState('');
  const [targetDifficulty, setTargetDifficulty] = useState<'Standard' | 'Adaptive High' | 'Hardcore'>('Adaptive High');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Validation Rule: Save button enabled ONLY when all required fields are valid
  const isValid = name.trim().length > 0 && jobRole.trim().length > 0 && education.trim().length > 0 && yearsExperience >= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setErrorMsg('Please complete all required fields (Name, Role, Experience, and Education).');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      // Create new Candidate via CandidateService
      const newCandidate = CandidateService.addCandidate({
        name: name.trim(),
        jobRole: jobRole.trim(),
        yearsExperience: Number(yearsExperience),
        education: education.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@enterprise.ai`,
        targetDifficulty,
      });

      setSuccessMsg(`Successfully added candidate "${newCandidate.name}"!`);
      
      // Update global context & notify parent
      setSelectedCandidate(newCandidate);
      onCandidateAdded(newCandidate);

      // Reset form after short delay
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMsg(null);
        setName('');
        setJobRole('');
        setYearsExperience(3);
        setEducation('B.S. Computer Science');
        setEmail('');
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Failed to save candidate:', err);
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'An error occurred while saving the candidate. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg glass-panel rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl bg-[#09090B] relative overflow-hidden space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">Add New Candidate</h2>
                <p className="text-xs text-gray-400">Create candidate profile for technical interview evaluation.</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Notifications */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center space-x-2 font-mono">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center space-x-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-gray-300 font-semibold block">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Test Candidate"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-sans text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold block">Role / Job Title *</label>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Senior AI Engineer"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-sans text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold block">Years Experience *</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-semibold block">Education *</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. B.S. Computer Science"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-sans text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold block">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@enterprise.ai"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-sans text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold block">Target Rigor</label>
                <select
                  value={targetDifficulty}
                  onChange={(e) => setTargetDifficulty(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono text-xs"
                >
                  <option value="Standard">Standard</option>
                  <option value="Adaptive High">Adaptive High</option>
                  <option value="Hardcore">Hardcore</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/10 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`px-6 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center space-x-2 transition-all ${
                  isValid && !isSubmitting
                    ? 'bg-blue-600 hover:bg-blue-500 border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.4)] cursor-pointer'
                    : 'bg-white/10 text-gray-500 border border-transparent cursor-not-allowed opacity-60'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving Candidate...' : 'Save Candidate'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
