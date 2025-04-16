
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Check, Save, Layers, Users, Bell, Shield, Map } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export default function DashboardSettings() {
  const [dashboardConfig, setDashboardConfig] = useState({
    showPatrols: true,
    showAlerts: true,
    showMemberStatus: true,
    showCommunityFeed: true,
    showMap: true,
    theme: "system",
    layout: "default"
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleChange = (key: string) => {
    setDashboardConfig(prev => ({ 
      ...prev, 
      [key]: !prev[key as keyof typeof dashboardConfig] 
    }));
  };

  const handleRadioChange = (key: string, value: string) => {
    setDashboardConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Save dashboard preferences to localStorage
      localStorage.setItem('dashboardConfig', JSON.stringify(dashboardConfig));
      
      setIsSaving(false);
      setSaveSuccess(true);
      toast.success("Dashboard settings saved");
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Widgets</CardTitle>
          <CardDescription>
            Customize which widgets appear on your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary" />
                <Label htmlFor="showPatrols" className="font-medium">Active Patrols</Label>
              </div>
              <Switch
                id="showPatrols"
                checked={dashboardConfig.showPatrols}
                onCheckedChange={() => handleToggleChange("showPatrols")}
              />
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              Show active security patrols on your dashboard
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-primary" />
                <Label htmlFor="showAlerts" className="font-medium">Recent Alerts</Label>
              </div>
              <Switch
                id="showAlerts"
                checked={dashboardConfig.showAlerts}
                onCheckedChange={() => handleToggleChange("showAlerts")}
              />
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              Display recent security alerts in your community
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary" />
                <Label htmlFor="showMemberStatus" className="font-medium">Member Status</Label>
              </div>
              <Switch
                id="showMemberStatus"
                checked={dashboardConfig.showMemberStatus}
                onCheckedChange={() => handleToggleChange("showMemberStatus")}
              />
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              View online status of community members
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Map className="h-4 w-4 text-primary" />
                <Label htmlFor="showMap" className="font-medium">Community Map</Label>
              </div>
              <Switch
                id="showMap"
                checked={dashboardConfig.showMap}
                onCheckedChange={() => handleToggleChange("showMap")}
              />
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              Show map preview on your dashboard
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Layout & Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="font-medium">Theme Preference</Label>
            <RadioGroup 
              value={dashboardConfig.theme} 
              onValueChange={(value) => handleRadioChange("theme", value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light">Light Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark">Dark Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system">Use System Theme</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Label className="font-medium">Dashboard Layout</Label>
            <RadioGroup 
              value={dashboardConfig.layout} 
              onValueChange={(value) => handleRadioChange("layout", value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="layout-default" />
                <Label htmlFor="layout-default">Default</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="layout-compact" />
                <Label htmlFor="layout-compact">Compact</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expanded" id="layout-expanded" />
                <Label htmlFor="layout-expanded">Expanded (Security Focus)</Label>
              </div>
            </RadioGroup>
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
    </div>
  );
}
