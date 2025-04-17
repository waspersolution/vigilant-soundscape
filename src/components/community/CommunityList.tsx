
import { useState } from "react";
import { Community } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Shield } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CommunityListProps {
  communities: Community[];
  selectedCommunity: Community | null;
  loading: boolean;
  onSelectCommunity: (community: Community) => void;
  onCreateCommunity: () => void;
  newCommunityName: string;
  onNewCommunityNameChange: (name: string) => void;
  createDialogOpen: boolean;
  onCreateDialogOpenChange: (open: boolean) => void;
  user: { id: string } | null;
}

export default function CommunityList({
  communities,
  selectedCommunity,
  loading,
  onSelectCommunity,
  onCreateCommunity,
  newCommunityName,
  onNewCommunityNameChange,
  createDialogOpen,
  onCreateDialogOpenChange,
  user
}: CommunityListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Your Communities</CardTitle>
          <CardDescription>Communities you are a part of</CardDescription>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={onCreateDialogOpenChange}>
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
                  onChange={(e) => onNewCommunityNameChange(e.target.value)}
                  placeholder="Enter community name..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={onCreateCommunity} 
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
                onClick={() => onSelectCommunity(community)}
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
  );
}
