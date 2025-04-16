
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];
type UserRole = Database["public"]["Enums"]["user_role"];

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider initializing");
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, !!session);
        
        if (session) {
          // Use setTimeout to prevent recursive RLS policy issues
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setIsLoading(false);
          return;
        }
        
        if (session) {
          console.log("Found existing session, fetching profile");
          // User is logged in, get their profile
          fetchUserProfile(session.user.id);
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

    // Function to fetch user profile data
    const fetchUserProfile = async (userId: string) => {
      try {
        console.log("Fetching user profile for ID:", userId);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error("Profile fetch error:", error);
          setIsLoading(false);
          return;
        }

        if (profile) {
          console.log("Profile fetched successfully:", profile);
          setUser({
            id: userId,
            email: profile.email,
            fullName: profile.full_name,
            role: profile.role,
            communityId: profile.community_id,
            onlineStatus: profile.online_status || false,
            lastLocation: profile.last_location && typeof profile.last_location === 'object' ? {
              latitude: Number((profile.last_location as any).latitude),
              longitude: Number((profile.last_location as any).longitude),
              timestamp: String((profile.last_location as any).timestamp)
            } : undefined
          });
        } else {
          console.log("No profile found for user:", userId);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Profile fetch exception:", err);
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
      const { error } = await supabase.auth.signInWithPassword({
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
            full_name: fullName
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
