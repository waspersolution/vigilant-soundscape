
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserWithCommunity } from "../types";

export function useUserFetching() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserWithCommunity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [communityFilter, setCommunityFilter] = useState('all');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, community_id, online_status, last_location');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Transform the data
      const transformedUsers: UserWithCommunity[] = profilesData?.map(profile => ({
        id: profile.id,
        fullName: profile.full_name,
        email: profile.email,
        role: profile.role,
        communityId: profile.community_id || undefined,
        onlineStatus: profile.online_status || false,
        lastLocation: profile.last_location as any
      })) || [];

      setUsers(transformedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    isLoading,
    users,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    communityFilter,
    setCommunityFilter,
    fetchUsers
  };
}
