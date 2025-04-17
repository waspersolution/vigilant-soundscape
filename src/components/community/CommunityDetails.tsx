
import { useState } from "react";
import { Community, User } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MembersTable from "./MembersTable";
import MembersEmptyState from "./MembersEmptyState";
import InviteMemberDialog from "./InviteMemberDialog";
import { Database } from "@/integrations/supabase/types";
import { Users } from "lucide-react";

type UserRole = Database["public"]["Enums"]["user_role"];

interface CommunityDetailsProps {
  community: Community;
  members: User[];
  loading: boolean;
  currentUserId: string | undefined;
  onUpdateRole: (userId: string, newRole: UserRole) => Promise<void>;
  onRemoveMember: (userId: string) => Promise<void>;
  onInviteMember: () => Promise<void>;
  newMemberEmail: string;
  onNewMemberEmailChange: (email: string) => void;
  inviteDialogOpen: boolean;
  onInviteDialogOpenChange: (open: boolean) => void;
}

export default function CommunityDetails({
  community,
  members,
  loading,
  currentUserId,
  onUpdateRole,
  onRemoveMember,
  onInviteMember,
  newMemberEmail,
  onNewMemberEmailChange,
  inviteDialogOpen,
  onInviteDialogOpenChange
}: CommunityDetailsProps) {
  const isUserCommunityLeader = community?.leaderId === currentUserId;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{community.name}</CardTitle>
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
                <InviteMemberDialog
                  open={inviteDialogOpen}
                  onOpenChange={onInviteDialogOpenChange}
                  email={newMemberEmail}
                  onEmailChange={onNewMemberEmailChange}
                  onInvite={onInviteMember}
                  loading={loading}
                />
              )}
            </div>
            
            {loading && members.length === 0 ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : members.length === 0 ? (
              <MembersEmptyState />
            ) : (
              <MembersTable
                members={members}
                currentUserId={currentUserId || ""}
                isLeader={isUserCommunityLeader}
                onUpdateRole={onUpdateRole}
                onRemoveMember={onRemoveMember}
              />
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="community-name" className="text-sm font-medium">Community Name</label>
                <Input 
                  id="community-name"
                  value={community.name}
                  disabled={!isUserCommunityLeader}
                  readOnly
                />
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Subscription Plan</label>
                <Input 
                  value={community.subscriptionPlan || 'basic'}
                  disabled
                  readOnly
                />
                <p className="text-xs text-muted-foreground">
                  Your community is on the {community.subscriptionPlan || 'basic'} plan
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
  );
}
