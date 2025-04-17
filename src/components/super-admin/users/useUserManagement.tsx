
import { useUserFetching } from "./hooks/useUserFetching";
import { useCommunityFetching } from "./hooks/useCommunityFetching";
import { useUserDialog } from "./hooks/useUserDialog";
import { useUserDeletion } from "./hooks/useUserDeletion";

export default function useUserManagement() {
  const {
    isLoading,
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

  return {
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
