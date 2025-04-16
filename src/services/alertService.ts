
import { supabase } from "@/integrations/supabase/client";
import { Alert } from "@/types";

// Fetch alerts with pagination
export const fetchAlerts = async (communityId: string, limit = 20, offset = 0) => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*, sender:profiles!alerts_sender_id_fkey(*)')
      .eq('community_id', communityId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Map database response to our Alert type
    return data.map(alert => ({
      id: alert.id,
      senderId: alert.sender_id,
      senderName: alert.sender?.full_name || 'Unknown User',
      communityId: alert.community_id,
      type: alert.type,
      location: {
        latitude: alert.location?.latitude || 0,
        longitude: alert.location?.longitude || 0
      },
      message: alert.message || '',
      priority: alert.priority,
      resolved: alert.resolved,
      resolvedBy: alert.resolved_by || undefined,
      resolvedAt: alert.resolved_at || undefined,
      createdAt: alert.created_at
    })) as Alert[];
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

// Create a new alert
export const createAlert = async (alert: {
  senderId: string;
  senderName: string;
  communityId: string;
  type: Alert['type'];
  location: { latitude: number; longitude: number };
  message?: string;
  priority: Alert['priority'];
}) => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .insert({
        sender_id: alert.senderId,
        community_id: alert.communityId,
        type: alert.type,
        location: alert.location,
        message: alert.message,
        priority: alert.priority,
        resolved: false,
        created_at: new Date().toISOString()
      })
      .select('*, sender:profiles!alerts_sender_id_fkey(*)')
      .single();

    if (error) throw error;

    return {
      id: data.id,
      senderId: data.sender_id,
      senderName: data.sender?.full_name || alert.senderName || 'Unknown User',
      communityId: data.community_id,
      type: data.type,
      location: data.location,
      message: data.message || '',
      priority: data.priority,
      resolved: data.resolved,
      createdAt: data.created_at
    } as Alert;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};

// Resolve an alert
export const resolveAlert = async (alertId: string, userId: string) => {
  try {
    const resolvedAt = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('alerts')
      .update({
        resolved: true,
        resolved_by: userId,
        resolved_at: resolvedAt
      })
      .eq('id', alertId)
      .select('*, sender:profiles!alerts_sender_id_fkey(*)')
      .single();

    if (error) throw error;

    return {
      id: data.id,
      senderId: data.sender_id,
      senderName: data.sender?.full_name || 'Unknown User',
      communityId: data.community_id,
      type: data.type,
      location: {
        latitude: data.location?.latitude || 0,
        longitude: data.location?.longitude || 0
      },
      message: data.message || '',
      priority: data.priority,
      resolved: data.resolved,
      resolvedBy: data.resolved_by,
      resolvedAt: data.resolved_at,
      createdAt: data.created_at
    } as Alert;
  } catch (error) {
    console.error('Error resolving alert:', error);
    throw error;
  }
};
