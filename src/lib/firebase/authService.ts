import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type UserCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import type { SignUpCredentials, SignInCredentials } from "@/contexts/AuthContext";

export const signUp = async ({ email, password }: SignUpCredentials): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    // Provide more specific error messages
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email address is already in use by another account.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('The email address is not valid.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('The password is too weak.');
    }
    throw new Error(error.message || "An unknown error occurred during sign-up.");
  }
};

export const signIn = async ({ email, password }: SignInCredentials): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
     if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password.');
    }
    throw new Error(error.message || "An unknown error occurred during sign-in.");
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message || "An unknown error occurred during sign-out.");
  }
};
