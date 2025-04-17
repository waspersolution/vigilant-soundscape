
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, MoreHorizontal } from "lucide-react";

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [communityFilter, setCommunityFilter] = useState('all');
  
  // Mock data for demonstration
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', community: 'Oakwood Heights', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'community_leader', community: 'Riverside Gardens', status: 'active' },
    { id: '3', name: 'Robert Johnson', email: 'robert@example.com', role: 'security_personnel', community: 'Meadowlands Estate', status: 'inactive' },
    { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'member', community: 'Oakwood Heights', status: 'active' },
    { id: '5', name: 'Michael Brown', email: 'michael@example.com', role: 'community_manager', community: 'Hillside Acres', status: 'active' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View, create, or manage users across all communities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="w-[180px]">
                <Label htmlFor="role-filter" className="sr-only">Filter by role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger id="role-filter">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="community_leader">Community Leader</SelectItem>
                    <SelectItem value="community_manager">Community Manager</SelectItem>
                    <SelectItem value="security_personnel">Security Personnel</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-[180px]">
                <Label htmlFor="community-filter" className="sr-only">Filter by community</Label>
                <Select value={communityFilter} onValueChange={setCommunityFilter}>
                  <SelectTrigger id="community-filter">
                    <SelectValue placeholder="Filter by community" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Communities</SelectItem>
                    <SelectItem value="oakwood">Oakwood Heights</SelectItem>
                    <SelectItem value="riverside">Riverside Gardens</SelectItem>
                    <SelectItem value="meadowlands">Meadowlands Estate</SelectItem>
                    <SelectItem value="hillside">Hillside Acres</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Add User</span>
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className="capitalize">{user.role.replace(/_/g, ' ')}</span>
                    </TableCell>
                    <TableCell>{user.community}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
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
