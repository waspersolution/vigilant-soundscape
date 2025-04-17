
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Alert, AlertUsageLimit, EmergencyContactNotification } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { fetchEmergencyContacts } from "@/services/communicationService";

interface AlertContextType {
  alerts: Alert[];
  activeAlerts: Alert[];
  isLoading: boolean;
  alertUsage: AlertUsageLimit | null;
  createAlert: (type: Alert['type'], message?: string, priority?: Alert['priority']) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
  playAlertSound: (type: Alert['type']) => void;
  stopAlertSound: () => void;
}

// Mock initial alerts data
const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    senderId: "user-789",
    senderName: "Sarah Wilson",
    communityId: "comm-123",
    type: "panic",
    location: {
      latitude: 37.7739,
      longitude: -122.4312
    },
    message: "Help! Suspicious person near the park entrance",
    priority: 1,
    resolved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    notifiedContacts: [
      {
        contactId: "contact-1",
        contactName: "John Smith",
        notifiedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        method: "sms",
        status: "delivered"
      }
    ]
  },
  {
    id: "alert-2",
    senderId: "user-456",
    senderName: "Mike Johnson",
    communityId: "comm-123",
    type: "patrol_stop",
    location: {
      latitude: 37.7749,
      longitude: -122.4194
    },
    message: "Taking a scheduled break at main entrance",
    priority: 4,
    resolved: true,
    resolvedBy: "user-123",
    resolvedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
  }
];

// Mock alert usage data
const mockAlertUsage: AlertUsageLimit = {
  userId: "user-123",
  dailyCount: 1,
  monthlyCount: 3,
  lastAlertTime: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertUsage, setAlertUsage] = useState<AlertUsageLimit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alertSound, setAlertSound] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // This would be replaced with actual API call
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setAlerts(mockAlerts);
        
        if (user?.id) {
          // Simulate fetching alert usage
          setAlertUsage({
            ...mockAlertUsage,
            userId: user.id
          });
        }
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAlerts();
    } else {
      setAlerts([]);
      setAlertUsage(null);
      setIsLoading(false);
    }

    return () => {
      if (alertSound) {
        alertSound.pause();
        alertSound.currentTime = 0;
      }
    };
  }, [user]);

  const activeAlerts = alerts.filter(alert => !alert.resolved);

  const createAlert = async (
    type: Alert['type'], 
    message?: string, 
    priority: Alert['priority'] = 3
  ) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Check if user has reached daily limit (3 alerts per day)
      if (alertUsage && alertUsage.dailyCount >= 3) {
        toast.error("You've reached your daily alert limit (3 per day)");
        return;
      }
      
      // Check if user has reached monthly limit (10 alerts per month)
      if (alertUsage && alertUsage.monthlyCount >= 10) {
        toast.error("You've reached your monthly alert limit (10 per month)");
        return;
      }
      
      // Check if user is in cooldown period
      if (alertUsage?.cooldownUntil && new Date(alertUsage.cooldownUntil) > new Date()) {
        const cooldownMinutes = Math.ceil(
          (new Date(alertUsage.cooldownUntil).getTime() - Date.now()) / (1000 * 60)
        );
        toast.error(`Please wait ${cooldownMinutes} minutes before sending another alert`);
        return;
      }
      
      let notifiedContacts: EmergencyContactNotification[] | undefined;
      
      // For panic alerts, notify emergency contacts
      if (type === "panic") {
        // Fetch emergency contacts (would be moved to a backend function in production)
        const contacts = await fetchEmergencyContacts(user.communityId || "");
        
        if (contacts && contacts.length > 0) {
          // Mock SMS notification to emergency contacts
          notifiedContacts = contacts.map(contact => ({
            contactId: contact.id,
            contactName: contact.name,
            notifiedAt: new Date().toISOString(),
            method: "sms",
            status: "sent"
          }));
          
          toast.success(`Alert sent to ${contacts.length} emergency contacts`);
        }
      }
      
      // Mock creating an alert
      // In real app, this would call Supabase
      const newAlert: Alert = {
        id: `alert-${Date.now()}`,
        senderId: user.id,
        senderName: user.fullName,
        communityId: user.communityId || "",
        type,
        location: user.lastLocation || {
          latitude: 37.7749,
          longitude: -122.4194
        },
        message,
        priority,
        resolved: false,
        createdAt: new Date().toISOString(),
        notifiedContacts
      };
      
      setAlerts(prev => [newAlert, ...prev]);
      
      // Update usage limits
      if (alertUsage) {
        setAlertUsage({
          ...alertUsage,
          dailyCount: alertUsage.dailyCount + 1,
          monthlyCount: alertUsage.monthlyCount + 1,
          lastAlertTime: new Date().toISOString(),
          // Add 5 minute cooldown for panic alerts
          cooldownUntil: type === "panic" 
            ? new Date(Date.now() + 5 * 60 * 1000).toISOString() 
            : undefined
        });
      }
      
      // Play alert sound
      playAlertSound(type);
      
      toast.success(`${type.replace('_', ' ')} alert sent successfully`);
      
      return;
    } catch (error) {
      console.error("Failed to create alert:", error);
      toast.error("Failed to create alert");
      throw new Error("Failed to create alert");
    } finally {
      setIsLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Mock resolving an alert
      // In real app, this would call Supabase
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { 
                ...alert, 
                resolved: true,
                resolvedBy: user.id,
                resolvedAt: new Date().toISOString()
              } 
            : alert
        )
      );
      
      toast.success("Alert resolved successfully");
      return;
    } catch (error) {
      console.error("Failed to resolve alert:", error);
      toast.error("Failed to resolve alert");
      throw new Error("Failed to resolve alert");
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
      alertUsage,
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
