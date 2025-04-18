
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useCommunityFetching() {
  const [communities, setCommunities] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCommunities = async () => {
    setIsLoading(true);
    try {
      // Check if user is logged in
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }
      
      if (!sessionData.session) {
        console.warn("User is not logged in, cannot fetch communities");
        setCommunities([]);
        setIsLoading(false);
        return;
      }

      // Verify current user's role is super_admin
      const { data: currentUserData, error: currentUserError } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('id', sessionData.session.user.id)
        .single();
      
      if (currentUserError) {
        console.error("Error fetching current user role:", currentUserError);
        if (currentUserError.message.includes("no rows found")) {
          // User profile doesn't exist - rare case
          console.warn("User profile not found");
          setCommunities([]);
          setIsLoading(false);
          return;
        }
        throw new Error("Failed to verify your permissions");
      }
      
      const isCurrentUserSuperAdmin = 
        currentUserData.role === 'super_admin' || 
        currentUserData.email === 'wasperstore@gmail.com';
      
      if (!isCurrentUserSuperAdmin) {
        console.warn("User does not have super_admin role");
        setCommunities([]);
        setIsLoading(false);
        return;
      }

      console.log("Fetching communities");
      console.log("Current user ID:", sessionData.session.user.id);
      console.log("Current user role:", currentUserData.role);
      
      const { data, error } = await supabase
        .from('communities')
        .select('id, name');

      if (error) {
        console.error('Error fetching communities:', error);
        throw error;
      }

      console.log("Fetched communities:", data?.length || 0);
      setCommunities(data || []);
    } catch (error: any) {
      console.error('Error fetching communities:', error);
      toast.error('Failed to load communities: ' + (error.message || 'Unknown error'));
      setCommunities([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return {
    communities,
    isLoading,
    fetchCommunities
  };
}
