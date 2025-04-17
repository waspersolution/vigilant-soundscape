
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
}

interface GeofenceConfig {
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number; // in meters
  active: boolean;
  name?: string;
}

interface LocationContextType {
  currentLocation: Location | null;
  isTracking: boolean;
  locationHistory: Location[];
  geofence: GeofenceConfig | null;
  startTracking: () => void;
  stopTracking: () => void;
  clearHistory: () => void;
  setGeofence: (config: GeofenceConfig | null) => void;
  checkGeofenceStatus: (location: Location) => "inside" | "outside" | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Boundary for demo - San Francisco area
const DEFAULT_LOCATION = {
  latitude: 37.7749,
  longitude: -122.4194
};

export function LocationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState<Location[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [geofence, setGeofenceState] = useState<GeofenceConfig | null>(null);

  // Initialize with user's last known location or default
  useEffect(() => {
    if (user?.lastLocation) {
      setCurrentLocation({
        latitude: user.lastLocation.latitude,
        longitude: user.lastLocation.longitude,
        timestamp: user.lastLocation.timestamp
      });
    } else if (isAuthenticated) {
      // Set default location if user is authenticated but has no last location
      setCurrentLocation({
        ...DEFAULT_LOCATION,
        timestamp: new Date().toISOString()
      });
    } else {
      setCurrentLocation(null);
    }
  }, [user, isAuthenticated]);

  // Load location history from localStorage on startup
  useEffect(() => {
    if (user?.id) {
      try {
        const savedHistory = localStorage.getItem(`location_history_${user.id}`);
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory) as Location[];
          if (Array.isArray(parsedHistory)) {
            setLocationHistory(parsedHistory);
          }
        }
      } catch (error) {
        console.error("Failed to load location history:", error);
      }
    }
  }, [user?.id]);

  // Function to check if a location is inside or outside the geofence
  const checkGeofenceStatus = (location: Location): "inside" | "outside" | null => {
    if (!geofence || !geofence.active) return null;
    
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      geofence.center.latitude,
      geofence.center.longitude
    );
    
    return distance <= geofence.radius / 1000 ? "inside" : "outside";
  };

  // Calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Convert degrees to radians
  const toRad = (value: number): number => {
    return value * Math.PI / 180;
  };

  // Start location tracking
  const startTracking = () => {
    if (!isAuthenticated || isTracking) return;
    
    try {
      // For demo, we'll use the Geolocation API if available, otherwise simulate
      if (navigator.geolocation) {
        const geoWatchId = navigator.geolocation.watchPosition(
          (position) => {
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date().toISOString()
            };
            
            setCurrentLocation(newLocation);
            
            // Add to history
            setLocationHistory(history => {
              const updatedHistory = [...history, newLocation];
              
              // Save history to localStorage
              if (user?.id) {
                try {
                  localStorage.setItem(
                    `location_history_${user.id}`, 
                    JSON.stringify(updatedHistory.slice(-100)) // Keep last 100 entries
                  );
                } catch (error) {
                  console.error("Failed to save location history:", error);
                }
              }
              
              return updatedHistory;
            });
            
            // Check geofence status if active
            if (geofence?.active) {
              const status = checkGeofenceStatus(newLocation);
              
              // Get previous status to detect transitions
              const prevStatus = currentLocation 
                ? checkGeofenceStatus(currentLocation) 
                : null;
              
              // Notify on status change
              if (status !== prevStatus && prevStatus !== null) {
                if (status === "outside") {
                  toast.warning("Alert: You have left the designated area");
                } else if (status === "inside") {
                  toast.success("You have entered the designated area");
                }
              }
            }
            
            // Update user's last location in database if we have a user
            if (user?.id) {
              updateUserLocation(user.id, newLocation);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            
            // Fall back to simulation if permission denied or other error
            simulateLocationTracking();
          },
          {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
          }
        );
        
        setWatchId(geoWatchId);
      } else {
        // Fallback to simulation if geolocation not available
        simulateLocationTracking();
      }
      
      setIsTracking(true);
      toast.success("Location tracking started");
      console.log("Location tracking started");
    } catch (error) {
      console.error("Failed to start location tracking:", error);
      toast.error("Failed to start location tracking");
    }
  };

  // Simulate location tracking for demo purposes
  const simulateLocationTracking = () => {
    console.log("Using simulated location tracking");
    
    // Simulated tracking interval
    const simulationInterval = setInterval(() => {
      // Create small random movement
      const randomMovement = () => (Math.random() - 0.5) * 0.001; // ~100m in either direction
      
      setCurrentLocation(prev => {
        if (!prev) return {
          ...DEFAULT_LOCATION,
          timestamp: new Date().toISOString()
        };
        
        const newLocation = {
          latitude: prev.latitude + randomMovement(),
          longitude: prev.longitude + randomMovement(),
          timestamp: new Date().toISOString()
        };
        
        // Add to history
        setLocationHistory(history => {
          const updatedHistory = [...history, newLocation];
          
          // Save history to localStorage
          if (user?.id) {
            try {
              localStorage.setItem(
                `location_history_${user.id}`, 
                JSON.stringify(updatedHistory.slice(-100)) // Keep last 100 entries
              );
            } catch (error) {
              console.error("Failed to save location history:", error);
            }
          }
          
          return updatedHistory;
        });
        
        // Check geofence status if active
        if (geofence?.active) {
          const status = checkGeofenceStatus(newLocation);
          
          // Get previous status to detect transitions
          const prevStatus = checkGeofenceStatus(prev);
          
          // Notify on status change
          if (status !== prevStatus) {
            if (status === "outside") {
              toast.warning("Alert: You have left the designated area");
            } else if (status === "inside") {
              toast.success("You have entered the designated area");
            }
          }
        }
        
        // Update user's last location in database if we have a user
        if (user?.id) {
          updateUserLocation(user.id, newLocation);
        }
        
        return newLocation;
      });
    }, 10000); // Update every 10 seconds
    
    setWatchId(simulationInterval as unknown as number);
  };

  // Update user's last known location in database
  const updateUserLocation = async (userId: string, location: Location) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          last_location: {
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: location.timestamp
          }
        })
        .eq('id', userId);
      
      if (error) {
        console.error("Failed to update user location:", error);
      }
    } catch (error) {
      console.error("Error updating user location:", error);
    }
  };

  // Stop location tracking
  const stopTracking = () => {
    if (navigator.geolocation && typeof watchId === 'number' && watchId > 0) {
      navigator.geolocation.clearWatch(watchId);
    } else if (watchId !== null) {
      clearInterval(watchId as unknown as NodeJS.Timeout);
    }
    
    setWatchId(null);
    setIsTracking(false);
    toast.info("Location tracking stopped");
    console.log("Location tracking stopped");
  };

  // Clear location history
  const clearHistory = () => {
    setLocationHistory([]);
    
    // Clear from localStorage
    if (user?.id) {
      try {
        localStorage.removeItem(`location_history_${user.id}`);
      } catch (error) {
        console.error("Failed to clear location history:", error);
      }
    }
    
    toast.success("Location history cleared");
  };

  // Set geofence configuration
  const setGeofence = (config: GeofenceConfig | null) => {
    setGeofenceState(config);
    
    if (config?.active) {
      toast.success(`Geofence ${config.name ? `"${config.name}"` : ""} activated`);
    } else if (config === null) {
      toast.info("Geofence disabled");
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (navigator.geolocation && typeof watchId === 'number' && watchId > 0) {
        navigator.geolocation.clearWatch(watchId);
      } else if (watchId !== null) {
        clearInterval(watchId as unknown as NodeJS.Timeout);
      }
    };
  }, [watchId]);

  return (
    <LocationContext.Provider value={{
      currentLocation,
      isTracking,
      locationHistory,
      geofence,
      startTracking,
      stopTracking,
      clearHistory,
      setGeofence,
      checkGeofenceStatus
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
