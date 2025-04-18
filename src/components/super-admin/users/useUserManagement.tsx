
import { useUserFetching } from "./hooks/useUserFetching";
import { useCommunityFetching } from "./hooks/useCommunityFetching";
import { useUserDialog } from "./hooks/useUserDialog";
import { useUserDeletion } from "./hooks/useUserDeletion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function useUserManagement() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  // Check if user has super admin privileges
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Session error:", sessionError);
          setHasPermission(false);
          setIsCheckingAuth(false);
          return;
        }
        
        if (!session.session) {
          console.log("No active session found");
          toast.error("You must be logged in to access this page");
          setHasPermission(false);
          setIsCheckingAuth(false);
          return;
        }

        // Check if the user is wasperstore@gmail.com (special case)
        const email = session.session.user.email;
        if (email === "wasperstore@gmail.com") {
          console.log("User is the super admin (wasperstore@gmail.com)");
          setHasPermission(true);
          setIsCheckingAuth(false);
          return;
        }
        
        // Check user role in profiles table
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.session.user.id)
          .single();
        
        if (userError) {
          console.error("Error fetching user role:", userError);
          toast.error("Failed to verify your permissions");
          setHasPermission(false);
          setIsCheckingAuth(false);
          return;
        }
        
        console.log("User role from database:", userData?.role);
        
        if (userData?.role === 'super_admin') {
          console.log("User has super_admin role");
          setHasPermission(true);
        } else {
          console.log("User does not have super_admin role");
          toast.error("You don't have permission to manage users");
          setHasPermission(false);
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
        setHasPermission(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkPermission();
  }, []);

  const {
    isLoading: isLoadingUsers,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    communityFilter,
    setCommunityFilter,
    fetchUsers
  } = useUserFetching();

  const { communities, fetchCommunities } = useCommunityFetching();

  const {
    userDialogOpen,
    setUserDialogOpen,
    isSubmitting,
    editingUser,
    authError,
    handleCreateUser,
    handleEditUser,
    submitUserForm
  } = useUserDialog(() => {
    fetchUsers();
    fetchCommunities();
  });

  const {
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    isDeleting,
    handleDeleteUser,
    confirmDeleteUser
  } = useUserDeletion(() => {
    fetchUsers();
    fetchCommunities();
  });

  // Combine loading states
  const isLoading = isCheckingAuth || isLoadingUsers;

  return {
    // Auth state
    isCheckingAuth,
    hasPermission,
    // User fetching
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    communityFilter,
    setCommunityFilter,
    isLoading,
    filteredUsers,
    // Communities
    communities,
    // User dialog
    userDialogOpen,
    setUserDialogOpen,
    isSubmitting,
    editingUser,
    authError,
    // Delete dialog
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    isDeleting,
    // Actions
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
    submitUserForm,
    confirmDeleteUser
  };
}
