import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import { COLLECTIONS } from './collections';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: any;
  lastLogin: any;
  interviewCount: number;
  averageScore: number;
  bestScore: number;
  preferredRole: string;
}

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await createUserProfile(result.user);
    }
    return result.user;
  } catch (err: any) {
    console.warn('[FirebaseAuth] Google sign-in bypassed or failed:', err.message);
    return null;
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (err: any) {
    console.warn('[FirebaseAuth] Sign-out error:', err.message);
  }
};

export const subscribeToAuthChanges = (onUserChanged: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      await createUserProfile(user);
    }
    onUserChanged(user);
  });
};

export const createUserProfile = async (user: User): Promise<UserProfile> => {
  const userRef = doc(db, COLLECTIONS.USERS, user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const existing = snap.data() as UserProfile;
    const updated: Partial<UserProfile> = {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp(),
    };
    await setDoc(userRef, updated, { merge: true });
    return { ...existing, ...updated } as UserProfile;
  } else {
    const newProfile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      interviewCount: 0,
      averageScore: 0,
      bestScore: 0,
      preferredRole: 'Senior AI Research Engineer',
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const snap = await getDoc(userRef);
    return snap.exists() ? (snap.data() as UserProfile) : null;
  } catch (err: any) {
    console.warn('[FirebaseAuth] getUserProfile error:', err.message);
    return null;
  }
};
