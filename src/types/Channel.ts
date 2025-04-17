
// Channel type for communication channels
export interface Channel {
  id: string;
  communityId: string;
  name: string;
  type: 'security_patrol' | 'general_chat' | 'alerts_only' | 'announcements' | 'direct';
  participants?: string[]; // For direct messages or group chats
  createdAt?: string;
  description?: string;
}
