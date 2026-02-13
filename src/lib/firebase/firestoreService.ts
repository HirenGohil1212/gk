import { doc, setDoc, getDoc, serverTimestamp, type DocumentData, type Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import type { LandArea } from "@/lib/constants";

export interface UserProfileData {
  uid: string;
  email: string;
  name: string;
  village: string;
  landArea: LandArea;
}

export interface UserProfileDocument extends UserProfileData {
  createdAt: Timestamp;
}

export const createUserProfile = async (uid: string, data: UserProfileData): Promise<void> => {
  const userProfileRef = doc(db, "users", uid);
  try {
    await setDoc(userProfileRef, {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (error: any) {
     throw new Error(error.message || "Could not create user profile.");
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfileDocument | null> => {
  const userProfileRef = doc(db, "users", uid);
  try {
    const docSnap = await getDoc(userProfileRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfileDocument;
    } else {
      console.warn(`No user profile found for UID: ${uid}`);
      return null;
    }
  } catch (error: any) {
     throw new Error(error.message || "Could not retrieve user profile.");
  }
};
