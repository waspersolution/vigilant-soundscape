
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
    fetchUsers();
    fetchCommunities();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Simplified query to avoid infinite recursion in policy
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          role,
          community_id,
          online_status,
          last_location
        `);

      if (error) {
        throw error;
      }

      // Get communities in a separate query if needed
      const communityMap = new Map();
      if (communities.length > 0) {
        communities.forEach(community => {
          communityMap.set(community.id, community.name);
        });
      }

      const transformedUsers: UserWithCommunity[] = data.map(profile => ({
        id: profile.id,
        fullName: profile.full_name,
        email: profile.email,
        role: profile.role,
        communityId: profile.community_id || undefined,
        onlineStatus: profile.online_status || false,
        lastLocation: profile.last_location as any,
        communityName: profile.community_id ? communityMap.get(profile.community_id) : undefined
      }));

      setUsers(transformedUsers);
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
        throw error;
      }

      setCommunities(data);
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
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: data.fullName,
            email: data.email,
            role: data.role,
            community_id: data.communityId || null,
          })
          .eq('id', editingUser.id);

        if (error) throw error;
        toast.success('User updated successfully');
      } else {
        toast.success('User creation would be implemented with Supabase Admin API');
      }
      
      setUserDialogOpen(false);
      fetchUsers();
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
      toast.success('User deletion would be implemented with Supabase Admin API');
      setDeleteDialogOpen(false);
      
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
