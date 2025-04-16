
import { Alert } from "@/types";

export interface AlertContextType {
  alerts: Alert[];
  activeAlerts: Alert[];
  isLoading: boolean;
  createAlert: (type: Alert['type'], message?: string, priority?: Alert['priority']) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
  playAlertSound: (type: Alert['type']) => void;
  stopAlertSound: () => void;
}
