
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Check, Save, MapPin, User, Shield } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import { toast } from "sonner";

export default function PrivacySettings() {
  const { isTracking, startTracking, stopTracking } = useLocation();
  
  const [privacy, setPrivacy] = useState({
    shareLocation: isTracking,
    shareStatus: true,
    allowCommunityView: true,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
      toast.success("Privacy settings saved");
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
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
      
      <Card>
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
    </div>
  );
}
