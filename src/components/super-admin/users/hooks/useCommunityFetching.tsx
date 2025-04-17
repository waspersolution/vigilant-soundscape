
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useCommunityFetching() {
  const [communities, setCommunities] = useState<{id: string, name: string}[]>([]);

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('id, name');

      if (error) {
        console.error('Error fetching communities:', error);
        throw error;
      }

      setCommunities(data || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast.error('Failed to load communities');
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return {
    communities,
    fetchCommunities
  };
}
