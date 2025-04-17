import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { useAlert } from "@/contexts/AlertContext";
import { useLocation } from "@/contexts/LocationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import AlertsList from "@/components/alerts/AlertsList";
import EmergencyButton from "@/components/alerts/EmergencyButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemberStatusList from "@/components/dashboard/MemberStatusList";
import ActivePatrolsList from "@/components/dashboard/ActivePatrolsList";
import { Shield, Radio, MapPin, Users, AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

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

export default function Home() {
  const { user } = useAuth();
  const { activeAlerts } = useAlert();
  const { currentLocation, isTracking, startTracking } = useLocation();
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(defaultConfig);
  
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('dashboardConfig');
      if (savedConfig) {
        setDashboardConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error("Error loading dashboard configuration:", error);
    }
  }, []);
  
  if (!isTracking && user) {
    startTracking();
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome, {user?.fullName || 'User'}</h1>
        <p className="text-muted-foreground">
          Community security dashboard for your neighborhood
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={cn(
          "border-l-4",
          activeAlerts.length > 0 ? "border-l-destructive" : "border-l-green-500"
        )}>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Alert Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">
                  {activeAlerts.length > 0 ? activeAlerts.length : "All Clear"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activeAlerts.length > 0 ? "Active Alerts" : "No active alerts"}
                </p>
              </div>
              <Link to="/alerts">
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(
          "border-l-4",
          currentLocation ? "border-l-blue-500" : "border-l-amber-500"
        )}>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">
                  {currentLocation ? "Active" : "Standby"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentLocation ? "Tracking enabled" : "Not tracking location"}
                </p>
              </div>
              <Link to="/map">
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={`grid grid-cols-1 ${dashboardConfig.layout === 'expanded' ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-6`}>
        {dashboardConfig.showMemberStatus && (
          <div className="lg:col-span-1">
            <MemberStatusList />
          </div>
        )}

        <div className={`${dashboardConfig.layout === 'expanded' || !dashboardConfig.showMemberStatus ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
          {dashboardConfig.showPatrols && (
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Active Patrols</CardTitle>
                <CardDescription>Recent security patrol activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivePatrolsList />
              </CardContent>
            </Card>
          )}

          {dashboardConfig.showAlerts && (
            <Tabs defaultValue="alerts">
              <TabsList>
                <TabsTrigger value="alerts" className="relative">
                  Alerts
                  {activeAlerts.length > 0 && (
                    <span className="ml-1.5 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                      {activeAlerts.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>
              <TabsContent value="alerts" className="space-y-4 mt-3">
                <ScrollArea className="h-[300px]">
                  <AlertsList />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="activity" className="mt-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="rounded-md border bg-muted/30 p-8 text-center">
                      <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium">Community Activity</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        No recent activity to display
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      <EmergencyButton />
    </div>
  );
}
