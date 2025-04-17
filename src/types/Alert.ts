
// Alert type for alerts system
export interface Alert {
  id: string;
  type: string;
  message?: string | null;
  location: any;
  senderId: string;
  senderName?: string;
  communityId: string;
  priority: number;
  createdAt: string;
  resolved?: boolean;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
  audioUrl?: string | null;
}
