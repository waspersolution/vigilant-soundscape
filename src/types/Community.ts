
// Community type for managing community-related data
export interface Community {
  id: string;
  name: string;
  leaderId: string | null;
  subscriptionPlan?: 'basic' | 'premium';
  subscriptionStatus?: 'active' | 'inactive' | 'trial';
  maxMembers?: number;
  emergencyContacts?: EmergencyContact[];
  geoBoundaries?: any;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  role: string;
  priority: number;
}
