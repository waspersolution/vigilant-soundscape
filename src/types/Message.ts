
// Message type for voice and text messaging
export interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  channelId?: string;
  recipientId?: string; // For direct messages
  type: 'audio' | 'text';
  content?: string;
  audioUrl?: string;
  createdAt: string;
  isAnnouncement?: boolean; // For community-wide announcements
  readBy?: string[]; // Array of user IDs who have read this message
}
