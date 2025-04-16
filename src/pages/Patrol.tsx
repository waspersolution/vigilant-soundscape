
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Clock, Check, PlayCircle, StopCircle, User, Radio } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import EmergencyButton from "@/components/alerts/EmergencyButton";
import { formatDistance, formatDistanceToNow } from "date-fns";

export default function Patrol() {
  const { currentLocation, locationHistory, isTracking, startTracking, stopTracking } = useLocation();
  const [patrolActive, setPatrolActive] = useState(false);

  const startPatrol = () => {
    startTracking();
    setPatrolActive(true);
  };

  const endPatrol = () => {
    stopTracking();
    setPatrolActive(false);
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Patrol Management</h1>
        <p className="text-muted-foreground">
          Track and monitor security patrols in your community
        </p>
      </div>

      {/* Patrol Controls */}
      {patrolActive ? (
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Active Patrol</CardTitle>
                <CardDescription>Patrol in progress</CardDescription>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {locationHistory.length > 0 
                    ? formatDistanceToNow(new Date(locationHistory[0].timestamp), { addSuffix: false }) 
                    : "Just started"}
                </span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {currentLocation 
                    ? `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}` 
                    : "Waiting for location..."}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>Alertness checks: All passed (0/5)</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Patrol guard: You</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Radio className="h-4 w-4 text-blue-500" />
                <span>Status: Actively patrolling</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={endPatrol}
            >
              <StopCircle className="h-4 w-4 mr-2" />
              End Patrol
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Start New Patrol</CardTitle>
            <CardDescription>Begin tracking your security patrol route</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Starting a patrol will track your location and monitor your route. You will
              receive periodic alertness checks to ensure your safety.
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Your location will be tracked and logged</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>You'll receive alertness checks every 30 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-muted-foreground" />
                <span>Community members can view active patrols</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={startPatrol}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Start Patrol
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Patrol History */}
      <Tabs defaultValue="route">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="route">Current Route</TabsTrigger>
          <TabsTrigger value="history">Patrol History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="route" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Route Data</CardTitle>
              <CardDescription>Location history for current patrol</CardDescription>
            </CardHeader>
            <CardContent>
              {patrolActive && locationHistory.length > 0 ? (
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {locationHistory.slice().reverse().map((loc, index) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-3 p-2 border-b last:border-0"
                      >
                        <div className="p-1 rounded-full bg-primary/10">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm">
                            {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(loc.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="rounded-md border bg-muted/30 p-8 text-center">
                  <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">No route data available</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {patrolActive 
                      ? "Route tracking has started. Move around to record locations." 
                      : "Start a patrol to begin tracking your route"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Previous Patrols</CardTitle>
              <CardDescription>History of completed patrols</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border bg-muted/30 p-8 text-center">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">No patrol history</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your completed patrols will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <EmergencyButton />
    </div>
  );
}
