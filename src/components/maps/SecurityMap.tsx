
import { useEffect, useRef, useState } from "react";
import { useLocation } from "@/contexts/LocationContext";
import { useAlert } from "@/contexts/AlertContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Layers, MapPin, Navigation, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert } from "@/types";

// This is a mock component since we can't use actual map libraries
// In a real implementation, this would use React Leaflet, Google Maps, or Mapbox
export default function SecurityMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { currentLocation, isTracking, startTracking, stopTracking } = useLocation();
  const { activeAlerts } = useAlert();
  const [mapView, setMapView] = useState<"standard" | "satellite">("standard");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  useEffect(() => {
    // In a real implementation, this would initialize the map
    console.log("Map would initialize here with location:", currentLocation);
  }, []);

  // Handle location updates
  useEffect(() => {
    if (currentLocation) {
      // In a real implementation, this would update the map center
      console.log("Map would center on:", currentLocation);
    }
  }, [currentLocation]);

  // Toggle location tracking
  const toggleTracking = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  // Change map view type
  const toggleMapView = () => {
    setMapView(prev => prev === "standard" ? "satellite" : "standard");
  };

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] rounded-lg overflow-hidden">
      {/* Mock Map (would be replaced with actual map component) */}
      <div 
        ref={mapRef} 
        className={cn(
          "absolute inset-0 bg-gray-200 flex items-center justify-center",
          mapView === "satellite" ? "bg-gray-700" : "bg-gray-200"
        )}
      >
        {/* Simulated map content */}
        <div className="text-center p-4 max-w-xs text-gray-500">
          <p className="mb-2 font-medium">Interactive Map Visualization</p>
          <p className="text-sm">
            {currentLocation ? 
              `Currently showing: ${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}` :
              "Waiting for location..."
            }
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {/* Mock location marker */}
            {currentLocation && (
              <div className="relative p-2 bg-blue-500 rounded-full">
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping-location opacity-75"></div>
                <MapPin className="h-4 w-4 text-white" />
              </div>
            )}
            
            {/* Mock alert markers */}
            {activeAlerts.map(alert => (
              <div 
                key={alert.id}
                className="relative p-2 bg-destructive rounded-full cursor-pointer"
                onClick={() => setSelectedAlert(alert)}
              >
                <div className={cn(
                  "absolute inset-0 bg-destructive rounded-full animate-ping-location opacity-75",
                  alert.priority === 1 && "animate-flash-alert"
                )}></div>
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="bg-background/80 backdrop-blur-sm shadow-md"
          onClick={toggleMapView}
        >
          <Layers className="h-5 w-5" />
        </Button>
        
        <Button
          variant={isTracking ? "default" : "secondary"}
          size="icon"
          className={cn(
            "shadow-md",
            isTracking ? "bg-primary" : "bg-background/80 backdrop-blur-sm"
          )}
          onClick={toggleTracking}
        >
          <Navigation className="h-5 w-5" />
        </Button>
      </div>

      {/* Alert Info Card */}
      {selectedAlert && (
        <Card className="absolute bottom-4 left-4 right-4 p-4 bg-background/90 backdrop-blur-sm shadow-lg animate-slide-in-bottom">
          <div className="flex items-start gap-3">
            <div className={cn(
              "p-2 rounded-full",
              selectedAlert.priority === 1 ? "bg-destructive animate-pulse-alert" : "bg-amber-500"
            )}>
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">
                {selectedAlert.type === "panic" ? "Panic Alert" : 
                 selectedAlert.type === "emergency" ? "Emergency" : 
                 selectedAlert.type === "patrol_stop" ? "Patrol Notice" : "System Alert"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedAlert.message || "No details provided"}
              </p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedAlert(null)}>
                  Dismiss
                </Button>
                <Button size="sm">Respond</Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
