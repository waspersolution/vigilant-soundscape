
import { useEffect } from "react";
import { useAlert } from "@/contexts/AlertContext";
import { useToast } from "@/hooks/use-toast";
import { Alert, Bell, BellRing } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Alert as AlertType } from "@/types";

export function AlertNotification() {
  const { activeAlerts } = useAlert();
  const { toast } = useToast();

  // Show notification when a new high-priority alert comes in
  useEffect(() => {
    const highPriorityAlerts = activeAlerts.filter(a => a.priority <= 2);
    
    if (highPriorityAlerts.length > 0) {
      // Sort by creation time to get the newest alert
      const newestAlert = [...highPriorityAlerts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      
      // Only show toast for alerts created in the last 10 seconds
      const tenSecondsAgo = new Date(Date.now() - 10000);
      if (new Date(newestAlert.createdAt) > tenSecondsAgo) {
        const icon = getAlertIcon(newestAlert);
        
        toast({
          title: getAlertTitle(newestAlert),
          description: newestAlert.message || `Alert from ${newestAlert.senderName || 'Unknown'}`,
          variant: newestAlert.priority === 1 ? "destructive" : "default",
          duration: newestAlert.priority === 1 ? 10000 : 5000,
        });
      }
    }
  }, [activeAlerts]);

  // Helper functions to get alert display info
  const getAlertTitle = (alert: AlertType): string => {
    switch (alert.type) {
      case 'panic':
        return 'PANIC ALERT!';
      case 'emergency':
        return 'Emergency Alert';
      case 'patrol_stop':
        return 'Patrol Notification';
      case 'system':
        return 'System Alert';
      default:
        return 'Alert';
    }
  };

  const getAlertIcon = (alert: AlertType) => {
    switch (alert.type) {
      case 'panic':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'emergency':
        return <Alert className="h-5 w-5 text-destructive" />;
      case 'patrol_stop':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'system':
        return <BellRing className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return null; // This component doesn't render anything visible - it just shows toasts
}
