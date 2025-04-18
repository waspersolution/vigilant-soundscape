
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

      // Check if current user has admin permissions
      const { data: currentUserData, error: currentUserError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', sessionData.session.user.id)
        .single();
        
      if (currentUserError) {
        console.error('Permission error:', currentUserError);
        if (!currentUserError.message.includes('No rows found')) {
          throw currentUserError;
        }
      }

      console.log("Fetching communities");
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
