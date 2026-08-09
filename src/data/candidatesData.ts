import { Candidate } from '../types';
import { CandidateService } from '../services/data/CandidateService';

export const CANDIDATES_50: Candidate[] = CandidateService.getAllCandidates() as any;
