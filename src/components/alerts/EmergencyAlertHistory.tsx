
import { useState } from "react";
import { useAlert } from "@/contexts/AlertContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, MoreVertical, Phone, AlertTriangle, Siren, Radio } from "lucide-react";
import { Alert } from "@/types";

export default function EmergencyAlertHistory() {
  const { alerts } = useAlert();
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Only community leaders or admins can see this
  const isAuthorized = ["community_leader", "admin", "community_manager"].includes(user?.role || "");

  if (!isAuthorized) {
    return null;
  }

  // Filter alerts by user if selected
  const filteredAlerts = selectedUser 
    ? alerts.filter(alert => alert.senderId === selectedUser)
    : alerts;

  // Get unique users who have sent alerts
  const uniqueUsers = Array.from(new Set(alerts.map(alert => alert.senderId)))
    .map(userId => {
      const alert = alerts.find(a => a.senderId === userId);
      return {
        id: userId,
        name: alert?.senderName || "Unknown User"
      };
    });

  // Get alert type icon
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'panic':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'emergency':
        return <Siren className="h-4 w-4 text-amber-500" />;
      case 'patrol_stop':
        return <Radio className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };
  
  // Get alert status badge
  const getStatusBadge = (alert: Alert) => {
    if (alert.resolved) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
    }
    
    switch (alert.priority) {
      case 1:
        return <Badge variant="destructive">Critical</Badge>;
      case 2:
        return <Badge variant="default" className="bg-amber-500">High</Badge>;
      case 3:
        return <Badge variant="default" className="bg-yellow-500">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Emergency Alert History</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {selectedUser ? 
                  uniqueUsers.find(u => u.id === selectedUser)?.name || "Filter by User" : 
                  "Filter by User"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedUser(null)}>
                All Users
              </DropdownMenuItem>
              {uniqueUsers.map(user => (
                <DropdownMenuItem 
                  key={user.id}
                  onClick={() => setSelectedUser(user.id)}
                >
                  {user.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
        <CardDescription>
          Review emergency alerts history {selectedUser ? 'for selected user' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contacts Notified</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No alerts found
                </TableCell>
              </TableRow>
            ) : (
              filteredAlerts.map(alert => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getAlertIcon(alert.type)}
                      <span className="capitalize">{alert.type.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>{alert.senderName}</TableCell>
                  <TableCell>{new Date(alert.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(alert)}</TableCell>
                  <TableCell>
                    {alert.notifiedContacts?.length ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {alert.notifiedContacts.length} contacts
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {alert.location && (
                          <DropdownMenuItem className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>View Location</span>
                          </DropdownMenuItem>
                        )}
                        {alert.notifiedContacts && alert.notifiedContacts.length > 0 && (
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>View Contacts</span>
                          </DropdownMenuItem>
                        )}
                        {!alert.resolved && (
                          <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Mark as Abuse</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
