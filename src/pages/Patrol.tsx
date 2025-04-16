
import { useEffect } from "react";
import { useLocation } from "@/contexts/LocationContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePatrol } from "@/hooks/usePatrol";
import EmergencyButton from "@/components/alerts/EmergencyButton";
import { formatDistanceToNow, parseISO } from "date-fns";
import ActivePatrolCard from "@/components/patrol/ActivePatrolCard";
import NewPatrolCard from "@/components/patrol/NewPatrolCard";
import PatrolTabs from "@/components/patrol/PatrolTabs";

export default function Patrol() {
  const { currentLocation, isTracking, startTracking, stopTracking } = useLocation();
  const { user } = useAuth();
  const { 
    activePatrol, 
    pastPatrols, 
    isLoading, 
    startPatrol, 
    endPatrol, 
    updatePatrolRoute 
  } = usePatrol();

  // Update patrol location when current location changes
  useEffect(() => {
    if (activePatrol && currentLocation) {
      updatePatrolRoute({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        timestamp: new Date().toISOString()
      });
    }
  }, [currentLocation, activePatrol]);

  const handleStartPatrol = async () => {
    startTracking();
    await startPatrol();
  };

  const handleEndPatrol = () => {
    endPatrol();
    stopTracking();
  };

  const calculateDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return 'Unknown';
    
    // Use the start time and compare to end time
    return formatDistanceToNow(parseISO(startTime), { 
      includeSeconds: true,
      addSuffix: false
    });
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
      {activePatrol ? (
        <ActivePatrolCard
          activePatrol={activePatrol}
          currentLocation={currentLocation}
          onEndPatrol={handleEndPatrol}
          isLoading={isLoading}
        />
      ) : (
        <NewPatrolCard
          onStartPatrol={handleStartPatrol}
          isLoading={isLoading}
        />
      )}

      {/* Patrol Tabs for Route Data and History */}
      <PatrolTabs 
        activePatrol={activePatrol} 
        pastPatrols={pastPatrols}
        calculateDuration={calculateDuration}
      />
      
      <EmergencyButton />
    </div>
  );
}
