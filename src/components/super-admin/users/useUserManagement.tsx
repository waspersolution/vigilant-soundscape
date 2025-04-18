
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

  // Check if user has admin privileges
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          toast.error("You must be logged in to access this page");
          setHasPermission(false);
          setIsCheckingAuth(false);
          return;
        }

        const user = session.session.user;
        const email = user.email;
        const userMetadata = user.user_metadata;
        
        console.log("User metadata:", userMetadata);
        console.log("User email:", email);
        
        // Grant access if super admin email or role
        if (email === "wasperstore@gmail.com" || userMetadata?.role === 'super_admin') {
          console.log("User has super admin privileges");
          setHasPermission(true);
        } else {
          console.log("User does not have super admin privileges");
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
