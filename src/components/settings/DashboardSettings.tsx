
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/ThemeProvider";
import { toast } from "sonner";

interface DashboardConfig {
  showPatrols: boolean;
  showAlerts: boolean;
  showMemberStatus: boolean;
  showCommunityFeed: boolean;
  showMap: boolean;
  theme: string;
  layout: string;
}

const defaultConfig: DashboardConfig = {
  showPatrols: true,
  showAlerts: true,
  showMemberStatus: true,
  showCommunityFeed: true,
  showMap: true,
  theme: "system",
  layout: "default"
};

export default function DashboardSettings() {
  const { theme, setTheme } = useTheme();
  const [config, setConfig] = useState<DashboardConfig>(defaultConfig);

  // Load config on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('dashboardConfig');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        
        // Ensure theme context is synchronized with config
        if (parsedConfig.theme && parsedConfig.theme !== theme) {
          setTheme(parsedConfig.theme as "light" | "dark" | "system");
        }
      }
    } catch (error) {
      console.error("Error loading dashboard configuration:", error);
    }
  }, [theme, setTheme]);

  // Save config when it changes
  const updateConfig = (updates: Partial<DashboardConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    try {
      localStorage.setItem('dashboardConfig', JSON.stringify(newConfig));
      
      // If theme is changed, update the theme context
      if (updates.theme && updates.theme !== config.theme) {
        setTheme(updates.theme as "light" | "dark" | "system");
        
        // Force CSS class application
        if (updates.theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          document.documentElement.classList.toggle('dark', systemTheme === 'dark');
        } else {
          document.documentElement.classList.toggle('dark', updates.theme === 'dark');
        }
      }
      
      toast.success("Dashboard settings updated");
    } catch (error) {
      console.error("Error saving dashboard configuration:", error);
      toast.error("Failed to save settings");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Preferences</CardTitle>
        <CardDescription>
          Customize your dashboard experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Theme</h3>
          <Tabs 
            defaultValue={config.theme} 
            value={config.theme}
            onValueChange={(value) => updateConfig({ theme: value })}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="light">Light</TabsTrigger>
              <TabsTrigger value="dark">Dark</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Layout</h3>
          <Tabs 
            defaultValue={config.layout} 
            value={config.layout}
            onValueChange={(value) => updateConfig({ layout: value })}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="default">Default</TabsTrigger>
              <TabsTrigger value="expanded">Expanded</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Dashboard Widgets</h3>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Show Patrol Activity</span>
            <Switch 
              checked={config.showPatrols} 
              onCheckedChange={(checked) => updateConfig({ showPatrols: checked })} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Show Alerts</span>
            <Switch 
              checked={config.showAlerts} 
              onCheckedChange={(checked) => updateConfig({ showAlerts: checked })} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Show Member Status</span>
            <Switch 
              checked={config.showMemberStatus} 
              onCheckedChange={(checked) => updateConfig({ showMemberStatus: checked })} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Show Community Feed</span>
            <Switch 
              checked={config.showCommunityFeed} 
              onCheckedChange={(checked) => updateConfig({ showCommunityFeed: checked })} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Show Map View</span>
            <Switch 
              checked={config.showMap} 
              onCheckedChange={(checked) => updateConfig({ showMap: checked })} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
