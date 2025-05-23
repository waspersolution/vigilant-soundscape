
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
        throw new Error("Permission denied: Only super admins can manage users");
      }
      
      // Process community ID based on role selection
      const isAdminUser = data.role === 'admin' || data.role === 'super_admin';
      const communityId = isAdminUser ? null : 
                         (data.communityId === 'none' ? null : data.communityId || null);
      
      console.log("Submitting user form with data:", data);
      console.log("Current user ID:", sessionData.session.user.id);
      console.log("Current user role:", currentUserData.role);
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
          throw new Error(`Failed to update user: ${error.message}`);
        }
        
        console.log("User updated successfully:", userData);
        toast.success('User updated successfully');
      } else {
        console.log("Creating new user");
        const uniqueId = crypto.randomUUID();
        
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
          throw new Error(`Failed to create user: ${error.message}`);
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
