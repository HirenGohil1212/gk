
// This file is temporarily stubbed out to remove authentication.
// You may want to delete this file if authentication is not needed.

// Mock User type to avoid breaking imports if User is used elsewhere, though it shouldn't be
export interface User {
  uid: string;
  email: string | null;
  // Add other User fields if they were used, keep minimal for now
}

export interface SignUpData {
  email: string;
  passwordOne: string;
  // role: any; // Role removed from constants
  displayName?: string;
}

export const signUp = async (data: SignUpData): Promise<User> => {
  console.warn("AuthService: signUp called but auth is disabled.");
  // Return a mock user or throw error
  return { uid: "mock_uid", email: data.email };
};

export interface SignInDate {
  email: string;
  passwordOne: string;
}

export const signIn = async (data: SignInDate): Promise<User> => {
  console.warn("AuthService: signIn called but auth is disabled.");
  return { uid: "mock_uid", email: data.email };
};

export const signOut = async (): Promise<void> => {
  console.warn("AuthService: signOut called but auth is disabled.");
  return Promise.resolve();
};

export interface UserProfileData {
  email: string;
  // role: any; // Role removed
  displayName?: string;
}

export const observeAuthState = (callback: (user: User | null, userProfile?: UserProfileData | null) => void) => {
  console.warn("AuthService: observeAuthState called but auth is disabled.");
  // Immediately call back with no user
  callback(null, null);
  // Return a no-op unsubscribe function
  return () => {};
};
