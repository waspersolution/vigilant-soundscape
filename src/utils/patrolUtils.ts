
import { formatDistanceToNow } from "date-fns";
import { PatrolSession } from "@/types";

// Utility function to create a completed patrol record
export const createCompletedPatrol = (
  activePatrol: PatrolSession
): PatrolSession => {
  const now = new Date().toISOString();
  
  return {
    ...activePatrol,
    endTime: now,
    status: "completed",
    updatedAt: now
  };
};

// Calculate duration for a patrol session
export const calculatePatrolDuration = (
  startTime: string,
  endTime?: string | null
): string => {
  if (!endTime) {
    return formatDistanceToNow(new Date(startTime), { addSuffix: false });
  }
  
  // Calculate time between start and end
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  
  // Convert to hours and minutes
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes} minutes`;
};
