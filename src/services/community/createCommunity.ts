
import { supabase } from "@/integrations/supabase/client";
import { Community } from "@/types";
import { toast } from "sonner";
import { transformCommunity } from "./communityTransformer";

export async function createCommunity(name: string, userId: string): Promise<Community | null> {
  try {
    // Create the community
    const { data, error } = await supabase
      .from("communities")
      .insert({
        name,
        leader_id: userId,
        subscription_plan: 'basic',
        subscription_status: 'trial',
        max_members: 50
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update the user's profile to be part of this community
    await supabase
      .from("profiles")
      .update({ community_id: data.id })
      .eq("id", userId);
    
    toast.success("Community created successfully");
    return transformCommunity(data);
  } catch (error) {
    console.error("Error creating community:", error);
    toast.error("Failed to create community");
    return null;
  }
}
