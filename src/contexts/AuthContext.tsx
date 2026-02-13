"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { createUserProfile, getUserProfile } from "@/lib/firebase/firestoreService";
import { signUp as signUpService, signIn as signInService, signOut as signOutService } from "@/lib/firebase/authService";
import type { UserProfile, LandArea } from "@/lib/constants";

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
  village: string;
  landArea: LandArea;
}

export interface SignInCredentials {
    email: string;
    password: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  register: (credentials: SignUpCredentials) => Promise<void>;
  login: (credentials: SignInCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (credentials: SignUpCredentials) => {
    const { user: firebaseUser } = await signUpService(credentials);
    const profileData = {
      uid: firebaseUser.uid,
      email: credentials.email,
      name: credentials.name,
      village: credentials.village,
      landArea: credentials.landArea,
    };
    await createUserProfile(firebaseUser.uid, profileData);
    // Auth state listener will handle setting user and userProfile
  };

  const login = async (credentials: SignInCredentials) => {
    await signInService(credentials);
    // Auth state listener will handle setting user and userProfile
  };

  const logout = async () => {
    await signOutService();
    // Auth state listener will handle clearing user and userProfile
  };

  const value = {
    user,
    userProfile,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
