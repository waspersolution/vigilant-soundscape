
import { Community } from "@/types";

// Helper function to transform database community to application Community type
export function transformCommunity(dbCommunity: any): Community {
  return {
    id: dbCommunity.id,
    name: dbCommunity.name,
    leaderId: dbCommunity.leader_id,
    subscriptionPlan: dbCommunity.subscription_plan as 'basic' | 'premium',
    subscriptionStatus: dbCommunity.subscription_status as 'active' | 'inactive' | 'trial',
    maxMembers: dbCommunity.max_members,
    emergencyContacts: dbCommunity.emergency_contacts,
    geoBoundaries: dbCommunity.geo_boundaries
  };
}
