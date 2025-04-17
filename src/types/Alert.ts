export interface Alert {
  id: string;
  senderId: string;
  senderName: string;
  communityId: string;
  type: "panic" | "emergency" | "patrol_stop" | "system";
  location: {
    latitude: number;
    longitude: number;
  };
  message?: string;
  priority: 1 | 2 | 3 | 4;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  notifiedContacts?: EmergencyContactNotification[];
}

export interface AlertUsageLimit {
  userId: string;
  dailyCount: number;
  monthlyCount: number;
  lastAlertTime: string;
  cooldownUntil?: string;
}

export interface EmergencyContactNotification {
  contactId: string;
  contactName: string;
  notifiedAt: string;
  method: "sms" | "email" | "call";
  status: "sent" | "delivered" | "failed";
}
