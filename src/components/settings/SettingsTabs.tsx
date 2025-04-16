
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "@/components/settings/ProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
import DashboardSettings from "@/components/settings/DashboardSettings";
import { Bell, Layout, ShieldAlert, User } from "lucide-react";

export function SettingsTabs() {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <div className="overflow-auto">
        <TabsList className="mb-4 flex w-full md:w-auto p-1 bg-secondary/50 backdrop-blur-sm">
          <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft">
            <ShieldAlert className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft">
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="profile" className="animate-fade-in">
        <ProfileSettings />
      </TabsContent>
      
      <TabsContent value="notifications" className="animate-fade-in">
        <NotificationSettings />
      </TabsContent>
      
      <TabsContent value="privacy" className="animate-fade-in">
        <PrivacySettings />
      </TabsContent>
      
      <TabsContent value="dashboard" className="animate-fade-in">
        <DashboardSettings />
      </TabsContent>
    </Tabs>
  );
}
