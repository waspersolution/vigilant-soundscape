
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];
type UserRole = Database["public"]["Enums"]["user_role"];

interface UserWithRole extends User {
  role?: UserRole;
  fullName?: string;
  communityId?: string | null;
  onlineStatus?: boolean;
  lastLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}

interface AuthContextType {
  user: UserWithRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider initializing");
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, !!currentSession);
        
        setSession(currentSession);
        
        if (currentSession) {
          // Extract role from user metadata if available to avoid profiles table
          const userWithRole: UserWithRole = {
            ...currentSession.user,
            role: (currentSession.user.user_metadata?.role as UserRole) || 'member',
            fullName: currentSession.user.user_metadata?.full_name || 'User'
          };
          
          setUser(userWithRole);
          setIsLoading(false);
        } else {
          setUser(null);
          setIsLoading(false);
          console.log("No session in auth change, setting user to null");
        }
      }
    );

    // Initial session check
    const checkSession = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setIsLoading(false);
          return;
        }
        
        if (initialSession) {
          console.log("Found existing session:", initialSession.user.id);
          setSession(initialSession);
          
          // Extract role from user metadata to avoid profiles table query
          const userWithRole: UserWithRole = {
            ...initialSession.user,
            role: (initialSession.user.user_metadata?.role as UserRole) || 'member',
            fullName: initialSession.user.user_metadata?.full_name || 'User'
          };
          
          setUser(userWithRole);
          setIsLoading(false);
        } else {
          // No active session
          console.log("No active session found");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Auth state initialization error:", err);
        setIsLoading(false);
      }
    };

    // Initial session check
    checkSession();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      console.log("Login successful");
      toast.success("Login successful");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting registration for:", email);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'member'
          }
        }
      });

      if (error) {
        throw error;
      }

      console.log("Registration successful");
      toast.success("Registration successful. Please check your email for confirmation.");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Attempting logout");
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      setSession(null);
      console.log("Logout successful");
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Failed to logout");
    }
  };

  const authValue = {
    user, 
    isLoading, 
    isAuthenticated: !!user, 
    login, 
    register, 
    logout
  };
  
  console.log("Auth context value:", { 
    user: !!user, 
    isLoading, 
    isAuthenticated: !!user 
  });

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
