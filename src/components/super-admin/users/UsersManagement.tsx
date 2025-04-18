
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserFilters from "./UserFilters";
import UsersTable from "./UsersTable";
import UserFormDialog from "./UserFormDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import useUserManagement from "./useUserManagement";
import { Loader2 } from "lucide-react";

export default function UsersManagement() {
  const {
    isCheckingAuth,
    hasPermission,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    communityFilter,
    setCommunityFilter,
    isLoading,
    communities,
    userDialogOpen,
    setUserDialogOpen,
    isSubmitting,
    editingUser,
    authError,
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
  } = useUserManagement();

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking permissions...</span>
      </div>
    );
  }

  // Show permission denied message
  if (!hasPermission) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access the user management section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please contact an administrator if you believe this is an error.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View, create, or manage users across all communities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            communityFilter={communityFilter}
            setCommunityFilter={setCommunityFilter}
            communities={communities}
            onCreateUser={handleCreateUser}
          />
          
          <UsersTable 
            isLoading={isLoading}
            filteredUsers={filteredUsers}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        </CardContent>
      </Card>

      <UserFormDialog
        open={userDialogOpen}
        onOpenChange={setUserDialogOpen}
        editingUser={editingUser}
        communities={communities}
        isSubmitting={isSubmitting}
        authError={authError}
        onSubmit={submitUserForm}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        userToDelete={userToDelete}
        isDeleting={isDeleting}
        onConfirmDelete={confirmDeleteUser}
      />
    </div>
  );
}
