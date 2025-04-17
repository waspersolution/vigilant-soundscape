
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle, Eye, Volume2 } from "lucide-react";

export default function AlertsMonitoring() {
  // Mock data for alerts
  const alerts = [
    { id: '1', type: 'panic', community: 'Oakwood Heights', user: 'John Smith', timestamp: '2023-05-15 14:32', location: '7.456, 3.982', priority: 'high', audio: true },
    { id: '2', type: 'emergency', community: 'Riverside Gardens', user: 'Mary Johnson', timestamp: '2023-05-14 08:17', location: '7.459, 3.986', priority: 'high', audio: false },
    { id: '3', type: 'patrol_stop', community: 'Meadowlands Estate', user: 'Robert Davis', timestamp: '2023-05-13 23:45', location: '7.462, 3.979', priority: 'medium', audio: true },
    { id: '4', type: 'system', community: 'Hillside Acres', user: 'System', timestamp: '2023-05-12 16:21', location: 'N/A', priority: 'low', audio: false },
    { id: '5', type: 'panic', community: 'Parkview Residences', user: 'Sarah Williams', timestamp: '2023-05-11 11:03', location: '7.448, 3.965', priority: 'high', audio: true },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Distress Alert Monitoring</CardTitle>
          <CardDescription>
            Monitor all distress signals and alerts across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert Type</TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Audio</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map(alert => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AlertCircle className={`h-4 w-4 ${
                          alert.priority === 'high' ? 'text-red-500' :
                          alert.priority === 'medium' ? 'text-amber-500' :
                          'text-blue-500'
                        }`} />
                        <span className="capitalize">{alert.type.replace(/_/g, ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>{alert.community}</TableCell>
                    <TableCell>{alert.user}</TableCell>
                    <TableCell>{alert.timestamp}</TableCell>
                    <TableCell>{alert.location}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        alert.priority === 'high' ? 'bg-red-50 text-red-700' :
                        alert.priority === 'medium' ? 'bg-amber-50 text-amber-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {alert.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      {alert.audio ? (
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="h-8">
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
