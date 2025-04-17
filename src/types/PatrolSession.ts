
// PatrolSession type for patrol management
export interface PatrolSession {
  id: string;
  guardId: string;
  guardName?: string;
  communityId: string;
  startTime: string;
  endTime?: string | null;
  status?: string;
  totalDistance?: number;
  routeData?: any;
  missedAwakeChecks?: number;
  createdAt: string;
  updatedAt: string;
}
