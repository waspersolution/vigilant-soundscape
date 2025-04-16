
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchUserCommunities, 
  createCommunity, 
  fetchCommunityMembers, 
  inviteMember,
  updateMemberRole,
  removeMember
} from "@/services/communityService";
import { Community, User } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database } from "@/integrations/supabase/types";
import { Shield, User as UserIcon, Mail, MoreHorizontal, Plus, Users, UserPlus } from "lucide-react";

type UserRole = Database["public"]["Enums"]["user_role"];

const CommunityPage = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadCommunities();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCommunity) {
      loadCommunityMembers();
    }
  }, [selectedCommunity]);

  const loadCommunities = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    const data = await fetchUserCommunities(user.id);
    setCommunities(data);
    
    // Auto-select the first community
    if (data.length > 0 && !selectedCommunity) {
      setSelectedCommunity(data[0]);
    }
    
    setLoading(false);
  };

  const loadCommunityMembers = async () => {
    if (!selectedCommunity) return;
    
    setLoading(true);
    const data = await fetchCommunityMembers(selectedCommunity.id);
    setMembers(data);
    setLoading(false);
  };

  const handleCreateCommunity = async () => {
    if (!user?.id || !newCommunityName.trim()) return;
    
    setLoading(true);
    const newCommunity = await createCommunity(newCommunityName, user.id);
    
    if (newCommunity) {
      setCommunities([...communities, newCommunity]);
      setSelectedCommunity(newCommunity);
      setNewCommunityName("");
      setCreateDialogOpen(false);
    }
    
    setLoading(false);
  };

  const handleInviteMember = async () => {
    if (!selectedCommunity || !newMemberEmail.trim()) return;
    
    setLoading(true);
    const success = await inviteMember(newMemberEmail, selectedCommunity.id);
    
    if (success) {
      setNewMemberEmail("");
      setInviteDialogOpen(false);
      // Refresh member list
      await loadCommunityMembers();
    }
    
    setLoading(false);
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    setLoading(true);
    const success = await updateMemberRole(userId, newRole);
    
    if (success) {
      // Update local state
      setMembers(members.map(member => 
        member.id === userId ? {...member, role: newRole} : member
      ));
    }
    
    setLoading(false);
  };

  const handleRemoveMember = async (userId: string) => {
    setLoading(true);
    const success = await removeMember(userId);
    
    if (success) {
      // Remove from local state
      setMembers(members.filter(member => member.id !== userId));
    }
    
    setLoading(false);
  };

  const isUserCommunityLeader = selectedCommunity?.leaderId === user?.id;

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Community Management</h1>
        <p className="text-muted-foreground">
          Create and manage your communities, members, and their roles
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Communities List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Your Communities</CardTitle>
              <CardDescription>Communities you are a part of</CardDescription>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Community
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Community</DialogTitle>
                  <DialogDescription>
                    Create a new community that you'll manage. You'll be assigned as the leader.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="name">Community Name</label>
                    <Input
                      id="name"
                      value={newCommunityName}
                      onChange={(e) => setNewCommunityName(e.target.value)}
                      placeholder="Enter community name..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleCreateCommunity} 
                    disabled={loading || !newCommunityName.trim()}
                  >
                    {loading ? "Creating..." : "Create Community"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading && communities.length === 0 ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : communities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center space-y-3">
                <Users className="h-12 w-12 text-muted-foreground/50" />
                <div>
                  <p>No communities found</p>
                  <p className="text-sm text-muted-foreground">Get started by creating your first community</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {communities.map((community) => (
                  <div
                    key={community.id}
                    className={`p-3 rounded-md border cursor-pointer transition-colors
                      ${selectedCommunity?.id === community.id 
                        ? 'bg-primary/10 border-primary/30' 
                        : 'hover:bg-secondary/50'}`}
                    onClick={() => setSelectedCommunity(community)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{community.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {community.leaderId === user?.id ? 'Leader' : 'Member'}
                        </p>
                      </div>
                      {community.leaderId === user?.id && (
                        <Shield className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Community Management */}
        {selectedCommunity ? (
          <Card>
            <CardHeader>
              <CardTitle>{selectedCommunity.name}</CardTitle>
              <CardDescription>
                Manage community settings and members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="members">
                <TabsList className="mb-4">
                  <TabsTrigger value="members">Members</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="members">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">Community Members</h3>
                    {isUserCommunityLeader && (
                      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Invite New Member</DialogTitle>
                            <DialogDescription>
                              Send an invitation to join your community
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <label htmlFor="email">Email Address</label>
                              <Input
                                id="email"
                                type="email"
                                value={newMemberEmail}
                                onChange={(e) => setNewMemberEmail(e.target.value)}
                                placeholder="Enter email address..."
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              onClick={handleInviteMember} 
                              disabled={loading || !newMemberEmail.trim()}
                            >
                              {loading ? "Sending..." : "Send Invitation"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  
                  {loading && members.length === 0 ? (
                    <div className="flex items-center justify-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : members.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center space-y-3">
                      <Users className="h-12 w-12 text-muted-foreground/50" />
                      <div>
                        <p>No members found</p>
                        <p className="text-sm text-muted-foreground">Invite members to join your community</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            {isUserCommunityLeader && <TableHead className="w-16"></TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {members.map((member) => (
                            <TableRow key={member.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{member.fullName}</p>
                                  <p className="text-xs text-muted-foreground">{member.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {member.role === 'community_leader' ? (
                                    <div className="flex items-center gap-1">
                                      <Shield className="h-3 w-3 text-primary" />
                                      <span>Leader</span>
                                    </div>
                                  ) : member.role === 'security_personnel' ? (
                                    <div className="flex items-center gap-1">
                                      <Shield className="h-3 w-3 text-blue-500" />
                                      <span>Security</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      <UserIcon className="h-3 w-3 text-gray-500" />
                                      <span>Member</span>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              {isUserCommunityLeader && (
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        onClick={() => handleUpdateRole(member.id, 'security_personnel')}
                                        disabled={member.role === 'community_leader'} // Don't allow changing the leader's role
                                      >
                                        Make Security Guard
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleUpdateRole(member.id, 'member')}
                                        disabled={member.role === 'community_leader'} // Don't allow changing the leader's role
                                      >
                                        Make Regular Member
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => handleRemoveMember(member.id)}
                                        disabled={member.id === user?.id} // Don't allow removing self
                                      >
                                        Remove from Community
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="settings">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <label htmlFor="community-name" className="text-sm font-medium">Community Name</label>
                      <Input 
                        id="community-name"
                        value={selectedCommunity.name}
                        disabled={!isUserCommunityLeader}
                        readOnly
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Subscription Plan</label>
                      <Input 
                        value={selectedCommunity.subscriptionPlan || 'basic'}
                        disabled
                        readOnly
                      />
                      <p className="text-xs text-muted-foreground">
                        Your community is on the {selectedCommunity.subscriptionPlan || 'basic'} plan
                      </p>
                    </div>
                    
                    {isUserCommunityLeader && (
                      <Button className="w-full mt-4" variant="outline" disabled>
                        Update Community Settings
                      </Button>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
              <Users className="h-16 w-16 text-muted-foreground/40" />
              <div>
                <h3 className="text-lg font-medium">No Community Selected</h3>
                <p className="text-sm text-muted-foreground">
                  Select a community from the list or create a new one to get started
                </p>
              </div>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Community
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Community</DialogTitle>
                    <DialogDescription>
                      Create a new community that you'll manage. You'll be assigned as the leader.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="name">Community Name</label>
                      <Input
                        id="name"
                        value={newCommunityName}
                        onChange={(e) => setNewCommunityName(e.target.value)}
                        placeholder="Enter community name..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleCreateCommunity} 
                      disabled={loading || !newCommunityName.trim()}
                    >
                      {loading ? "Creating..." : "Create Community"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
