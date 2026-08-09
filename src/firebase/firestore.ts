import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from './collections';
import { Candidate } from '../types';
import { EvaluationVector } from '../types/engine';

export interface StoredInterviewRecord {
  id: string;
  userId: string;
  candidate: Candidate;
  questions: any[];
  answers: any[];
  evaluation: EvaluationVector;
  timeline: any[];
  difficulty: string;
  scores: any;
  aiReasoning: string;
  recruiterReport: any;
  learningRoadmap: any;
  createdAt: any;
}

export interface UserSettingsRecord {
  voiceEnabled: boolean;
  preferredVoice: string;
  theme: string;
  preferredRole: string;
  language: string;
}

export const saveInterview = async (
  userId: string,
  sessionData: Omit<StoredInterviewRecord, 'id' | 'userId' | 'createdAt'>
): Promise<string> => {
  const newRef = doc(collection(db, COLLECTIONS.INTERVIEWS));
  const record: StoredInterviewRecord = {
    id: newRef.id,
    userId,
    ...sessionData,
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(newRef, record);
    return newRef.id;
  } catch (err: any) {
    console.warn('[Firestore] Failed to save interview session remotely:', err.message);
    return `local-${Date.now()}`;
  }
};

export const getInterviewHistory = async (userId: string): Promise<StoredInterviewRecord[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.INTERVIEWS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(docSnap => docSnap.data() as StoredInterviewRecord);
  } catch (err: any) {
    console.warn('[Firestore] Failed to load interview history:', err.message);
    return [];
  }
};

export const saveRecruiterReport = async (
  userId: string,
  report: any
): Promise<string> => {
  const newRef = doc(collection(db, COLLECTIONS.REPORTS));
  try {
    await setDoc(newRef, {
      id: newRef.id,
      userId,
      report,
      createdAt: serverTimestamp(),
    });
    return newRef.id;
  } catch (err: any) {
    console.warn('[Firestore] Failed to save recruiter report:', err.message);
    return `local-report-${Date.now()}`;
  }
};

export const saveUserSettings = async (userId: string, settings: UserSettingsRecord): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.SETTINGS, userId);
    await setDoc(ref, settings, { merge: true });
  } catch (err: any) {
    console.warn('[Firestore] Failed to save user settings:', err.message);
  }
};

export const loadUserSettings = async (userId: string): Promise<UserSettingsRecord | null> => {
  try {
    const ref = doc(db, COLLECTIONS.SETTINGS, userId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as UserSettingsRecord) : null;
  } catch (err: any) {
    console.warn('[Firestore] Failed to load user settings:', err.message);
    return null;
  }
};
