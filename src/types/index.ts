
import { Database } from "@/integrations/supabase/types";

// User type for profiles and community management
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Database["public"]["Enums"]["user_role"];
  communityId?: string;
  onlineStatus?: boolean;
  lastLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}

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

// Alert type for alerts system
export interface Alert {
  id: string;
  type: string;
  message?: string | null;
  location: any;
  senderId: string;
  communityId: string;
  priority: number;
  createdAt: string;
  resolved?: boolean;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
  audioUrl?: string | null;
}

// PatrolSession type for patrol management
export interface PatrolSession {
  id: string;
  guardId: string;
  communityId: string;
  startTime: string;
  endTime?: string | null;
  status?: string;
  totalDistance?: number;
  routeData?: any;
  missedAwakeChecks?: number;
  createdAt: string;
  updatedAt: string;
}

// Message type for voice and text messaging
export interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  channelId: string;
  type: 'audio' | 'text';
  content?: string;
  audioUrl?: string;
  createdAt: string;
}

// Export the Channel type (already defined in the previous code)
export interface Channel {
  id: string;
  communityId: string;
  name: string;
  type: 'security_patrol' | 'general_chat' | 'alerts_only';
  createdAt?: string;
}
