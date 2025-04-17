
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Users, Building2, AlertCircle, Shield } from "lucide-react";

export default function SuperAdminOverview() {
  // In a real implementation, these would be fetched from the database
  const stats = {
    totalUsers: 523,
    totalCommunities: 15,
    activeAlerts: 3,
    activePatrols: 8
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Platform Overview</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Across all communities
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Communities</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCommunities}</div>
            <p className="text-xs text-muted-foreground">
              Active and inactive
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive">2 high priority</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patrols</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePatrols}</div>
            <p className="text-xs text-muted-foreground">
              Across 5 communities
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>
              Latest distress signals across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Emergency Alert</p>
                  <p className="text-sm text-muted-foreground">Oakwood Heights • 25 min ago</p>
                </div>
                <a href="#" className="flex items-center text-sm text-blue-500">
                  View <ArrowUpRight className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Panic Button</p>
                  <p className="text-sm text-muted-foreground">Riverside Gardens • 1 hour ago</p>
                </div>
                <a href="#" className="flex items-center text-sm text-blue-500">
                  View <ArrowUpRight className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Patrol Stop Alert</p>
                  <p className="text-sm text-muted-foreground">Meadowlands Estate • 3 hours ago</p>
                </div>
                <a href="#" className="flex items-center text-sm text-blue-500">
                  View <ArrowUpRight className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
            <CardDescription>
              Latest community and user registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Community: Hillside Acres</p>
                  <p className="text-sm text-muted-foreground">Created by John Doe • 2 days ago</p>
                </div>
                <a href="#" className="flex items-center text-sm text-blue-500">
                  View <ArrowUpRight className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Admin: Jane Smith</p>
                  <p className="text-sm text-muted-foreground">Joined Oakwood Heights • 3 days ago</p>
                </div>
                <a href="#" className="flex items-center text-sm text-blue-500">
                  View <ArrowUpRight className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">10 New Members</p>
                  <p className="text-sm text-muted-foreground">Joined various communities • This week</p>
                </div>
                <a href="#" className="flex items-center text-sm text-blue-500">
                  View <ArrowUpRight className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
