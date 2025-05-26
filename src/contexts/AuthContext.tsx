
"use client";

// This file is temporarily stubbed out to remove authentication.
// You may want to delete this file if authentication is not needed.

import type { ReactNode } from "react";

// Minimal stub, does not provide any auth functionality.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const useAuth = () => {
  // Return a mock/empty auth state
  return {
    currentUser: null,
    userProfile: null,
    role: null,
    isLoading: false,
    isAdmin: false,
  };
};
