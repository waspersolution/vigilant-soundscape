
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PatrolSession } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchActivePatrol, 
  fetchPastPatrols, 
  createPatrol, 
  updatePatrolRoute, 
  completePatrol 
} from "@/services/patrolService";
import { createCompletedPatrol } from "@/utils/patrolUtils";

export function usePatrol() {
  const [activePatrol, setActivePatrol] = useState<PatrolSession | null>(null);
  const [pastPatrols, setPastPatrols] = useState<PatrolSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch patrol data on component mount
  useEffect(() => {
    if (user) {
      fetchPatrolData();
    }
  }, [user]);

  // Fetch patrol data from Supabase
  const fetchPatrolData = async () => {
    if (!user?.id || !user?.communityId) return;
    
    setIsLoading(true);
    try {
      // Fetch active patrol
      const activeData = await fetchActivePatrol(user.id);
      if (activeData) {
        setActivePatrol({
          ...activeData,
          guardName: user.fullName || 'Unknown' // Add fallback value in case fullName is undefined
        });
      } else {
        setActivePatrol(null);
      }

      // Fetch past patrols
      const pastData = await fetchPastPatrols(user.id);
      if (pastData.length > 0) {
        setPastPatrols(pastData.map(patrol => ({
          ...patrol,
          guardName: user.fullName || 'Unknown' // Add fallback value in case fullName is undefined
        })));
      }
    } catch (error) {
      console.error("Error fetching patrol data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch patrol data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new patrol
  const startPatrol = async () => {
    if (!user?.id || !user?.communityId) {
      toast({
        title: "Error",
        description: "User must be logged in and assigned to a community",
        variant: "destructive",
      });
      return null;
    }

    if (activePatrol) {
      toast({
        title: "Patrol Already Active",
        description: "You already have an active patrol. Please end it before starting a new one.",
        variant: "destructive",
      });
      return activePatrol;
    }

    setIsLoading(true);
    try {
      // Make sure the user object has all the required properties for the User type
      const userForPatrol = {
        id: user.id,
        fullName: user.fullName || 'Unknown', // Add fallback value in case fullName is undefined
        email: user.email || '',
        role: user.role || 'member',
        communityId: user.communityId || '',
        onlineStatus: user.onlineStatus || false,
        lastLocation: user.lastLocation
      };
      
      const createdPatrol = await createPatrol(userForPatrol);
      if (createdPatrol) {
        setActivePatrol(createdPatrol);
        
        toast({
          title: "Patrol Started",
          description: "Your patrol has been started successfully",
        });
      }
      
      return createdPatrol;
    } catch (error) {
      console.error("Error starting patrol:", error);
      toast({
        title: "Error",
        description: "Failed to start patrol. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update patrol route data
  const handleUpdatePatrolRoute = async (locationData: { latitude: number; longitude: number; timestamp: string }) => {
    if (!activePatrol?.id || !user?.id) return;

    try {
      const updatedRouteData = await updatePatrolRoute(activePatrol.id, locationData);
      
      if (updatedRouteData) {
        // Update local state
        setActivePatrol(prev => {
          if (!prev) return null;
          return {
            ...prev,
            routeData: updatedRouteData
          };
        });
      }
    } catch (error) {
      console.error("Error updating patrol route:", error);
    }
  };

  // End the active patrol
  const endPatrol = async () => {
    if (!activePatrol?.id) {
      toast({
        title: "No Active Patrol",
        description: "There is no active patrol to end",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await completePatrol(activePatrol.id);
      
      // Update local state
      const endedPatrol = createCompletedPatrol(activePatrol);
      
      setActivePatrol(null);
      setPastPatrols(prev => [endedPatrol, ...prev]);
      
      toast({
        title: "Patrol Ended",
        description: "Your patrol has been completed successfully",
      });
    } catch (error) {
      console.error("Error ending patrol:", error);
      toast({
        title: "Error",
        description: "Failed to end patrol. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activePatrol,
    pastPatrols,
    isLoading,
    startPatrol,
    endPatrol,
    updatePatrolRoute: handleUpdatePatrolRoute,
    fetchPatrolData
  };
}
