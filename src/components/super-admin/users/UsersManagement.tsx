
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserFilters from "./UserFilters";
import UsersTable from "./UsersTable";
import UserFormDialog from "./UserFormDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import useUserManagement from "./useUserManagement";

export default function UsersManagement() {
  const {
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
