
import { useState } from "react";
import { Alert } from "@/types";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { playAlertSound, stopAlertSound } from "./alertUtils";

export function useAlertOperations(user: User | null) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertSound, setAlertSound] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const fetchAlerts = async () => {
    if (!user?.communityId) {
      setAlerts([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('alerts')
        .select('*, sender:sender_id(full_name)')
        .eq('community_id', user.communityId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedAlerts: Alert[] = data.map(alert => {
          const location = typeof alert.location === 'string'
            ? JSON.parse(alert.location)
            : alert.location;
            
          return {
            id: alert.id,
            senderId: alert.sender_id,
            senderName: alert.sender?.full_name,
            communityId: alert.community_id,
            type: alert.type as Alert['type'],
            location: location as Alert['location'],
            message: alert.message || undefined,
            priority: alert.priority as Alert['priority'],
            resolved: !!alert.resolved,
            resolvedBy: alert.resolved_by || undefined,
            resolvedAt: alert.resolved_at || undefined,
            createdAt: alert.created_at
          };
        });
        setAlerts(formattedAlerts);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
      toast({
        title: "Error",
        description: "Failed to load alerts data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAlert = async (
    type: Alert['type'], 
    message?: string, 
    priority: Alert['priority'] = 3
  ) => {
    if (!user?.id || !user.communityId) {
      toast({
        title: "Error",
        description: "You must be logged in and part of a community to send alerts",
        variant: "destructive",
      });
      return;
    }
    
    if (!user.lastLocation) {
      toast({
        title: "Error",
        description: "Location data is required to send an alert",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const newAlertData = {
        sender_id: user.id,
        community_id: user.communityId,
        type,
        location: {
          latitude: user.lastLocation.latitude,
          longitude: user.lastLocation.longitude
        },
        message: message || null,
        priority,
        resolved: false
      };
      
      const { data, error } = await supabase
        .from('alerts')
        .insert(newAlertData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Play alert sound - the realtime subscription will handle updating UI
      playAlertSound(type, setAlertSound);
      
      toast({
        title: "Alert Sent",
        description: "Your alert has been sent to the community",
      });
    } catch (error) {
      console.error("Failed to create alert:", error);
      toast({
        title: "Error",
        description: "Failed to send alert. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to resolve alerts",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('alerts')
        .update({
          resolved: true,
          resolved_by: user.id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);
      
      if (error) throw error;
      
      // The realtime subscription will handle updating the UI
      
      toast({
        title: "Alert Resolved",
        description: "The alert has been marked as resolved",
      });
      
      // Stop any playing alert sounds
      stopAlertSound(setAlertSound);
    } catch (error) {
      console.error("Failed to resolve alert:", error);
      toast({
        title: "Error",
        description: "Failed to resolve alert. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    alerts,
    setAlerts,
    isLoading,
    setIsLoading,
    alertSound,
    fetchAlerts,
    createAlert,
    resolveAlert,
    playSound: (type: Alert['type']) => playAlertSound(type, setAlertSound),
    stopSound: () => stopAlertSound(setAlertSound)
  };
}
