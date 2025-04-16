
import { PatrolSession } from "@/types";

/**
 * Creates a completed patrol object from an active patrol
 */
export const createCompletedPatrol = (activePatrol: PatrolSession): PatrolSession => {
  if (!activePatrol) return null;
  
  return {
    ...activePatrol,
    status: 'completed' as const,
    endTime: new Date().toISOString()
  };
};
