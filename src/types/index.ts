
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'super_admin' | 'community_leader' | 'community_manager' | 'member' | 'security_personnel';
  communityId?: string;
  onlineStatus: boolean;
  lastLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}

export interface Community {
  id: string;
  name: string;
  leaderId: string;
  subscriptionPlan: 'basic' | 'premium';
  subscriptionStatus: 'active' | 'inactive' | 'trial';
  maxMembers: number;
  emergencyContacts?: Array<{
    name: string;
    phone: string;
    type: string;
  }>;
  geoBoundaries?: {
    center: {
      latitude: number;
      longitude: number;
    };
    radius: number; // in meters
  };
}

export interface Alert {
  id: string;
  senderId: string;
  senderName?: string;
  communityId: string;
  type: 'panic' | 'emergency' | 'patrol_stop' | 'system';
  location: {
    latitude: number;
    longitude: number;
  };
  message?: string;
  audioUrl?: string;
  priority: 1 | 2 | 3 | 4 | 5; // 1 is highest
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface PatrolSession {
  id: string;
  guardId: string;
  guardName?: string;
  communityId: string;
  startTime: string;
  endTime?: string;
  routeData: Array<{
    latitude: number;
    longitude: number;
    timestamp: string;
  }>;
  missedAwakeChecks: number;
  totalDistance: number;
  status: 'active' | 'completed' | 'interrupted';
}

export interface Channel {
  id: string;
  communityId: string;
  name: string;
  type: 'security_patrol' | 'general_chat' | 'alerts_only';
}

export interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  channelId: string;
  type: 'text' | 'audio' | 'system';
  content?: string;
  audioUrl?: string;
  createdAt: string;
}
