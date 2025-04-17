
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AlertsList from "@/components/alerts/AlertsList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Bell, History } from "lucide-react";
import EmergencyButton from "@/components/alerts/EmergencyButton";
import EmergencyAlertHistory from "@/components/alerts/EmergencyAlertHistory";

export default function Alerts() {
  const { user } = useAuth();
  const { alerts, activeAlerts } = useAlert();
  const [activeTab, setActiveTab] = useState("active");
  
  const isLeaderOrAdmin = user?.role === "community_leader" || user?.role === "admin" || user?.role === "community_manager";

  return (
    <div className="space-y-4 pb-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gradient">Alerts</h1>
        <p className="text-muted-foreground">
          View and manage emergency alerts for your community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Alert Summary</CardTitle>
              <CardDescription>Current alert status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-destructive" />
                  <span>Active Alerts</span>
                </div>
                <Badge variant={activeAlerts.length > 0 ? "destructive" : "outline"}>
                  {activeAlerts.length}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-muted-foreground" />
                  <span>Resolved Alerts</span>
                </div>
                <Badge variant="outline">
                  {alerts.filter(a => a.resolved).length}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-2">
                  <Bell className="text-muted-foreground" />
                  <span>Total Alerts</span>
                </div>
                <Badge variant="outline">
                  {alerts.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          {user && <EmergencyButton />}
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Active Alerts</span>
                {activeAlerts.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {activeAlerts.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>History</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <AlertsList showOnlyActive />
            </TabsContent>
            
            <TabsContent value="history">
              <AlertsList showResolved />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {isLeaderOrAdmin && (
        <div className="mt-8">
          <EmergencyAlertHistory />
        </div>
      )}
    </div>
  );
}
