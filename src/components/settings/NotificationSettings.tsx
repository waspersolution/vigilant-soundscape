
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Check, Save, AlertTriangle, BellRing, Shield, User } from "lucide-react";
import { toast } from "sonner";

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    emergencyAlerts: true,
    patrolUpdates: true,
    communityMessages: true,
    soundAlerts: true,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      toast.success("Notification settings saved");
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Control how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <Label htmlFor="emergencyAlerts" className="font-medium">Emergency Alerts</Label>
            </div>
            <Switch
              id="emergencyAlerts"
              checked={notifications.emergencyAlerts}
              onCheckedChange={() => handleNotificationChange("emergencyAlerts")}
            />
          </div>
          <p className="text-sm text-muted-foreground ml-6">
            Receive critical security alerts (these cannot be fully disabled)
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-primary" />
              <Label htmlFor="patrolUpdates" className="font-medium">Patrol Updates</Label>
            </div>
            <Switch
              id="patrolUpdates"
              checked={notifications.patrolUpdates}
              onCheckedChange={() => handleNotificationChange("patrolUpdates")}
            />
          </div>
          <p className="text-sm text-muted-foreground ml-6">
            Updates on security patrol activities in your area
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-primary" />
              <Label htmlFor="communityMessages" className="font-medium">Community Messages</Label>
            </div>
            <Switch
              id="communityMessages"
              checked={notifications.communityMessages}
              onCheckedChange={() => handleNotificationChange("communityMessages")}
            />
          </div>
          <p className="text-sm text-muted-foreground ml-6">
            General messages from community members and managers
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BellRing className="h-4 w-4 text-primary" />
              <Label htmlFor="soundAlerts" className="font-medium">Sound Alerts</Label>
            </div>
            <Switch
              id="soundAlerts"
              checked={notifications.soundAlerts}
              onCheckedChange={() => handleNotificationChange("soundAlerts")}
            />
          </div>
          <p className="text-sm text-muted-foreground ml-6">
            Play sound for emergency alerts (recommended)
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? (
            "Saving..."
          ) : saveSuccess ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
