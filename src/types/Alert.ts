
// Alert type for managing alert-related data
export interface Alert {
  id: string;
  senderId: string;
  senderName: string;
  communityId: string;
  type: "panic" | "emergency" | "patrol_stop" | "system";
  location?: {
    latitude: number;
    longitude: number;
  };
  message?: string;
  audioUrl?: string;
  priority: 1 | 2 | 3 | 4 | 5; // 1 is highest priority, 5 is lowest
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  notifiedContacts?: EmergencyContactNotification[];
}

export interface EmergencyContactNotification {
  contactId: string;
  contactName: string;
  notifiedAt: string;
  method: "sms" | "call" | "email";
  status: "sent" | "delivered" | "failed";
}

export interface AlertUsageLimit {
  userId: string;
  dailyCount: number;
  monthlyCount: number;
  lastAlertTime?: string;
  cooldownUntil?: string;
}
