import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, Save, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function ProfileSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  console.log("Current user in ProfileSettings:", user);

  useEffect(() => {
    const updateSuperAdminRoleIfNeeded = async () => {
      if (user?.email === "wasperstore@gmail.com" && user.role !== "super_admin") {
        console.log("ProfileSettings - Super admin email detected but role isn't correct, updating...");
        try {
          const { error } = await supabase.auth.updateUser({
            data: { 
              role: 'super_admin',
              full_name: 'Azeez Wosilat'
            }
          });
          
          if (error) {
            console.error("Failed to update super admin role:", error);
          } else {
            console.log("Super admin role enforced from ProfileSettings");
            
            await supabase.auth.refreshSession();
            
            window.location.reload();
          }
        } catch (err) {
          console.error("Error enforcing super admin role:", err);
        }
      }
    };
    
    if (user) {
      updateSuperAdminRoleIfNeeded();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || "",
        email: user.email || ""
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: profileForm.fullName 
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success("Profile updated successfully");
      setSaveSuccess(true);
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });
      
      if (error) throw error;
      
      toast.success("Password updated successfully");
      
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("ProfileSettings - Initiating logout");
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to logout");
    }
  };

  const formatRole = (role: string | undefined) => {
    if (!role) return 'Member';
    
    if (user?.email === "wasperstore@gmail.com") {
      return "Super Admin";
    }
    
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={profileForm.fullName}
              onChange={handleProfileChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Your email cannot be changed without contacting support
            </p>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={formatRole(user?.role)}
              disabled
            />
            {user?.email === "wasperstore@gmail.com" && (
              <p className="text-xs text-green-600 dark:text-green-400">
                You have super admin privileges
              </p>
            )}
            {user?.role === 'super_admin' && user?.email !== "wasperstore@gmail.com" && (
              <p className="text-xs text-green-600 dark:text-green-400">
                You have super admin privileges
              </p>
            )}
            {user?.role !== 'super_admin' && user?.email !== "wasperstore@gmail.com" && (
              <p className="text-xs text-muted-foreground">
                Roles are assigned by community administrators
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="community">Community</Label>
            <Input
              id="community"
              value="Oakwood Heights"
              disabled
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveProfile} disabled={isSaving}>
            {isSaving ? (
              "Saving..."
            ) : saveSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Password Management</CardTitle>
          <CardDescription>
            Update your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleChangePassword} 
            disabled={isChangingPassword}
            variant="outline"
          >
            {isChangingPassword ? "Updating..." : "Change Password"}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Account Actions</CardTitle>
          <CardDescription>
            Manage your account status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Leave Community</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Remove yourself from the current community
              </p>
              <Button variant="outline">
                Leave Community
              </Button>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium text-destructive mb-1">Logout</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Sign out of your account
              </p>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
