
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Alert } from "@/types";
import { useAuth } from "./AuthContext";

interface AlertContextType {
  alerts: Alert[];
  activeAlerts: Alert[];
  isLoading: boolean;
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
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 minutes ago
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

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertSound, setAlertSound] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // This would be replaced with actual API call
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setAlerts(mockAlerts);
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
        createdAt: new Date().toISOString()
      };
      
      setAlerts(prev => [newAlert, ...prev]);
      
      // Play alert sound
      playAlertSound(type);
      
      return;
    } catch (error) {
      console.error("Failed to create alert:", error);
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
      
      return;
    } catch (error) {
      console.error("Failed to resolve alert:", error);
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
