
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserWithRole } from '../types';

export function useSession() {
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
          console.log("Session user metadata:", currentSession.user.user_metadata);
          
          // Extract role from user metadata
          const metadataRole = currentSession.user.user_metadata?.role;
          const fullName = currentSession.user.user_metadata?.full_name || 'User';
          
          console.log("Auth state changed - User metadata role:", metadataRole);
          
          // Create user object with metadata
          const userWithRole: UserWithRole = {
            ...currentSession.user,
            role: metadataRole || 'member',
            fullName: fullName
          };
          
          console.log("Setting user with role:", userWithRole.role);
          
          if (userWithRole.email === "wasperstore@gmail.com" && 
             (userWithRole.role !== 'super_admin' || event === 'SIGNED_IN')) {
            console.log("Super admin email detected, enforcing role");
            const updated = await enforceSuperAdminRole(userWithRole);
            if (!updated) {
              setUser(userWithRole);
            }
          } else {
            setUser(userWithRole);
          }
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
          
          console.log("Initial session check - User metadata role:", metadataRole);
          
          const userWithRole: UserWithRole = {
            ...initialSession.user,
            role: metadataRole || 'member',
            fullName: fullName
          };
          
          console.log("Initial user with role:", userWithRole.role);
          
          // Force super_admin role for wasperstore@gmail.com
          if (userWithRole.email === "wasperstore@gmail.com" && userWithRole.role !== 'super_admin') {
            console.log("Super admin email detected at initialization, enforcing role");
            const updated = await enforceSuperAdminRole(userWithRole);
            if (!updated) {
              setUser(userWithRole);
            }
          } else {
            setUser(userWithRole);
          }
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

  return {
    user,
    session,
    isLoading,
    setUser,
    setSession
  };
}

// Force update super admin role
async function enforceSuperAdminRole(currentUser: UserWithRole) {
  if (currentUser.email === "wasperstore@gmail.com") {
    console.log("ENFORCING super_admin role for:", currentUser.email);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          role: 'super_admin',
          full_name: 'Azeez Wosilat'
        }
      });
      
      if (error) {
        console.error("Super admin role enforcement error:", error);
        return false;
      }
      
      console.log("Super admin role enforced successfully");
      
      // Immediately refresh session to get updated metadata
      const { data: refreshData } = await supabase.auth.refreshSession();
      
      if (refreshData.session) {
        console.log("Session refreshed with updated role metadata:", refreshData.user?.user_metadata);
        
        // Create updated user object with enforced role
        const updatedUser: UserWithRole = {
          ...refreshData.user!,
          role: 'super_admin',
          fullName: 'Azeez Wosilat'
        };
        
        console.log("Setting user with enforced super_admin role");
        return true;
      }
    } catch (err) {
      console.error("Super admin enforcement error:", err);
    }
  }
  return false;
}
