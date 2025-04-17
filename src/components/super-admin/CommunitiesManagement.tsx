
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, ArrowUpRight, Shield, Users } from "lucide-react";

export default function CommunitiesManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for demonstration
  const communities = [
    { id: '1', name: 'Oakwood Heights', region: 'West', memberCount: 124, activeSecurity: 5, status: 'active', alerts: 1 },
    { id: '2', name: 'Riverside Gardens', region: 'East', memberCount: 87, activeSecurity: 3, status: 'active', alerts: 0 },
    { id: '3', name: 'Meadowlands Estate', region: 'North', memberCount: 56, activeSecurity: 2, status: 'inactive', alerts: 0 },
    { id: '4', name: 'Hillside Acres', region: 'South', memberCount: 102, activeSecurity: 4, status: 'active', alerts: 2 },
    { id: '5', name: 'Parkview Residences', region: 'Central', memberCount: 73, activeSecurity: 0, status: 'pending', alerts: 0 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Community Management</CardTitle>
          <CardDescription>
            View, approve, or manage all communities on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Community</span>
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Community Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Security</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Alerts</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communities.map(community => (
                  <TableRow key={community.id}>
                    <TableCell className="font-medium">{community.name}</TableCell>
                    <TableCell>{community.region}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span>{community.memberCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-muted-foreground" />
                        <span>{community.activeSecurity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        community.status === 'active' ? 'bg-green-50 text-green-700' :
                        community.status === 'inactive' ? 'bg-amber-50 text-amber-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {community.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {community.alerts > 0 ? (
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-red-50 text-red-700">
                          {community.alerts}
                        </span>
                      ) : (
                        '0'
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 flex items-center gap-1">
                        <span>View</span>
                        <ArrowUpRight className="h-3 w-3" />
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
