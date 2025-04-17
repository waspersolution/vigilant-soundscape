
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
      const currentSession = await supabase.auth.getSession();
      if (!currentSession.data.session) {
        console.warn("User is not logged in, cannot fetch communities");
        setCommunities([]);
        setIsLoading(false);
        return;
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
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast.error('Failed to load communities');
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
