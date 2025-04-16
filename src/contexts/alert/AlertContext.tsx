
import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "../AuthContext";
import { useLocation } from "../LocationContext";
import { Alert } from "@/types";
import { AlertContextType } from "./types";
import { useAlertOperations } from "./useAlertOperations";
import { useAlertSubscription } from "./useAlertSubscription";

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { currentLocation } = useLocation();
  
  const {
    alerts,
    setAlerts,
    isLoading,
    fetchAlerts,
    createAlert,
    resolveAlert,
    playSound,
    stopSound
  } = useAlertOperations(user);
  
  // Set up realtime subscription
  useAlertSubscription(user, setAlerts, playSound);
  
  // Compute active alerts (not resolved)
  const activeAlerts = alerts.filter(alert => !alert.resolved);

  return (
    <AlertContext.Provider value={{ 
      alerts, 
      activeAlerts,
      isLoading, 
      createAlert, 
      resolveAlert,
      playAlertSound: playSound,
      stopAlertSound: stopSound
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
