
import { useState } from "react";
import { useAlert } from "@/contexts/AlertContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, CheckCircle, Siren, Radio, Info } from "lucide-react";
import { Alert as AlertType } from "@/types";
import { cn } from "@/lib/utils";

export default function AlertsList() {
  const { alerts, activeAlerts, resolveAlert, isLoading } = useAlert();
  const [selectedTab, setSelectedTab] = useState("active");
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);

  const resolvedAlerts = alerts.filter(alert => alert.resolved);

  const handleResolve = async (alertId: string) => {
    try {
      await resolveAlert(alertId);
      setSelectedAlert(null);
    } catch (error) {
      console.error("Failed to resolve alert:", error);
    }
  };

  const getAlertIcon = (type: AlertType["type"], priority: AlertType["priority"]) => {
    switch (type) {
      case "panic":
        return <AlertTriangle className={cn(
          "h-5 w-5",
          priority === 1 ? "text-destructive" : "text-amber-500"
        )} />;
      case "emergency":
        return <Siren className={cn(
          "h-5 w-5",
          priority <= 2 ? "text-destructive" : "text-amber-500"
        )} />;
      case "patrol_stop":
        return <Radio className="h-5 w-5 text-blue-500" />;
      case "system":
        return <Info className="h-5 w-5 text-primary" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const renderAlertItem = (alert: AlertType) => (
    <div
      key={alert.id}
      className={cn(
        "flex items-start gap-3 p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/30 transition-colors",
        selectedAlert?.id === alert.id && "bg-muted/50"
      )}
      onClick={() => setSelectedAlert(alert)}
    >
      <div className={cn(
        "p-2 rounded-full",
        alert.priority === 1 
          ? "bg-destructive/10" 
          : alert.priority === 2 
            ? "bg-amber-500/10" 
            : "bg-blue-500/10",
        !alert.resolved && alert.priority === 1 && "animate-pulse-alert"
      )}>
        {getAlertIcon(alert.type, alert.priority)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-medium truncate">
            {alert.type === "panic" ? "Panic Alert" : 
             alert.type === "emergency" ? "Emergency" : 
             alert.type === "patrol_stop" ? "Patrol Notice" : 
             "System Alert"}
          </h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-1">
            {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {alert.message || "No details provided"}
        </p>
        {alert.senderName && (
          <p className="text-xs text-muted-foreground mt-1">
            Reported by: {alert.senderName}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Tabs defaultValue="active" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="active" className="relative">
            Active
            {activeAlerts.length > 0 && (
              <span className="ml-1.5 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                {activeAlerts.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {activeAlerts.length === 0 ? (
                <div className="py-8 text-center">
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">No active alerts</p>
                </div>
              ) : (
                <div className="divide-y">
                  {activeAlerts.map(renderAlertItem)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resolved" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {resolvedAlerts.length === 0 ? (
                <div className="py-8 text-center">
                  <Info className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No resolved alerts yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {resolvedAlerts.map(renderAlertItem)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alert Details */}
      {selectedAlert && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-full",
                selectedAlert.priority === 1 
                  ? "bg-destructive/10" 
                  : selectedAlert.priority === 2 
                    ? "bg-amber-500/10" 
                    : "bg-blue-500/10"
              )}>
                {getAlertIcon(selectedAlert.type, selectedAlert.priority)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">
                    {selectedAlert.type === "panic" ? "Panic Alert" : 
                     selectedAlert.type === "emergency" ? "Emergency" : 
                     selectedAlert.type === "patrol_stop" ? "Patrol Notice" : 
                     "System Alert"}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(selectedAlert.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm mt-1">
                  {selectedAlert.message || "No details provided"}
                </p>
                
                {selectedAlert.senderName && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Reported by: {selectedAlert.senderName}
                  </p>
                )}

                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    Lat: {selectedAlert.location.latitude.toFixed(6)}, 
                    Lng: {selectedAlert.location.longitude.toFixed(6)}
                  </p>
                </div>
                
                {selectedAlert.resolved ? (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center text-green-500 gap-1.5">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Resolved</span>
                    </div>
                    {selectedAlert.resolvedAt && (
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(selectedAlert.resolvedAt), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2 mt-4">
                    <Button
                      className="flex-1"
                      variant="secondary"
                      onClick={() => setSelectedAlert(null)}
                    >
                      Close
                    </Button>
                    <Button
                      className="flex-1"
                      variant={selectedAlert.priority <= 2 ? "destructive" : "default"}
                      onClick={() => handleResolve(selectedAlert.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Resolving..." : "Mark Resolved"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
