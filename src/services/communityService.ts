
import { supabase } from "@/integrations/supabase/client";
import { Community, User } from "@/types";
import { toast } from "sonner";

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
    
    const communities: Community[] = leaderCommunities || [];
    
    // If the user is a member of a community, fetch that community
    if (profile?.community_id) {
      const { data: memberCommunity, error: memberError } = await supabase
        .from("communities")
        .select("*")
        .eq("id", profile.community_id)
        .single();
      
      if (memberError && memberError.code !== 'PGRST116') throw memberError;
      
      if (memberCommunity && !communities.some(c => c.id === memberCommunity.id)) {
        communities.push(memberCommunity);
      }
    }
    
    return communities;
  } catch (error) {
    console.error("Error fetching communities:", error);
    toast.error("Failed to fetch communities");
    return [];
  }
}

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
    return data;
  } catch (error) {
    console.error("Error creating community:", error);
    toast.error("Failed to create community");
    return null;
  }
}

export async function fetchCommunityMembers(communityId: string): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("community_id", communityId);
    
    if (error) throw error;
    
    // Transform to match User type
    return data.map(profile => ({
      id: profile.id,
      fullName: profile.full_name,
      email: profile.email,
      role: profile.role,
      communityId: profile.community_id,
      onlineStatus: profile.online_status || false,
      lastLocation: profile.last_location
    }));
  } catch (error) {
    console.error("Error fetching community members:", error);
    toast.error("Failed to fetch community members");
    return [];
  }
}

export async function inviteMember(email: string, communityId: string): Promise<boolean> {
  try {
    // In a real implementation, this would send an email invitation
    // For now, we'll just create the user record or update existing user
    
    // First check if user with this email exists
    const { data: existingUser, error: checkError } = await supabase
      .from("profiles")
      .select("id, community_id")
      .eq("email", email)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') throw checkError;
    
    if (existingUser) {
      // User exists, update their community if they don't have one
      if (!existingUser.community_id) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ community_id: communityId })
          .eq("id", existingUser.id);
        
        if (updateError) throw updateError;
        toast.success(`User ${email} has been invited to join the community`);
        return true;
      } else {
        toast.error(`User ${email} is already part of a community`);
        return false;
      }
    } else {
      // In a real app, we would send an invitation email
      toast.success(`Invitation sent to ${email}`);
      return true;
    }
  } catch (error) {
    console.error("Error inviting member:", error);
    toast.error("Failed to invite member");
    return false;
  }
}

export async function updateMemberRole(userId: string, newRole: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);
    
    if (error) throw error;
    
    toast.success("Member role updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating member role:", error);
    toast.error("Failed to update member role");
    return false;
  }
}

export async function removeMember(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ community_id: null })
      .eq("id", userId);
    
    if (error) throw error;
    
    toast.success("Member removed from community");
    return true;
  } catch (error) {
    console.error("Error removing member:", error);
    toast.error("Failed to remove member");
    return false;
  }
}
