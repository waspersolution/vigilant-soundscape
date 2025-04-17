
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
import CommunityList from "@/components/community/CommunityList";
import CommunityDetails from "@/components/community/CommunityDetails";
import EmptyCommunityState from "@/components/community/EmptyCommunityState";
import { Database } from "@/integrations/supabase/types";

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
        <CommunityList
          communities={communities}
          selectedCommunity={selectedCommunity}
          loading={loading}
          onSelectCommunity={setSelectedCommunity}
          onCreateCommunity={handleCreateCommunity}
          newCommunityName={newCommunityName}
          onNewCommunityNameChange={setNewCommunityName}
          createDialogOpen={createDialogOpen}
          onCreateDialogOpenChange={setCreateDialogOpen}
          user={user}
        />

        {/* Community Management */}
        {selectedCommunity ? (
          <CommunityDetails
            community={selectedCommunity}
            members={members}
            loading={loading}
            currentUserId={user?.id}
            onUpdateRole={handleUpdateRole}
            onRemoveMember={handleRemoveMember}
            onInviteMember={handleInviteMember}
            newMemberEmail={newMemberEmail}
            onNewMemberEmailChange={setNewMemberEmail}
            inviteDialogOpen={inviteDialogOpen}
            onInviteDialogOpenChange={setInviteDialogOpen}
          />
        ) : (
          <EmptyCommunityState
            createDialogOpen={createDialogOpen}
            onCreateDialogOpenChange={setCreateDialogOpen}
            newCommunityName={newCommunityName}
            onNewCommunityNameChange={setNewCommunityName}
            onCreateCommunity={handleCreateCommunity}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
