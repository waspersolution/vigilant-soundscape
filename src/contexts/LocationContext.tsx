
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
}

interface LocationContextType {
  currentLocation: Location | null;
  isTracking: boolean;
  locationHistory: Location[];
  startTracking: () => void;
  stopTracking: () => void;
  clearHistory: () => void;
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

  const startTracking = () => {
    if (!isAuthenticated || isTracking) return;
    
    try {
      // For demo, we'll simulate location updates
      // In a real app, this would use the Geolocation API
      
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
          setLocationHistory(history => [...history, newLocation]);
          
          return newLocation;
        });
      }, 10000); // Update every 10 seconds
      
      setWatchId(simulationInterval as unknown as number);
      setIsTracking(true);
      
      console.log("Location tracking started (simulated)");
    } catch (error) {
      console.error("Failed to start location tracking:", error);
    }
  };

  const stopTracking = () => {
    if (watchId !== null) {
      clearInterval(watchId as unknown as NodeJS.Timeout);
      setWatchId(null);
      setIsTracking(false);
      console.log("Location tracking stopped");
    }
  };

  const clearHistory = () => {
    setLocationHistory([]);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        clearInterval(watchId as unknown as NodeJS.Timeout);
      }
    };
  }, [watchId]);

  return (
    <LocationContext.Provider value={{
      currentLocation,
      isTracking,
      locationHistory,
      startTracking,
      stopTracking,
      clearHistory
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
