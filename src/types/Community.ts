
// Community type for managing community-related data
export interface Community {
  id: string;
  name: string;
  leaderId: string | null;
  subscriptionPlan?: 'basic' | 'premium';
  subscriptionStatus?: 'active' | 'inactive' | 'trial';
  maxMembers?: number;
  emergencyContacts?: any;
  geoBoundaries?: any;
}
