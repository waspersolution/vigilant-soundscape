
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PatrolSession } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      // First, check for an active patrol for the current user
      const { data: activeData, error: activeError } = await supabase
        .from('patrol_sessions')
        .select('*')
        .eq('guard_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (activeError) throw activeError;
      
      if (activeData) {
        setActivePatrol({
          id: activeData.id,
          guardId: activeData.guard_id,
          guardName: user.fullName,
          communityId: activeData.community_id,
          startTime: activeData.start_time,
          endTime: activeData.end_time,
          routeData: activeData.route_data || [],
          missedAwakeChecks: activeData.missed_awake_checks || 0,
          totalDistance: activeData.total_distance || 0,
          status: activeData.status as PatrolSession['status'],
        });
      } else {
        setActivePatrol(null);
      }

      // Then, fetch past patrols
      const { data: pastData, error: pastError } = await supabase
        .from('patrol_sessions')
        .select('*')
        .eq('guard_id', user.id)
        .in('status', ['completed', 'interrupted'])
        .order('end_time', { ascending: false })
        .limit(10);

      if (pastError) throw pastError;
      
      if (pastData) {
        setPastPatrols(pastData.map(patrol => ({
          id: patrol.id,
          guardId: patrol.guard_id,
          guardName: user.fullName,
          communityId: patrol.community_id,
          startTime: patrol.start_time,
          endTime: patrol.end_time,
          routeData: patrol.route_data || [],
          missedAwakeChecks: patrol.missed_awake_checks || 0,
          totalDistance: patrol.total_distance || 0,
          status: patrol.status as PatrolSession['status'],
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
      const newPatrol = {
        guard_id: user.id,
        community_id: user.communityId,
        status: 'active',
        route_data: [],
        missed_awake_checks: 0,
        total_distance: 0,
      };

      const { data, error } = await supabase
        .from('patrol_sessions')
        .insert(newPatrol)
        .select()
        .single();

      if (error) throw error;

      const createdPatrol: PatrolSession = {
        id: data.id,
        guardId: data.guard_id,
        guardName: user.fullName,
        communityId: data.community_id,
        startTime: data.start_time,
        endTime: data.end_time,
        routeData: data.route_data || [],
        missedAwakeChecks: data.missed_awake_checks || 0,
        totalDistance: data.total_distance || 0,
        status: data.status as PatrolSession['status'],
      };

      setActivePatrol(createdPatrol);
      
      toast({
        title: "Patrol Started",
        description: "Your patrol has been started successfully",
      });
      
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
  const updatePatrolRoute = async (locationData: { latitude: number; longitude: number; timestamp: string }) => {
    if (!activePatrol?.id || !user?.id) return;

    try {
      // First get existing route data
      const { data: patrol, error: fetchError } = await supabase
        .from('patrol_sessions')
        .select('route_data')
        .eq('id', activePatrol.id)
        .single();

      if (fetchError) throw fetchError;

      // Update with new location
      const updatedRouteData = [...(patrol.route_data || []), locationData];
      
      const { error: updateError } = await supabase
        .from('patrol_sessions')
        .update({ 
          route_data: updatedRouteData,
          updated_at: new Date().toISOString()
        })
        .eq('id', activePatrol.id);

      if (updateError) throw updateError;

      // Update local state
      setActivePatrol(prev => {
        if (!prev) return null;
        return {
          ...prev,
          routeData: [...(prev.routeData || []), locationData]
        };
      });
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
      const { error } = await supabase
        .from('patrol_sessions')
        .update({
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('id', activePatrol.id);

      if (error) throw error;

      // Update local state
      const endedPatrol = {
        ...activePatrol,
        status: 'completed' as const,
        endTime: new Date().toISOString()
      };
      
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
    updatePatrolRoute,
    fetchPatrolData
  };
}
