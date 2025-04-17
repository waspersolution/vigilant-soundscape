
import React, { createContext } from "react";
import { useAuthProvider } from "./useAuthProvider";
import { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authValue = useAuthProvider();
  
  console.log("Auth context value:", { 
    user: authValue.user?.email,
    role: authValue.user?.role,
    isAuthenticated: authValue.isAuthenticated 
  });

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}
