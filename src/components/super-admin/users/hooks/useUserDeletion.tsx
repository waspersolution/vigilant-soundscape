
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserWithCommunity } from "../types";

export function useUserDeletion(onSuccess: () => void) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithCommunity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUser = (user: UserWithCommunity) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      // Check if user is logged in
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }
      
      if (!sessionData.session) {
        throw new Error("You must be logged in to perform this action");
      }
      
      // Verify current user's role is super_admin
      const { data: currentUserData, error: currentUserError } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('id', sessionData.session.user.id)
        .single();
      
      if (currentUserError) {
        console.error("Error fetching current user role:", currentUserError);
        throw new Error("Failed to verify your permissions");
      }
      
      const isCurrentUserSuperAdmin = 
        currentUserData.role === 'super_admin' || 
        currentUserData.email === 'wasperstore@gmail.com';
      
      if (!isCurrentUserSuperAdmin) {
        throw new Error("Permission denied: Only super admins can delete users");
      }
      
      console.log("Deleting user:", userToDelete.id);
      console.log("Current user ID:", sessionData.session.user.id);
      console.log("Current user role:", currentUserData.role);
      
      const { data, error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id)
        .select();
        
      if (error) {
        console.error("Error deleting user:", error);
        throw new Error(`Failed to delete user: ${error.message}`);
      }
      
      console.log("User deleted successfully:", data);
      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    isDeleting,
    handleDeleteUser,
    confirmDeleteUser
  };
}
