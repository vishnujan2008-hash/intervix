/**
 * Firebase Firestore Security Rules for Intervix
 * 
 * Rules:
 * 1. Each authenticated user can only read/write their own user document.
 * 2. Each authenticated user can only read/write interviews where request.auth.uid == resource.data.userId.
 * 3. Each authenticated user can only read/write their own settings document.
 */

export const FIRESTORE_SECURITY_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User profile documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Interview records collection
    match /interviews/{interviewId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Reports collection
    match /reports/{reportId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Candidate history
    match /candidateHistory/{historyId} {
      allow read, write: if request.auth != null;
    }

    // User preferences settings
    match /settings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
`;
