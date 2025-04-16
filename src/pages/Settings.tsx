
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Check, Save, AlertTriangle, BellRing, MapPin, Shield, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "@/contexts/LocationContext";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, logout } = useAuth();
  const { isTracking, startTracking, stopTracking } = useLocation();
  const navigate = useNavigate();
  
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });
  
  const [notifications, setNotifications] = useState({
    emergencyAlerts: true,
    patrolUpdates: true,
    communityMessages: true,
    soundAlerts: true,
  });
  
  const [privacy, setPrivacy] = useState({
    shareLocation: isTracking,
    shareStatus: true,
    allowCommunityView: true,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy) => {
    if (key === "shareLocation") {
      if (privacy.shareLocation) {
        stopTracking();
      } else {
        startTracking();
      }
    }
    
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-4 space-y-4">
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
                  value={user?.role || "member"}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Roles are assigned by community administrators
                </p>
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
              <Button onClick={handleSaveSettings} disabled={isSaving}>
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
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <Label htmlFor="emergencyAlerts" className="font-medium">Emergency Alerts</Label>
                  </div>
                  <Switch
                    id="emergencyAlerts"
                    checked={notifications.emergencyAlerts}
                    onCheckedChange={() => handleNotificationChange("emergencyAlerts")}
                  />
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Receive critical security alerts (these cannot be fully disabled)
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <Label htmlFor="patrolUpdates" className="font-medium">Patrol Updates</Label>
                  </div>
                  <Switch
                    id="patrolUpdates"
                    checked={notifications.patrolUpdates}
                    onCheckedChange={() => handleNotificationChange("patrolUpdates")}
                  />
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Updates on security patrol activities in your area
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-primary" />
                    <Label htmlFor="communityMessages" className="font-medium">Community Messages</Label>
                  </div>
                  <Switch
                    id="communityMessages"
                    checked={notifications.communityMessages}
                    onCheckedChange={() => handleNotificationChange("communityMessages")}
                  />
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  General messages from community members and managers
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BellRing className="h-4 w-4 text-primary" />
                    <Label htmlFor="soundAlerts" className="font-medium">Sound Alerts</Label>
                  </div>
                  <Switch
                    id="soundAlerts"
                    checked={notifications.soundAlerts}
                    onCheckedChange={() => handleNotificationChange("soundAlerts")}
                  />
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Play sound for emergency alerts (recommended)
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
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
        </TabsContent>
        
        {/* Privacy Tab */}
        <TabsContent value="privacy" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <Label htmlFor="shareLocation" className="font-medium">Location Sharing</Label>
                  </div>
                  <Switch
                    id="shareLocation"
                    checked={privacy.shareLocation}
                    onCheckedChange={() => handlePrivacyChange("shareLocation")}
                  />
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Share your real-time location with community security
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-primary" />
                    <Label htmlFor="shareStatus" className="font-medium">Online Status</Label>
                  </div>
                  <Switch
                    id="shareStatus"
                    checked={privacy.shareStatus}
                    onCheckedChange={() => handlePrivacyChange("shareStatus")}
                  />
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Show when you're active on the platform
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <Label htmlFor="allowCommunityView" className="font-medium">Community Profile</Label>
                  </div>
                  <Switch
                    id="allowCommunityView"
                    checked={privacy.allowCommunityView}
                    onCheckedChange={() => handlePrivacyChange("allowCommunityView")}
                  />
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Allow community members to view your profile information
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
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
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-amber-500">Data Management</CardTitle>
              <CardDescription>
                Manage your personal data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Export Data</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Download a copy of your personal data
                  </p>
                  <Button variant="outline">Export My Data</Button>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-destructive mb-1">Delete Account</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="destructive">Request Account Deletion</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
