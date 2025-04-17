
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
      const currentSession = await supabase.auth.getSession();
      if (!currentSession.data.session) {
        throw new Error("You must be logged in to perform this action");
      }
      
      console.log("Deleting user:", userToDelete.id);
      const { data, error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id)
        .select();
        
      if (error) {
        console.error("Error deleting user:", error);
        throw error;
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
