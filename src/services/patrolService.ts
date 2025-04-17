
import { supabase } from "@/integrations/supabase/client";
import { PatrolSession, User } from "@/types";

// Function to fetch the active patrol for a user
export const fetchActivePatrol = async (userId: string): Promise<PatrolSession | null> => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('patrol_sessions')
      .select('*')
      .eq('guard_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    
    return {
      id: data.id,
      guardId: data.guard_id,
      communityId: data.community_id,
      startTime: data.start_time,
      endTime: data.end_time,
      routeData: Array.isArray(data.route_data) 
        ? data.route_data as { latitude: number; longitude: number; timestamp: string }[] 
        : [],
      missedAwakeChecks: data.missed_awake_checks || 0,
      totalDistance: data.total_distance || 0,
      status: data.status as PatrolSession['status'],
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching active patrol:", error);
    throw error;
  }
};

// Function to fetch past patrols for a user
export const fetchPastPatrols = async (userId: string): Promise<PatrolSession[]> => {
  if (!userId) return [];
  
  try {
    const { data, error } = await supabase
      .from('patrol_sessions')
      .select('*')
      .eq('guard_id', userId)
      .in('status', ['completed', 'interrupted'])
      .order('end_time', { ascending: false })
      .limit(10);

    if (error) throw error;
    if (!data?.length) return [];
    
    return data.map(patrol => ({
      id: patrol.id,
      guardId: patrol.guard_id,
      communityId: patrol.community_id,
      startTime: patrol.start_time,
      endTime: patrol.end_time,
      routeData: Array.isArray(patrol.route_data) 
        ? patrol.route_data as { latitude: number; longitude: number; timestamp: string }[] 
        : [],
      missedAwakeChecks: patrol.missed_awake_checks || 0,
      totalDistance: patrol.total_distance || 0,
      status: patrol.status as PatrolSession['status'],
      createdAt: patrol.created_at || patrol.start_time, 
      updatedAt: patrol.updated_at || patrol.end_time || patrol.start_time
    }));
  } catch (error) {
    console.error("Error fetching past patrols:", error);
    throw error;
  }
};

// Function to create a new patrol
export const createPatrol = async (user: User): Promise<PatrolSession | null> => {
  if (!user?.id || !user?.communityId) return null;
  
  try {
    const now = new Date().toISOString();
    const newPatrol = {
      guard_id: user.id,
      community_id: user.communityId,
      status: 'active',
      route_data: [],
      missed_awake_checks: 0,
      total_distance: 0,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from('patrol_sessions')
      .insert(newPatrol)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      guardId: data.guard_id,
      guardName: user.fullName,
      communityId: data.community_id,
      startTime: data.start_time,
      endTime: data.end_time,
      routeData: Array.isArray(data.route_data) 
        ? data.route_data as { latitude: number; longitude: number; timestamp: string }[] 
        : [],
      missedAwakeChecks: data.missed_awake_checks || 0,
      totalDistance: data.total_distance || 0,
      status: data.status as PatrolSession['status'],
      createdAt: data.created_at || now,
      updatedAt: data.updated_at || now
    };
  } catch (error) {
    console.error("Error creating patrol:", error);
    throw error;
  }
};

// Function to update the patrol route with new location data
export const updatePatrolRoute = async (
  patrolId: string, 
  locationData: { latitude: number; longitude: number; timestamp: string }
): Promise<{ latitude: number; longitude: number; timestamp: string }[] | null> => {
  if (!patrolId) return null;
  
  try {
    // First get existing route data
    const { data: patrol, error: fetchError } = await supabase
      .from('patrol_sessions')
      .select('route_data')
      .eq('id', patrolId)
      .single();

    if (fetchError) throw fetchError;

    // Update with new location
    const updatedRouteData = [...(Array.isArray(patrol.route_data) ? patrol.route_data : []), locationData];
    
    const { error: updateError } = await supabase
      .from('patrol_sessions')
      .update({ 
        route_data: updatedRouteData,
        updated_at: new Date().toISOString()
      })
      .eq('id', patrolId);

    if (updateError) throw updateError;
    
    return updatedRouteData as { latitude: number; longitude: number; timestamp: string }[];
  } catch (error) {
    console.error("Error updating patrol route:", error);
    throw error;
  }
};

// Function to end an active patrol
export const completePatrol = async (patrolId: string): Promise<void> => {
  if (!patrolId) return;
  
  try {
    const { error } = await supabase
      .from('patrol_sessions')
      .update({
        status: 'completed',
        end_time: new Date().toISOString()
      })
      .eq('id', patrolId);

    if (error) throw error;
  } catch (error) {
    console.error("Error ending patrol:", error);
    throw error;
  }
};
