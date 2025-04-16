
import { supabase } from "@/integrations/supabase/client";
import { Alert } from "@/types";

// Enable realtime for the alerts table
export const enableRealtimeForAlerts = async () => {
  try {
    // Fix the parameter typing issue
    const { error } = await supabase.rpc('enable_realtime_for_table', {
      table_name: 'alerts' as any
    });
    
    if (error) {
      console.error("Error enabling realtime for alerts:", error);
    } else {
      console.log("Successfully enabled realtime for alerts table");
    }
  } catch (error) {
    console.error("Failed to enable realtime:", error);
  }
};

// Fetch alerts for a community
export const fetchAlertsForCommunity = async (communityId: string): Promise<Alert[]> => {
  try {
    // Fix join query to avoid ambiguity
    const { data, error } = await supabase
      .from('alerts')
      .select(`
        *,
        sender:profiles!alerts_sender_id_fkey(full_name)
      `)
      .eq('community_id', communityId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    if (!data) return [];
    
    return data.map(alert => {
      // Parse location if it's a string
      const location = typeof alert.location === 'string'
        ? JSON.parse(alert.location)
        : alert.location;
        
      return {
        id: alert.id,
        senderId: alert.sender_id,
        senderName: alert.sender?.full_name,
        communityId: alert.community_id,
        type: alert.type as Alert['type'],
        location: {
          latitude: location?.latitude || 0,
          longitude: location?.longitude || 0
        },
        message: alert.message || undefined,
        priority: alert.priority as Alert['priority'],
        resolved: !!alert.resolved,
        resolvedBy: alert.resolved_by || undefined,
        resolvedAt: alert.resolved_at || undefined,
        createdAt: alert.created_at
      };
    });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }
};

// Create a new alert
export const createAlert = async (
  senderId: string,
  communityId: string,
  type: Alert['type'],
  location: { latitude: number; longitude: number },
  message: string | null,
  priority: Alert['priority']
): Promise<Alert | null> => {
  try {
    // Fix join query to avoid ambiguity
    const { data, error } = await supabase
      .from('alerts')
      .insert({
        sender_id: senderId,
        community_id: communityId,
        type,
        location,
        message,
        priority,
        resolved: false
      })
      .select(`
        *,
        sender:profiles!alerts_sender_id_fkey(full_name)
      `)
      .single();
      
    if (error) throw error;
    
    if (!data) return null;
    
    // Parse location if it's a string
    const locationData = typeof data.location === 'string'
      ? JSON.parse(data.location)
      : data.location;
    
    return {
      id: data.id,
      senderId: data.sender_id,
      senderName: data.sender?.full_name,
      communityId: data.community_id,
      type: data.type as Alert['type'],
      location: {
        latitude: locationData?.latitude || 0,
        longitude: locationData?.longitude || 0
      },
      message: data.message || undefined,
      priority: data.priority as Alert['priority'],
      resolved: !!data.resolved,
      resolvedBy: data.resolved_by || undefined,
      resolvedAt: data.resolved_at || undefined,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error("Error creating alert:", error);
    throw error;
  }
};

// Resolve an alert
export const resolveAlert = async (alertId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({
        resolved: true,
        resolved_by: userId,
        resolved_at: new Date().toISOString()
      })
      .eq('id', alertId);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error resolving alert:", error);
    throw error;
  }
};
