import { supabase } from "@/integrations/supabase/client";
import { Channel, Message, User, Community, EmergencyContact } from "@/types";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

// Helper function to transform database message to application Message type
function transformMessage(dbMessage: any, senderName?: string): Message {
  return {
    id: dbMessage.id,
    senderId: dbMessage.sender_id,
    senderName: senderName,
    channelId: dbMessage.channel_id,
    recipientId: dbMessage.recipient_id,
    type: dbMessage.type,
    content: dbMessage.content,
    audioUrl: dbMessage.audio_url,
    createdAt: dbMessage.created_at,
    isAnnouncement: dbMessage.is_announcement,
    readBy: dbMessage.read_by,
  };
}

// Helper function to transform database channel to application Channel type
function transformChannel(dbChannel: any): Channel {
  return {
    id: dbChannel.id,
    communityId: dbChannel.community_id,
    name: dbChannel.name,
    type: dbChannel.type,
    participants: dbChannel.participants,
    createdAt: dbChannel.created_at,
    description: dbChannel.description,
  };
}

export async function fetchChannels(communityId: string): Promise<Channel[]> {
  try {
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .eq("community_id", communityId);

    if (error) throw error;

    return data.map(transformChannel);
  } catch (error) {
    console.error("Error fetching channels:", error);
    toast.error("Failed to fetch channels");
    return [];
  }
}

export async function fetchDirectMessages(userId: string): Promise<Channel[]> {
  try {
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .eq("type", "direct")
      .contains("participants", [userId]);

    if (error) throw error;

    return data.map(transformChannel);
  } catch (error) {
    console.error("Error fetching direct messages:", error);
    toast.error("Failed to fetch direct messages");
    return [];
  }
}

export async function fetchMessages(channelId: string): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*, profiles:sender_id(full_name)")
      .eq("channel_id", channelId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return data.map(item => transformMessage(item, item.profiles?.full_name));
  } catch (error) {
    console.error("Error fetching messages:", error);
    toast.error("Failed to fetch messages");
    return [];
  }
}

export async function sendMessage(message: Omit<Message, 'id' | 'createdAt'>): Promise<Message | null> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: message.senderId,
        channel_id: message.channelId,
        recipient_id: message.recipientId,
        content: message.content,
        audio_url: message.audioUrl,
        type: message.type,
        is_announcement: message.isAnnouncement,
      })
      .select()
      .single();

    if (error) throw error;

    toast.success("Message sent successfully");
    return transformMessage(data);
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send message");
    return null;
  }
}

export async function createChannel(channel: Omit<Channel, 'id' | 'createdAt'>): Promise<Channel | null> {
  try {
    const { data, error } = await supabase
      .from("channels")
      .insert({
        community_id: channel.communityId,
        name: channel.name,
        type: channel.type,
        participants: channel.participants,
        description: channel.description,
      })
      .select()
      .single();

    if (error) throw error;

    toast.success("Channel created successfully");
    return transformChannel(data);
  } catch (error) {
    console.error("Error creating channel:", error);
    toast.error("Failed to create channel");
    return null;
  }
}

export async function broadcastAnnouncement(
  communityId: string, 
  senderId: string, 
  content: string
): Promise<boolean> {
  try {
    // First get the announcements channel or create it if it doesn't exist
    let announcementChannel: Channel | null = null;
    
    const { data: existingChannels, error: channelError } = await supabase
      .from("channels")
      .select("*")
      .eq("community_id", communityId)
      .eq("type", "announcements")
      .limit(1);
    
    if (channelError) throw channelError;
    
    if (existingChannels.length === 0) {
      // Create an announcements channel
      const { data: newChannel, error: createError } = await supabase
        .from("channels")
        .insert({
          community_id: communityId,
          name: "Announcements",
          type: "announcements",
          description: "Community-wide announcements",
        })
        .select()
        .single();
      
      if (createError) throw createError;
      announcementChannel = transformChannel(newChannel);
    } else {
      announcementChannel = transformChannel(existingChannels[0]);
    }
    
    // Send announcement message
    const { error: messageError } = await supabase
      .from("messages")
      .insert({
        sender_id: senderId,
        channel_id: announcementChannel.id,
        content,
        type: "text",
        is_announcement: true,
      });
    
    if (messageError) throw messageError;
    
    toast.success("Announcement broadcast successfully");
    return true;
  } catch (error) {
    console.error("Error broadcasting announcement:", error);
    toast.error("Failed to broadcast announcement");
    return false;
  }
}

export async function updateEmergencyContacts(
  communityId: string,
  contacts: EmergencyContact[]
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("communities")
      .update({ emergency_contacts: contacts })
      .eq("id", communityId);
    
    if (error) throw error;
    
    toast.success("Emergency contacts updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating emergency contacts:", error);
    toast.error("Failed to update emergency contacts");
    return false;
  }
}

export async function fetchEmergencyContacts(communityId: string): Promise<EmergencyContact[]> {
  try {
    const { data, error } = await supabase
      .from("communities")
      .select("emergency_contacts")
      .eq("id", communityId)
      .single();
    
    if (error) throw error;
    
    return data.emergency_contacts as EmergencyContact[] || [];
  } catch (error) {
    console.error("Error fetching emergency contacts:", error);
    toast.error("Failed to fetch emergency contacts");
    return [];
  }
}
