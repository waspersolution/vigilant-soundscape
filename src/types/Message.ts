
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
