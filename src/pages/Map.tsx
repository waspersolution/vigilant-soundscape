
import SecurityMap from "@/components/maps/SecurityMap";
import EmergencyButton from "@/components/alerts/EmergencyButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/contexts/LocationContext";
import { formatDistanceToNow, parseISO } from "date-fns";
import { MapPin, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export default function Map() {
  const { locationHistory, clearHistory } = useLocation();
  const [activeTab, setActiveTab] = useState("map");

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Map</h1>
        <p className="text-muted-foreground">
          Real-time community monitoring, alerts, and location tracking
        </p>
      </div>

      <Tabs defaultValue="map" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="map">Interactive Map</TabsTrigger>
          <TabsTrigger value="location-history">Location History</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <SecurityMap />
        </TabsContent>

        <TabsContent value="location-history" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg">Location History</CardTitle>
                <CardDescription>View your historical location data</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearHistory}
                disabled={locationHistory.length === 0}
              >
                Clear History
              </Button>
            </CardHeader>
            <CardContent>
              {locationHistory.length > 0 ? (
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-3">
                    {[...locationHistory].reverse().map((location, index) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-3 p-3 border rounded-lg"
                      >
                        <div className="p-2 rounded-full bg-primary/10">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium">
                              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDistanceToNow(parseISO(location.timestamp), { addSuffix: true })}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(location.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="rounded-md border bg-muted/30 p-8 text-center">
                  <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">No location history available</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start location tracking to begin recording your movements
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {activeTab === "map" && <EmergencyButton />}
    </div>
  );
}
