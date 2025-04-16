import React from 'react';
import { AlertTriangle } from 'lucide-react'; // Changed from 'Alert' to 'AlertTriangle'
import { useAlert } from '@/contexts/AlertContext';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const AlertNotification = () => {
  const { activeAlerts } = useAlert();

  if (activeAlerts.length === 0) return null;

  return (
    <Dialog open={activeAlerts.length > 0}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Active Alerts
          </DialogTitle>
          <DialogDescription>
            There are {activeAlerts.length} active alert(s) in your community.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AlertNotification;
