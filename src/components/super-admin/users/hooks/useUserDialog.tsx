
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserWithCommunity, UserFormValues } from "../types";

export function useUserDialog(onSuccess: () => void) {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithCommunity | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Clear auth error when dialog opens/closes
  useEffect(() => {
    if (!userDialogOpen) {
      setAuthError(null);
    }
  }, [userDialogOpen]);

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
    setAuthError(null);
    
    try {
      // Check if user is logged in
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }
      
      if (!sessionData.session) {
        throw new Error("You must be logged in to perform this action");
      }
      
      // Check if current user has admin permissions
      const { data: currentUserData, error: currentUserError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', sessionData.session.user.id)
        .single();
        
      if (currentUserError) {
        throw new Error(`Permission error: ${currentUserError.message}`);
      }
      
      if (!['admin', 'super_admin'].includes(currentUserData.role)) {
        throw new Error("You don't have permission to manage users");
      }

      console.log("Submitting user form with data:", data);
      
      // Process community ID based on role selection
      const isAdminUser = data.role === 'admin' || data.role === 'super_admin';
      const communityId = isAdminUser ? null : 
                         (data.communityId === 'none' ? null : data.communityId || null);
      
      console.log("Processed communityId:", communityId);

      if (editingUser) {
        console.log("Updating existing user:", editingUser.id);
        const { data: userData, error } = await supabase
          .from('profiles')
          .update({
            full_name: data.fullName,
            email: data.email,
            role: data.role,
            community_id: communityId,
          })
          .eq('id', editingUser.id)
          .select();

        if (error) {
          console.error("Error updating user:", error);
          if (error.message.includes("row-level security")) {
            throw new Error("Permission denied: Row-level security policy violation");
          }
          throw error;
        }
        
        console.log("User updated successfully:", userData);
        toast.success('User updated successfully');
      } else {
        console.log("Creating new user");
        const uniqueId = crypto.randomUUID();
        
        // Check if a current session exists to bypass RLS
        const { data: userData, error } = await supabase
          .from('profiles')
          .insert({
            id: uniqueId,
            full_name: data.fullName,
            email: data.email,
            role: data.role,
            community_id: communityId,
          })
          .select();

        if (error) {
          console.error("Error creating user:", error);
          if (error.message.includes("row-level security")) {
            throw new Error("Permission denied: Row-level security policy violation");
          }
          throw error;
        }
        
        console.log("User created successfully:", userData);
        toast.success('User profile created successfully');
      }
      
      setUserDialogOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error saving user:', error);
      setAuthError(error.message || 'Failed to save user');
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
    authError,
    handleCreateUser,
    handleEditUser,
    submitUserForm
  };
}
