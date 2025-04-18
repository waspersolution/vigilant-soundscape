
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

      console.log("Fetching communities");
      console.log("Current user ID:", sessionData.session.user.id);
      
      const { data, error } = await supabase
        .from('communities')
        .select('id, name');

      if (error) {
        console.error('Error fetching communities:', error);
        if (error.message.includes("policy")) {
          toast.error('Permission denied: You do not have access to view communities');
          setCommunities([]);
          return;
        }
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
