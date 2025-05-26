
"use client";

import type { User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { observeAuthState, type UserProfileData } from "@/lib/firebase/authService";
import { UserRole } from "@/lib/constants"; // Changed from import type
import { Loader2 } from "lucide-react";

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfileData | null; // Includes role
  role: UserRole | null;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = observeAuthState((user, profile) => {
      setCurrentUser(user);
      setUserProfile(profile || null);
      setIsLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const role = userProfile?.role || null;
  const isAdmin = role === UserRole.Admin;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Application...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, role, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
