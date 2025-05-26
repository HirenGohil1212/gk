
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  type User
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { createUserProfile, getUserProfile, type UserProfileData } from "./firestoreService";
import type { UserRole } from "@/lib/constants";

export interface SignUpData {
  email: string;
  passwordOne: string;
  role: UserRole;
  displayName?: string;
}

export const signUp = async ({ email, passwordOne, role, displayName }: SignUpData): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, passwordOne);
  const firebaseUser = userCredential.user;
  
  const userProfileData: UserProfileData = {
    email: firebaseUser.email!,
    role: role,
    displayName: displayName || firebaseUser.email?.split('@')[0] || "User",
  };
  await createUserProfile(firebaseUser.uid, userProfileData);
  
  return firebaseUser;
};

export interface SignInDate {
  email: string;
  passwordOne: string;
}

export const signIn = async ({ email, passwordOne }: SignInDate): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, passwordOne);
  return userCredential.user;
};

export const signOut = async (): Promise<void> => {
  return firebaseSignOut(auth);
};

export const observeAuthState = (callback: (user: User | null, userProfile?: UserProfileData | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userProfile = await getUserProfile(user.uid);
      callback(user, userProfile);
    } else {
      callback(null, null);
    }
  });
};
