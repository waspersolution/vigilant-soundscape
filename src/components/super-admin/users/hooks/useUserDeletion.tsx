
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
      
      console.log("Deleting user:", userToDelete.id);
      console.log("Current user ID:", sessionData.session.user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id)
        .select();
        
      if (error) {
        console.error("Error deleting user:", error);
        if (error.message.includes("policy")) {
          throw new Error("Permission denied: You don't have the right permissions to delete users");
        }
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
