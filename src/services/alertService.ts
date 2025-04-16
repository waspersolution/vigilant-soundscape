
import { supabase } from "@/integrations/supabase/client";
import { Alert } from "@/types";

// Enable realtime for the alerts table
export const enableRealtimeForAlerts = async () => {
  try {
    const { error } = await supabase.rpc('enable_realtime_for_table', {
      table_name: 'alerts'
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
    const { data, error } = await supabase
      .from('alerts')
      .select('*, profiles:sender_id(full_name)')
      .eq('community_id', communityId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    if (!data) return [];
    
    return data.map(alert => ({
      id: alert.id,
      senderId: alert.sender_id,
      senderName: alert.profiles?.full_name,
      communityId: alert.community_id,
      type: alert.type as Alert['type'],
      location: alert.location,
      message: alert.message || undefined,
      priority: alert.priority as Alert['priority'],
      resolved: !!alert.resolved,
      resolvedBy: alert.resolved_by || undefined,
      resolvedAt: alert.resolved_at || undefined,
      createdAt: alert.created_at
    }));
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
      .select('*, profiles:sender_id(full_name)')
      .single();
      
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      senderId: data.sender_id,
      senderName: data.profiles?.full_name,
      communityId: data.community_id,
      type: data.type as Alert['type'],
      location: data.location,
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
