
import { useEffect } from "react";
import { Alert, User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAlertSubscription(
  user: User | null,
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>,
  playSound: (type: Alert['type']) => void
) {
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.communityId) return;

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
        
        // Fetch the sender name with proper column aliasing
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
          senderName: senderData?.full_name || undefined,
          communityId: payload.new.community_id,
          type: payload.new.type as Alert['type'],
          location: {
            latitude: location?.latitude || 0,
            longitude: location?.longitude || 0
          },
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
          playSound(newAlert.type);
          
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
    };
  }, [user?.communityId, setAlerts, playSound, toast]);
}
