
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

export async function fetchCommunityMembers(communityId: string): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("community_id", communityId);
    
    if (error) throw error;
    
    // Transform to match User type
    return data.map(profile => {
      // Type assertion for the last_location object
      type LocationData = {
        latitude: number;
        longitude: number;
        timestamp: string;
      };
      
      // Safely extract location data with type checking
      let lastLocation: User['lastLocation'] = undefined;
      
      if (profile.last_location && typeof profile.last_location === 'object') {
        const location = profile.last_location as LocationData;
        if (
          'latitude' in location && 
          'longitude' in location && 
          'timestamp' in location
        ) {
          lastLocation = {
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: location.timestamp
          };
        }
      }
      
      return {
        id: profile.id,
        fullName: profile.full_name,
        email: profile.email,
        role: profile.role,
        communityId: profile.community_id,
        onlineStatus: profile.online_status || false,
        lastLocation
      };
    });
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

export async function updateMemberRole(userId: string, newRole: UserRole): Promise<boolean> {
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
