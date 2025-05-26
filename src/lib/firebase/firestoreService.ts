
import { type Timestamp } from "firebase/firestore";
// import { db } from "@/lib/firebaseConfig"; // Firebase config might not be needed if auth is fully removed
// import type { UserRole } from "@/lib/constants"; // UserRole removed

export interface UserProfileData {
  email: string;
  // role: UserRole; // UserRole removed
  displayName?: string;
}

export interface UserProfileDocument extends UserProfileData {
  uid: string;
  createdAt: Timestamp;
}

export const createUserProfile = async (uid: string, data: UserProfileData): Promise<void> => {
  console.warn("FirestoreService: createUserProfile called but auth is disabled.");
  // In a real scenario where Firestore is still used for other things,
  // you might keep the db import and actual Firestore logic.
  // For now, this is a no-op.
  return Promise.resolve();
};

export const getUserProfile = async (uid: string): Promise<UserProfileData | null> => {
  console.warn("FirestoreService: getUserProfile called but auth is disabled.");
  return Promise.resolve(null);
};
