
import { useState, useEffect } from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { PatrolSession } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { MapPin, User, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivePatrolsList() {
  const [activePatrols, setActivePatrols] = useState<PatrolSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.communityId) {
      fetchActivePatrols();
    }
  }, [user]);

  const fetchActivePatrols = async () => {
    if (!user?.communityId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('patrol_sessions')
        .select(`
          id,
          guard_id,
          community_id,
          start_time,
          status,
          profiles(full_name)
        `)
        .eq('community_id', user.communityId)
        .eq('status', 'active');

      if (error) throw error;

      if (data) {
        const formattedPatrols: PatrolSession[] = data.map(patrol => ({
          id: patrol.id,
          guardId: patrol.guard_id,
          guardName: patrol.profiles?.full_name || 'Unknown',
          communityId: patrol.community_id,
          startTime: patrol.start_time,
          status: patrol.status as PatrolSession['status'],
          routeData: [],
        }));
        
        setActivePatrols(formattedPatrols);
      }
    } catch (error) {
      console.error("Error fetching active patrols:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="h-[100px] w-full" />
      </div>
    );
  }

  if (activePatrols.length === 0) {
    return (
      <div className="rounded-md border bg-muted/30 p-8 text-center">
        <User className="h-10 w-10 text-muted-foreground mb-2 mx-auto" />
        <p className="text-sm font-medium">No active patrols</p>
        <p className="text-sm text-muted-foreground mt-1">
          All patrol guards are currently off-duty
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/patrol">
            View Patrol Schedule
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activePatrols.map(patrol => (
        <Card key={patrol.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{patrol.guardName}</h3>
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                  Active
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Started:</span>
                </div>
                <div>{format(parseISO(patrol.startTime), 'h:mm a')}</div>
                
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Duration:</span>
                </div>
                <div>{formatDistanceToNow(parseISO(patrol.startTime))}</div>
              </div>
            </div>
            
            <div className="border-t px-4 py-2 bg-muted/30 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(parseISO(patrol.startTime), { addSuffix: true })}
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/patrol">
                  Details
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
