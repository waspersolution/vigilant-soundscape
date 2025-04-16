
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

class SuperAdminHandler {
  static async handleSuperAdmin(
    email: string,
    password: string,
    onSuperAdminSignup?: () => void,
    onFinish?: () => void,
    onError?: (errorMsg: string) => void
  ) {
    try {
      console.log("Starting super admin login process...");
      
      // First try to sign in, in case the user already exists
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInData.user) {
        console.log("Super admin user found, logging in:", signInData.user.id);
        
        // User exists, try to run the create_super_admin RPC
        try {
          const { data: rpcData, error: rpcError } = await supabase.rpc('create_super_admin');
          
          if (rpcError) {
            console.error("Super admin RPC error:", rpcError);
            toast.error(`RPC error: ${rpcError.message}`);
            // Continue anyway as user might already be a super admin
          } else {
            toast.success("Super admin role applied successfully");
            console.log("Super admin role applied successfully");
          }
        } catch (rpcError: any) {
          console.error("Super admin RPC exception:", rpcError);
          // User might already be a super admin, continue anyway
        }
        
        if (onSuperAdminSignup) {
          onSuperAdminSignup();
        }
        return;
      }
      
      // If user doesn't exist, create it
      if (signInError) {
        console.log("User doesn't exist, creating super admin...", signInError);
        
        // Manual approach to create user and profile
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: 'Azeez Wosilat'
            }
          }
        });
        
        if (signUpError) {
          console.error("Signup error details:", signUpError);
          throw new Error(`Signup error: ${signUpError.message}`);
        }
        
        if (signUpData.user) {
          await this.handleProfileCreation(signUpData.user.id, email);
          
          if (onSuperAdminSignup) {
            onSuperAdminSignup();
          }
        } else {
          throw new Error("User creation successful but user data is missing");
        }
      }
    } catch (err: any) {
      console.error("Super admin creation error:", err);
      if (onError) {
        onError("Failed to create super admin account: " + (err.message || "Unknown error"));
      }
      toast.error("Super admin creation failed: " + (err.message || "Unknown error"));
    } finally {
      if (onFinish) {
        onFinish();
      }
    }
  }

  private static async handleProfileCreation(userId: string, email: string) {
    console.log("User created, checking for profile:", userId);
    
    // Directly try to create or update the profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: email,
        full_name: 'Azeez Wosilat',
        role: 'super_admin',
        community_id: null
      })
      .select();
    
    if (profileError) {
      console.error("Profile creation/update error:", profileError);
      toast.error("Profile error: " + profileError.message);
      throw new Error(`Profile error: ${profileError.message}`);
    }
    
    console.log("Profile created/updated successfully:", profileData);
  }
}

export default SuperAdminHandler;
