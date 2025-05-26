
import { doc, setDoc, getDoc, serverTimestamp, type Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import type { UserRole } from "@/lib/constants";

export interface UserProfileData {
  email: string;
  role: UserRole;
  displayName?: string;
  // Add other profile fields as needed
}

export interface UserProfileDocument extends UserProfileData {
  uid: string;
  createdAt: Timestamp;
}

export const createUserProfile = async (uid: string, data: UserProfileData): Promise<void> => {
  const userProfileRef = doc(db, "users", uid);
  return setDoc(userProfileRef, {
    uid,
    ...data,
    createdAt: serverTimestamp(),
  }, { merge: true }); // Use merge to avoid overwriting if doc somehow exists
};

export const getUserProfile = async (uid: string): Promise<UserProfileData | null> => {
  const userProfileRef = doc(db, "users", uid);
  const docSnap = await getDoc(userProfileRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    // We only need to return UserProfileData, not the full document structure for context
    return {
      email: data.email,
      role: data.role,
      displayName: data.displayName,
    };
  } else {
    console.log("No such user profile!");
    return null;
  }
};
