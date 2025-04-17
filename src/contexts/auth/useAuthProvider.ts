
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserWithRole } from './types';

export function useAuthProvider() {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Setup auth state listener and check initial session
  useEffect(() => {
    console.log("AuthProvider initializing");
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, !!currentSession);
        
        setSession(currentSession);
        
        if (currentSession) {
          console.log("Auth state changed - User metadata:", currentSession.user.user_metadata);
          
          // Extract role from user metadata first
          const metadataRole = currentSession.user.user_metadata?.role;
          const fullName = currentSession.user.user_metadata?.full_name || 'User';
          
          // Create initial user object with metadata
          const userWithRole: UserWithRole = {
            ...currentSession.user,
            role: metadataRole || 'member',
            fullName: fullName
          };
          
          console.log("Setting user with role:", userWithRole.role);
          setUser(userWithRole);
        } else {
          setUser(null);
          console.log("No session in auth change, setting user to null");
        }
        setIsLoading(false);
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
          console.log("User metadata:", initialSession.user.user_metadata);
          
          setSession(initialSession);
          
          // Extract role from user metadata
          const metadataRole = initialSession.user.user_metadata?.role;
          const fullName = initialSession.user.user_metadata?.full_name || 'User';
          
          const userWithRole: UserWithRole = {
            ...initialSession.user,
            role: metadataRole || 'member',
            fullName: fullName
          };
          
          console.log("User with role set:", userWithRole.role);
          setUser(userWithRole);
        } else {
          // No active session
          console.log("No active session found");
        }
        setIsLoading(false);
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
      
      // Force update user role from metadata
      if (data.user) {
        const metadataRole = data.user.user_metadata?.role;
        const fullName = data.user.user_metadata?.full_name || 'User';
        
        // Create user object with metadata
        const userWithRole: UserWithRole = {
          ...data.user,
          role: metadataRole || 'member',
          fullName: fullName
        };
        
        console.log("Updated user with role after login:", userWithRole.role);
        setUser(userWithRole);
        
        // Refresh the session to get updated metadata
        const { data: refreshData } = await supabase.auth.refreshSession();
        if (refreshData.session) {
          console.log("Session refreshed with updated metadata:", refreshData.user?.user_metadata);
          setSession(refreshData.session);
        }
      }
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
      throw error;
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };
}
