
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, PlayCircle, Radio } from "lucide-react";

interface NewPatrolCardProps {
  onStartPatrol: () => void;
  isLoading: boolean;
}

export default function NewPatrolCard({ onStartPatrol, isLoading }: NewPatrolCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Start New Patrol</CardTitle>
        <CardDescription>Begin tracking your security patrol route</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Starting a patrol will track your location and monitor your route. Your patrol data
          will be recorded and available to community members.
        </p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Your location will be tracked and logged</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Your patrol's duration and route will be recorded</span>
          </div>
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-muted-foreground" />
            <span>Community members can view active patrols</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={onStartPatrol}
          disabled={isLoading}
        >
          <PlayCircle className="h-4 w-4 mr-2" />
          Start Patrol
        </Button>
      </CardFooter>
    </Card>
  );
}
