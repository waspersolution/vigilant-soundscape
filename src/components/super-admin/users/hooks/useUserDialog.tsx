
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserWithCommunity, UserFormValues } from "../types";

export function useUserDialog(onSuccess: () => void) {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithCommunity | null>(null);

  const handleCreateUser = () => {
    setEditingUser(null);
    setUserDialogOpen(true);
  };

  const handleEditUser = (user: UserWithCommunity) => {
    setEditingUser(user);
    setUserDialogOpen(true);
  };

  const submitUserForm = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      const currentSession = await supabase.auth.getSession();
      if (!currentSession.data.session) {
        throw new Error("You must be logged in to perform this action");
      }

      const isAdminUser = data.role === 'admin' || data.role === 'super_admin';
      const communityId = isAdminUser ? null : 
                         (data.communityId === 'none' ? null : data.communityId || null);

      if (editingUser) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: data.fullName,
            email: data.email,
            role: data.role,
            community_id: communityId,
          })
          .eq('id', editingUser.id);

        if (error) throw error;
        toast.success('User updated successfully');
      } else {
        const uniqueId = crypto.randomUUID();
        
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: uniqueId,
            full_name: data.fullName,
            email: data.email,
            role: data.role,
            community_id: communityId,
          });

        if (error) throw error;
        toast.success('User profile created successfully');
      }
      
      setUserDialogOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast.error(error.message || 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    userDialogOpen,
    setUserDialogOpen,
    isSubmitting,
    editingUser,
    handleCreateUser,
    handleEditUser,
    submitUserForm
  };
}
