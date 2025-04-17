
import { supabase } from "@/integrations/supabase/client";
import { Community } from "@/types";
import { toast } from "sonner";
import { transformCommunity } from "./communityTransformer";

export async function fetchUserCommunities(userId: string): Promise<Community[]> {
  try {
    // First, check if the user is a community leader
    const { data: leaderCommunities, error: leaderError } = await supabase
      .from("communities")
      .select("*")
      .eq("leader_id", userId);
    
    if (leaderError) throw leaderError;

    // Then check communities where the user is a member
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("community_id")
      .eq("id", userId)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') throw profileError;
    
    const communities: Community[] = leaderCommunities ? leaderCommunities.map(transformCommunity) : [];
    
    // If the user is a member of a community, fetch that community
    if (profile?.community_id) {
      const { data: memberCommunity, error: memberError } = await supabase
        .from("communities")
        .select("*")
        .eq("id", profile.community_id)
        .single();
      
      if (memberError && memberError.code !== 'PGRST116') throw memberError;
      
      if (memberCommunity && !communities.some(c => c.id === memberCommunity.id)) {
        communities.push(transformCommunity(memberCommunity));
      }
    }
    
    return communities;
  } catch (error) {
    console.error("Error fetching communities:", error);
    toast.error("Failed to fetch communities");
    return [];
  }
}
