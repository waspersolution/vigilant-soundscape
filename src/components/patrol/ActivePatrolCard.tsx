
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PatrolSession } from "@/types";
import { formatDistanceToNow, format, parseISO } from "date-fns";
import { Calendar, Check, Clock, MapPin, Radio, StopCircle, User } from "lucide-react";

interface ActivePatrolCardProps {
  activePatrol: PatrolSession;
  currentLocation: { latitude: number; longitude: number } | null;
  onEndPatrol: () => void;
  isLoading: boolean;
}

export default function ActivePatrolCard({ 
  activePatrol, 
  currentLocation, 
  onEndPatrol, 
  isLoading 
}: ActivePatrolCardProps) {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Active Patrol</CardTitle>
            <CardDescription>Patrol in progress</CardDescription>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {formatDistanceToNow(parseISO(activePatrol.startTime), { addSuffix: false })}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>
              {currentLocation 
                ? `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}` 
                : "Waiting for location..."}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-green-500" />
            <span>Route points: {activePatrol.routeData?.length || 0} recorded</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Patrol guard: {activePatrol.guardName || "You"}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>Started: {format(parseISO(activePatrol.startTime), 'MMM d, h:mm a')}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Radio className="h-4 w-4 text-blue-500" />
            <span>Status: Actively patrolling</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={onEndPatrol}
          disabled={isLoading}
        >
          <StopCircle className="h-4 w-4 mr-2" />
          End Patrol
        </Button>
      </CardFooter>
    </Card>
  );
}
