
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserWithCommunity, UserFormValues } from "./types";

export default function useUserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [communityFilter, setCommunityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserWithCommunity[]>([]);
  const [communities, setCommunities] = useState<{id: string, name: string}[]>([]);
  
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithCommunity | null>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithCommunity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCommunities(); // Fetch communities first
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching users...");
      
      // Fetch communities first if not already loaded
      if (communities.length === 0) {
        await fetchCommunities();
      }
      
      // Fetch profiles directly without checking role
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, community_id, online_status, last_location');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log("Profiles fetched:", profilesData?.length || 0);
      
      // Transform the data to match our UserWithCommunity type
      const transformedUsers: UserWithCommunity[] = profilesData?.map(profile => {
        // Find matching community
        const community = communities.find(c => c.id === profile.community_id);
        
        return {
          id: profile.id,
          fullName: profile.full_name,
          email: profile.email,
          role: profile.role,
          communityId: profile.community_id || undefined,
          onlineStatus: profile.online_status || false,
          lastLocation: profile.last_location as any,
          communityName: community ? community.name : undefined
        };
      }) || [];

      setUsers(transformedUsers);
      console.log("Users fetched successfully:", transformedUsers.length);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('id, name');

      if (error) {
        console.error('Error fetching communities:', error);
        throw error;
      }

      setCommunities(data || []);
      console.log("Communities fetched:", data?.length || 0);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast.error('Failed to load communities');
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setUserDialogOpen(true);
  };

  const handleEditUser = (user: UserWithCommunity) => {
    setEditingUser(user);
    setUserDialogOpen(true);
  };

  const handleDeleteUser = (user: UserWithCommunity) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const submitUserForm = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingUser) {
        // Update existing user
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: data.fullName,
            email: data.email,
            role: data.role,
            community_id: data.communityId === 'none' ? null : data.communityId || null,
          })
          .eq('id', editingUser.id);

        if (error) throw error;
        toast.success('User updated successfully');
      } else {
        // Create new user - For demo purposes we're creating a profile entry
        // In a real production app with auth, you would use Supabase Auth Admin API
        const uniqueId = crypto.randomUUID();
        
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: uniqueId,
            full_name: data.fullName,
            email: data.email,
            role: data.role,
            community_id: data.communityId === 'none' ? null : data.communityId || null,
          });

        if (error) throw error;
        toast.success('User created successfully');
        toast.info('Note: In production, user creation would use Supabase Auth API');
      }
      
      setUserDialogOpen(false);
      fetchUsers(); // Refresh user list
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast.error(error.message || 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);
        
      if (error) throw error;
      
      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
      
      // Update local state to reflect changes
      setUsers(users.filter(user => user.id !== userToDelete.id));
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    const matchesCommunity = 
      communityFilter === 'all' || 
      (communityFilter === 'none' && !user.communityId) ||
      user.communityId === communityFilter;
    
    return matchesSearch && matchesRole && matchesCommunity;
  });

  return {
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    communityFilter,
    setCommunityFilter,
    isLoading,
    users,
    communities,
    userDialogOpen,
    setUserDialogOpen,
    isSubmitting,
    editingUser,
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    isDeleting,
    filteredUsers,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
    submitUserForm,
    confirmDeleteUser
  };
}
