
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// In a real app, this would come from your API/database
const mockMembers = [
  { 
    id: "member-1", 
    name: "John Smith", 
    role: "patrol_guard", 
    status: "active", 
    lastSeen: "2 min ago",
    location: "Main Gate"
  },
  { 
    id: "member-2", 
    name: "Maria Garcia", 
    role: "patrol_guard", 
    status: "active", 
    lastSeen: "5 min ago",
    location: "West Perimeter"
  },
  { 
    id: "member-3", 
    name: "Robert Johnson", 
    role: "community_leader", 
    status: "inactive", 
    lastSeen: "1 hour ago",
    location: null
  },
  { 
    id: "member-4", 
    name: "Sarah Wilson", 
    role: "member", 
    status: "active", 
    lastSeen: "15 min ago",
    location: "Community Center"
  },
  { 
    id: "member-5", 
    name: "David Chang", 
    role: "patrol_guard", 
    status: "inactive", 
    lastSeen: "3 hours ago",
    location: null
  }
];

export default function MemberStatusList() {
  const activeMembers = mockMembers.filter(member => member.status === "active");
  
  return (
    <Card className="h-[400px]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">Community Members</CardTitle>
            <CardDescription>Current status and locations</CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-50">
            {activeMembers.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[310px] pr-4">
          <div className="space-y-4">
            {mockMembers.map(member => (
              <div 
                key={member.id} 
                className={cn(
                  "p-3 rounded-md border flex justify-between items-start",
                  member.status === "active" ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-muted/30"
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{member.name}</h4>
                    {member.role === "patrol_guard" && (
                      <Badge variant="secondary" className="text-xs">Guard</Badge>
                    )}
                    {member.role === "community_leader" && (
                      <Badge variant="secondary" className="bg-blue-100 text-xs">Leader</Badge>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Last seen {member.lastSeen}</span>
                  </div>
                  {member.location && (
                    <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{member.location}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Badge 
                    variant={member.status === "active" ? "default" : "outline"}
                    className={cn(
                      "capitalize",
                      member.status === "active" ? "bg-green-500" : "text-muted-foreground"
                    )}
                  >
                    {member.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
