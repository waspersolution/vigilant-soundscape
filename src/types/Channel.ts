
// Channel type for communication channels
export interface Channel {
  id: string;
  communityId: string;
  name: string;
  type: 'security_patrol' | 'general_chat' | 'alerts_only';
  createdAt?: string;
}
