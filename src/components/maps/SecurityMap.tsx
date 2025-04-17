
import { useEffect, useRef, useState } from "react";
import { useLocation } from "@/contexts/LocationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Layers, 
  MapPin, 
  Navigation, 
  AlertTriangle, 
  Map as MapIcon,
  History,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert } from "@/types";
import { toast } from "sonner";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "@/integrations/supabase/client";

// Temporary token for demo purposes, in production use environment variables
const MAPBOX_TOKEN = "pk.eyJ1IjoibG92YWJsZS1haS1tYXAiLCJhIjoiY2x6dHVodWQxMGN4NzJpbnl1MXd2dzk3OCJ9.Gu9SQNUfeeKGrlsWUxWLwQ";

// Default map center (San Francisco)
const DEFAULT_CENTER = {
  lng: -122.4194,
  lat: 37.7749
};

// Geofence radius in meters
const DEFAULT_GEOFENCE_RADIUS = 500;

// Map Layer IDs
const GEOFENCE_LAYER_ID = "geofence-layer";
const HISTORY_LAYER_ID = "history-layer";
const ALERTS_LAYER_ID = "alerts-layer";
const PATROLS_LAYER_ID = "patrols-layer";

export default function SecurityMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const geofenceRef = useRef<any>(null);
  
  const { currentLocation, isTracking, startTracking, stopTracking, locationHistory } = useLocation();
  const { activeAlerts } = useAlert();
  const { user } = useAuth();
  
  const [mapView, setMapView] = useState<"standard" | "satellite">("standard");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showLocationHistory, setShowLocationHistory] = useState(false);
  const [showGeofence, setShowGeofence] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [patrolRoutes, setPatrolRoutes] = useState<any[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: mapView === "satellite" 
          ? "mapbox://styles/mapbox/satellite-streets-v12" 
          : "mapbox://styles/mapbox/streets-v12",
        center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
        zoom: 13,
        pitch: 30
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-left");
      
      map.on("load", () => {
        setMapLoaded(true);
        
        // Initialize geofence layer
        map.addSource("geofence-source", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat]
            },
            properties: {}
          }
        });
        
        map.addLayer({
          id: GEOFENCE_LAYER_ID,
          type: "circle",
          source: "geofence-source",
          paint: {
            "circle-radius": ["get", "radius"],
            "circle-color": "#2563EB",
            "circle-opacity": 0.2,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#2563EB"
          },
          layout: {
            visibility: "none"
          }
        });

        // Initialize history layer
        map.addSource("history-source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: []
          }
        });
        
        map.addLayer({
          id: HISTORY_LAYER_ID,
          type: "line",
          source: "history-source",
          layout: {
            "line-join": "round",
            "line-cap": "round",
            visibility: "none"
          },
          paint: {
            "line-color": "#10B981",
            "line-width": 3,
            "line-opacity": 0.8
          }
        });

        // Initialize alerts layer
        map.addSource("alerts-source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: []
          }
        });

        map.addLayer({
          id: ALERTS_LAYER_ID,
          type: "circle",
          source: "alerts-source",
          paint: {
            "circle-radius": 10,
            "circle-color": [
              "match",
              ["get", "priority"],
              1, "#EF4444",
              2, "#F97316", 
              3, "#EAB308",
              4, "#3B82F6",
              5, "#10B981",
              "#EF4444"
            ],
            "circle-opacity": 0.8,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#FFFFFF"
          }
        });

        // Initialize patrol routes layer
        map.addSource("patrols-source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: []
          }
        });

        map.addLayer({
          id: PATROLS_LAYER_ID,
          type: "line",
          source: "patrols-source",
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": "#9333EA",
            "line-width": 3,
            "line-opacity": 0.8,
            "line-dasharray": [1, 1]
          }
        });

        // Fetch initial patrol routes
        fetchPatrolRoutes();
      });

      // Popup for alert markers
      map.on("click", ALERTS_LAYER_ID, (e) => {
        if (e.features && e.features.length > 0) {
          const alertData = e.features[0].properties;
          
          // Parse the properties back to an Alert object
          setSelectedAlert({
            id: alertData.id,
            senderId: alertData.senderId,
            senderName: alertData.senderName,
            communityId: alertData.communityId,
            type: alertData.type,
            location: {
              latitude: e.lngLat.lat,
              longitude: e.lngLat.lng
            },
            message: alertData.message,
            priority: alertData.priority,
            resolved: alertData.resolved === "true",
            createdAt: alertData.createdAt
          });
        }
      });
      
      mapInstanceRef.current = map;
      
      return () => {
        map.remove();
        mapInstanceRef.current = null;
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error("Failed to load the map. Please try again.");
    }
  }, []);

  // Update alerts on map
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;
    
    try {
      const map = mapInstanceRef.current;
      const alertFeatures = activeAlerts.map(alert => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            alert.location.longitude, 
            alert.location.latitude
          ]
        },
        properties: {
          id: alert.id,
          senderId: alert.senderId,
          senderName: alert.senderName || "Unknown",
          communityId: alert.communityId,
          type: alert.type,
          message: alert.message || "No details provided",
          priority: alert.priority,
          resolved: String(alert.resolved),
          createdAt: alert.createdAt
        }
      }));

      const alertsSource = map.getSource("alerts-source");
      if (alertsSource && "setData" in alertsSource) {
        alertsSource.setData({
          type: "FeatureCollection",
          features: alertFeatures
        });
      }
    } catch (error) {
      console.error("Error updating alerts on map:", error);
    }
  }, [activeAlerts, mapLoaded]);

  // Update current location marker
  useEffect(() => {
    if (!currentLocation || !mapInstanceRef.current || !mapLoaded) return;
    
    try {
      const map = mapInstanceRef.current;
      
      // Create or update user marker
      if (!mapInstanceRef.current["userMarker"]) {
        const el = document.createElement("div");
        el.className = "current-location-marker";
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = "#3B82F6";
        el.style.border = "3px solid white";
        el.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.5)";
        
        const marker = new mapboxgl.Marker({
          element: el,
          anchor: "center"
        })
          .setLngLat([currentLocation.longitude, currentLocation.latitude])
          .addTo(map);
        
        mapInstanceRef.current["userMarker"] = marker;

        // Center map on first location
        map.flyTo({
          center: [currentLocation.longitude, currentLocation.latitude],
          essential: true,
          zoom: 15
        });
      } else {
        mapInstanceRef.current["userMarker"].setLngLat([
          currentLocation.longitude, 
          currentLocation.latitude
        ]);
      }

      // Update geofence if active
      if (showGeofence && geofenceRef.current) {
        updateGeofence(currentLocation.latitude, currentLocation.longitude);
      }

      // Check if user entered or left geofence
      if (showGeofence && geofenceRef.current) {
        const distance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          geofenceRef.current.lat,
          geofenceRef.current.lng
        );
        
        if (distance > geofenceRef.current.radius / 1000) {
          // Outside geofence
          if (geofenceRef.current.inside) {
            geofenceRef.current.inside = false;
            toast.warning("Alert: You have left the designated area");
          }
        } else {
          // Inside geofence
          if (!geofenceRef.current.inside) {
            geofenceRef.current.inside = true;
            toast.success("You have entered the designated area");
          }
        }
      }
    } catch (error) {
      console.error("Error updating location marker:", error);
    }
  }, [currentLocation, mapLoaded, showGeofence]);

  // Update location history
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;
    
    try {
      const map = mapInstanceRef.current;
      
      // Convert location history to GeoJSON line
      if (locationHistory.length > 1) {
        const coordinates = locationHistory.map(loc => [loc.longitude, loc.latitude]);
        
        const historySource = map.getSource("history-source");
        if (historySource && "setData" in historySource) {
          historySource.setData({
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates
            }
          });
        }

        // Toggle visibility based on showLocationHistory
        map.setLayoutProperty(
          HISTORY_LAYER_ID,
          "visibility",
          showLocationHistory ? "visible" : "none"
        );
      }
    } catch (error) {
      console.error("Error updating location history:", error);
    }
  }, [locationHistory, showLocationHistory, mapLoaded]);

  // Fetch patrol routes
  const fetchPatrolRoutes = async () => {
    if (!mapLoaded || !mapInstanceRef.current || !user?.communityId) return;
    
    try {
      // Fetch active patrol routes
      const { data, error } = await supabase
        .from("patrol_sessions")
        .select("id, guard_id, route_data, status")
        .eq("community_id", user.communityId)
        .in("status", ["active", "completed"])
        .order("start_time", { ascending: false })
        .limit(5);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setPatrolRoutes(data);
        
        // Process for map display
        const patrolFeatures = data
          .filter(patrol => Array.isArray(patrol.route_data) && patrol.route_data.length > 1)
          .map(patrol => ({
            type: "Feature",
            properties: {
              id: patrol.id,
              guardId: patrol.guard_id,
              status: patrol.status
            },
            geometry: {
              type: "LineString",
              coordinates: patrol.route_data.map((point: any) => [
                point.longitude,
                point.latitude
              ])
            }
          }));

        const patrolsSource = mapInstanceRef.current.getSource("patrols-source");
        if (patrolsSource && "setData" in patrolsSource) {
          patrolsSource.setData({
            type: "FeatureCollection",
            features: patrolFeatures
          });
        }
      }
    } catch (error) {
      console.error("Error fetching patrol routes:", error);
    }
  };

  // Toggle map style
  const toggleMapView = () => {
    if (!mapInstanceRef.current) return;
    
    try {
      const newStyle = mapView === "standard" ? "satellite" : "standard";
      setMapView(newStyle);
      
      mapInstanceRef.current.setStyle(
        newStyle === "satellite" 
          ? "mapbox://styles/mapbox/satellite-streets-v12" 
          : "mapbox://styles/mapbox/streets-v12"
      );
    } catch (error) {
      console.error("Error toggling map style:", error);
    }
  };

  // Toggle location tracking
  const toggleTracking = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  // Toggle location history
  const toggleLocationHistory = () => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    
    try {
      const newState = !showLocationHistory;
      setShowLocationHistory(newState);
      
      mapInstanceRef.current.setLayoutProperty(
        HISTORY_LAYER_ID,
        "visibility",
        newState ? "visible" : "none"
      );
      
      if (newState && locationHistory.length > 1) {
        // Fit map to show entire history
        const coordinates = locationHistory.map(loc => [loc.longitude, loc.latitude]);
        fitMapToCoordinates(coordinates);
      }
    } catch (error) {
      console.error("Error toggling location history:", error);
    }
  };

  // Toggle geofence
  const toggleGeofence = () => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    
    try {
      const newState = !showGeofence;
      setShowGeofence(newState);
      
      mapInstanceRef.current.setLayoutProperty(
        GEOFENCE_LAYER_ID,
        "visibility",
        newState ? "visible" : "none"
      );
      
      if (newState) {
        // Create geofence at current location or map center
        const center = currentLocation 
          ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
          : DEFAULT_CENTER;
          
        createGeofence(center.lat, center.lng);
      }
    } catch (error) {
      console.error("Error toggling geofence:", error);
    }
  };

  // Create geofence
  const createGeofence = (lat: number, lng: number) => {
    if (!mapInstanceRef.current) return;
    
    try {
      const radiusInPixels = metersToPixelsAtMaxZoom(DEFAULT_GEOFENCE_RADIUS, lat);
      
      const geofenceData = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat]
        },
        properties: {
          radius: radiusInPixels
        }
      };
      
      const geofenceSource = mapInstanceRef.current.getSource("geofence-source");
      if (geofenceSource && "setData" in geofenceSource) {
        geofenceSource.setData(geofenceData);
      }
      
      // Store geofence reference
      geofenceRef.current = {
        lat,
        lng,
        radius: DEFAULT_GEOFENCE_RADIUS,
        inside: false
      };
      
      toast.success("Geofence created at this location");
    } catch (error) {
      console.error("Error creating geofence:", error);
    }
  };

  // Update geofence position
  const updateGeofence = (lat: number, lng: number) => {
    if (!mapInstanceRef.current || !geofenceRef.current) return;
    
    try {
      geofenceRef.current = {
        ...geofenceRef.current,
        lat,
        lng
      };
      
      const radiusInPixels = metersToPixelsAtMaxZoom(geofenceRef.current.radius, lat);
      
      const geofenceData = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat]
        },
        properties: {
          radius: radiusInPixels
        }
      };
      
      const geofenceSource = mapInstanceRef.current.getSource("geofence-source");
      if (geofenceSource && "setData" in geofenceSource) {
        geofenceSource.setData(geofenceData);
      }
    } catch (error) {
      console.error("Error updating geofence:", error);
    }
  };

  // Utility: Calculate distance between two points in km (haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Utility: Convert meters to pixels at zoom level
  const metersToPixelsAtMaxZoom = (meters: number, latitude: number) => {
    const earthCircumference = 40075016.68;
    const latitudeRadians = latitude * Math.PI / 180;
    return meters * (512 / earthCircumference) / Math.cos(latitudeRadians);
  };

  // Utility: Fit map to show all coordinates
  const fitMapToCoordinates = (coordinates: number[][]) => {
    if (!mapInstanceRef.current || coordinates.length < 2) return;
    
    try {
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord as [number, number]);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
      
      mapInstanceRef.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    } catch (error) {
      console.error("Error fitting map to coordinates:", error);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] rounded-lg overflow-hidden">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="absolute inset-0 bg-gray-200 rounded-lg"
      />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="bg-background/80 backdrop-blur-sm shadow-md"
          onClick={toggleMapView}
          title={`Switch to ${mapView === "standard" ? "satellite" : "standard"} view`}
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
          title={isTracking ? "Stop tracking" : "Start tracking"}
        >
          <Navigation className="h-5 w-5" />
        </Button>

        <Button
          variant={showLocationHistory ? "default" : "secondary"}
          size="icon"
          className={cn(
            "shadow-md",
            showLocationHistory ? "bg-green-600" : "bg-background/80 backdrop-blur-sm"
          )}
          onClick={toggleLocationHistory}
          title={showLocationHistory ? "Hide location history" : "Show location history"}
        >
          <History className="h-5 w-5" />
        </Button>

        <Button
          variant={showGeofence ? "default" : "secondary"}
          size="icon"
          className={cn(
            "shadow-md",
            showGeofence ? "bg-blue-600" : "bg-background/80 backdrop-blur-sm"
          )}
          onClick={toggleGeofence}
          title={showGeofence ? "Disable geofence" : "Enable geofence"}
        >
          <Shield className="h-5 w-5" />
        </Button>
      </div>

      {/* Refresh Patrol Data Button */}
      <div className="absolute bottom-20 right-4">
        <Button 
          variant="secondary"
          size="sm"
          className="bg-background/80 backdrop-blur-sm shadow-md"
          onClick={fetchPatrolRoutes}
        >
          Refresh Patrol Data
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
