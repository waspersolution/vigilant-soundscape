
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Bell, Siren, Radio, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAlert } from "@/contexts/AlertContext";
import { Alert as AlertType } from "@/types";

interface AlertNotificationProps {
  alert: AlertType;
  onClose: () => void;
}

export default function AlertNotification({ alert, onClose }: AlertNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 8000); // Close after 8 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const getAlertIcon = (type: AlertType["type"], priority: AlertType["priority"]) => {
    switch (type) {
      case "panic":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "emergency":
        return <Siren className="h-5 w-5 text-destructive" />;
      case "patrol_stop":
        return <Radio className="h-5 w-5 text-blue-500" />;
      case "system":
        return <Info className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <Card className={cn(
      "w-full shadow-lg animate-in fade-in slide-in-from-top-5 duration-300",
      alert.priority === 1 
        ? "border-destructive" 
        : alert.priority === 2 
          ? "border-amber-500" 
          : "border-blue-500"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-full",
            alert.priority === 1 
              ? "bg-destructive/10" 
              : alert.priority === 2 
                ? "bg-amber-500/10" 
                : "bg-blue-500/10"
          )}>
            {getAlertIcon(alert.type, alert.priority)}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">
              {alert.type === "panic" ? "Panic Alert" : 
               alert.type === "emergency" ? "Emergency" : 
               alert.type === "patrol_stop" ? "Patrol Notice" : 
               "System Alert"}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {alert.message || "No details provided"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
