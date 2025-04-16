import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Alert } from "@/types";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "./LocationContext";
import { supabase } from "@/integrations/supabase/client";

interface AlertContextType {
  alerts: Alert[];
  activeAlerts: Alert[];
  isLoading: boolean;
  createAlert: (type: Alert['type'], message?: string, priority?: Alert['priority']) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
  playAlertSound: (type: Alert['type']) => void;
  stopAlertSound: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertSound, setAlertSound] = useState<HTMLAudioElement | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { currentLocation } = useLocation();

  useEffect(() => {
    if (!user?.communityId) {
      setAlerts([]);
      setIsLoading(false);
      return;
    }

    // Fetch existing alerts
    const fetchAlerts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('alerts')
          .select(`
            *,
            sender:profiles!alerts_sender_id_fkey(full_name)
          `)
          .eq('community_id', user.communityId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedAlerts: Alert[] = data.map(alert => {
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

    fetchAlerts();

    // Subscribe to real-time alerts
    const alertsChannel = supabase
      .channel('public:alerts')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'alerts',
        filter: `community_id=eq.${user.communityId}`
      }, async (payload) => {
        console.log('New alert received:', payload);
        
        // Fetch the sender name
        const { data: senderData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', payload.new.sender_id)
          .single();
        
        // Parse location if it's a string
        const location = typeof payload.new.location === 'string'
          ? JSON.parse(payload.new.location)
          : payload.new.location;
        
        const newAlert: Alert = {
          id: payload.new.id,
          senderId: payload.new.sender_id,
          senderName: senderData?.full_name,
          communityId: payload.new.community_id,
          type: payload.new.type as Alert['type'],
          location: location as Alert['location'],
          message: payload.new.message || undefined,
          priority: payload.new.priority as Alert['priority'],
          resolved: !!payload.new.resolved,
          resolvedBy: payload.new.resolved_by || undefined,
          resolvedAt: payload.new.resolved_at || undefined,
          createdAt: payload.new.created_at
        };
        
        setAlerts(prev => [newAlert, ...prev]);
        
        // Play alert sound for new alerts
        if (newAlert.priority <= 2) {
          playAlertSound(newAlert.type);
          
          // Show toast notification
          toast({
            title: newAlert.type === 'panic' ? "PANIC ALERT" : 
                  newAlert.type === 'emergency' ? "Emergency Alert" : 
                  "New Alert",
            description: newAlert.message || `New ${newAlert.type} alert received`,
            variant: newAlert.priority === 1 ? "destructive" : "default",
          });
        }
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'alerts',
        filter: `community_id=eq.${user.communityId}`
      }, (payload) => {
        console.log('Alert updated:', payload);
        setAlerts(prev => 
          prev.map(alert => 
            alert.id === payload.new.id 
              ? {
                  ...alert,
                  resolved: !!payload.new.resolved,
                  resolvedBy: payload.new.resolved_by || undefined,
                  resolvedAt: payload.new.resolved_at || undefined
                } 
              : alert
          )
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(alertsChannel);
      if (alertSound) {
        alertSound.pause();
        alertSound.currentTime = 0;
      }
    };
  }, [user?.communityId]);

  const activeAlerts = alerts.filter(alert => !alert.resolved);

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
    
    if (!currentLocation) {
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
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
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
      playAlertSound(type);
      
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
      stopAlertSound();
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

  const playAlertSound = (type: Alert['type']) => {
    stopAlertSound();
    
    // Select sound URL based on alert type
    let soundUrl = "";
    
    switch (type) {
      case "panic":
        soundUrl = "/sounds/panic-alarm.mp3";
        break;
      case "emergency":
        soundUrl = "/sounds/emergency-alarm.mp3";
        break;
      case "patrol_stop":
        soundUrl = "/sounds/notification.mp3";
        break;
      case "system":
        soundUrl = "/sounds/system-alert.mp3";
        break;
      default:
        soundUrl = "/sounds/notification.mp3";
    }
    
    // In real app, these sound files would be created and added
    // For now we'll just log it
    console.log(`Playing alarm sound for ${type} alert (${soundUrl})`);
    
    // Create and play sound - would work if sound files were available
    const sound = new Audio(soundUrl);
    sound.loop = type === "panic" || type === "emergency";
    sound.play().catch(e => console.log("Sound not available:", e));
    
    setAlertSound(sound);
  };

  const stopAlertSound = () => {
    if (alertSound) {
      alertSound.pause();
      alertSound.currentTime = 0;
      setAlertSound(null);
    }
  };

  return (
    <AlertContext.Provider value={{ 
      alerts, 
      activeAlerts,
      isLoading, 
      createAlert, 
      resolveAlert,
      playAlertSound,
      stopAlertSound
    }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
