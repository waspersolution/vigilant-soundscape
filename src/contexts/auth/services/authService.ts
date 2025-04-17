
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserWithRole } from '../types';

export async function login(email: string, password: string) {
  try {
    console.log("Attempting login for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    console.log("Login successful");
    toast.success("Login successful");
    
    // Special handling for super_admin login
    if (email === "wasperstore@gmail.com") {
      console.log("Super admin login detected, forcing role update");
      
      // Create user object with super_admin role
      const userWithRole: UserWithRole = {
        ...data.user!,
        role: 'super_admin',
        fullName: 'Azeez Wosilat'
      };
      
      // Force update metadata for super admin
      await enforceSuperAdminRole(userWithRole);
      
      // Force reload the page to ensure all components get the latest role
      window.location.href = "/super-admin";
    }

    return data;
  } catch (error: any) {
    console.error("Login error:", error);
    toast.error(error.message || "Failed to login");
    throw error;
  }
}

export async function register(email: string, password: string, fullName: string) {
  try {
    console.log("Attempting registration for:", email);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'member'
        }
      }
    });

    if (error) {
      throw error;
    }

    console.log("Registration successful");
    toast.success("Registration successful. Please check your email for confirmation.");
  } catch (error: any) {
    console.error("Registration error:", error);
    toast.error(error.message || "Failed to register");
    throw error;
  }
}

export async function logout() {
  try {
    console.log("Attempting logout");
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    
    console.log("Logout successful - user state cleared");
    toast.success("Logged out successfully");
    
    // Redirect to auth page after logout
    window.location.href = "/auth";
  } catch (error: any) {
    console.error("Logout error:", error);
    toast.error(error.message || "Failed to logout");
    throw error;
  }
}

export async function enforceSuperAdminRole(userWithRole: UserWithRole) {
  try {
    const { error } = await supabase.auth.updateUser({
      data: { 
        role: 'super_admin',
        full_name: 'Azeez Wosilat'
      }
    });
    
    if (error) {
      console.error("Failed to update super admin role:", error);
      return false;
    }
    
    console.log("Super admin role enforced successfully");
    
    // Refresh session to get updated metadata
    const { data } = await supabase.auth.refreshSession();
    if (data.session) {
      console.log("Session refreshed with updated role metadata");
      return true;
    }
    
    return false;
  } catch (err) {
    console.error("Error enforcing super admin role:", err);
    return false;
  }
}
