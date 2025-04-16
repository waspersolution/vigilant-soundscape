
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
          await supabase.rpc('create_super_admin');
          toast.success("Super admin role applied successfully");
          console.log("Super admin role applied successfully");
        } catch (rpcError) {
          console.log("Super admin RPC error:", rpcError);
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
          throw signUpError;
        }
        
        if (signUpData.user) {
          await this.handleProfileCreation(signUpData.user.id, email);
          
          if (onSuperAdminSignup) {
            onSuperAdminSignup();
          }
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
    console.log("User created:", userId);
    
    // Check if profile was created by the trigger
    const { data: profileCheck } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (!profileCheck) {
      console.log("Profile not found, manually creating...");
      
      // Manually create profile if trigger fails
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            email: email,
            full_name: 'Azeez Wosilat',
            role: 'member'
          });
        
        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast.error("Profile creation error: " + profileError.message);
        } else {
          console.log("Profile created successfully");
          
          // Now try to create super admin role
          try {
            await supabase.rpc('create_super_admin');
            toast.success("Super admin created successfully");
            console.log("Super admin created successfully");
          } catch (rpcError: any) {
            console.error("Super admin RPC error after signup:", rpcError);
            toast.error("Error creating super admin role: " + (rpcError.message || "Unknown error"));
          }
        }
      } catch (profileCreationError: any) {
        console.error("Profile creation error:", profileCreationError);
        toast.error("Profile creation error: " + (profileCreationError.message || "Unknown error"));
      }
    } else {
      console.log("Profile already exists, updating to super admin");
      try {
        await supabase.rpc('create_super_admin');
        toast.success("Super admin created successfully");
      } catch (rpcError: any) {
        console.error("Super admin RPC error:", rpcError);
        toast.error("Error creating super admin role: " + (rpcError.message || "Unknown error"));
      }
    }
  }
}

export default SuperAdminHandler;
