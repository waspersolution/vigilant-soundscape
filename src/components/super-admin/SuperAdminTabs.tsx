
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Home,
  AlertCircle,
  Map,
  PhoneCall,
  LineChart,
  CreditCard,
  ScrollText,
  Building2
} from "lucide-react";

// Super Admin dashboard tabs
import SuperAdminOverview from "@/components/super-admin/SuperAdminOverview";
import { UsersManagement } from "@/components/super-admin"; // Fixed import
import CommunitiesManagement from "@/components/super-admin/CommunitiesManagement";
import AlertsMonitoring from "@/components/super-admin/AlertsMonitoring";
import CommunicationMonitoring from "@/components/super-admin/CommunicationMonitoring";
import SecurityTracking from "@/components/super-admin/SecurityTracking";
import EmergencyContactsMonitoring from "@/components/super-admin/EmergencyContactsMonitoring";
import SystemAnalytics from "@/components/super-admin/SystemAnalytics";
import BillingManagement from "@/components/super-admin/BillingManagement";
import AuditLogs from "@/components/super-admin/AuditLogs";

export function SuperAdminTabs() {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <div className="overflow-auto">
        <TabsList className="mb-4 flex w-full lg:w-auto p-1 bg-secondary/50 backdrop-blur-sm border border-border/30">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:security-shadow">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:security-shadow">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="communities" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:security-shadow">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Communities</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:security-shadow">
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="comms" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:security-shadow">
            <PhoneCall className="h-4 w-4" />
            <span className="hidden sm:inline">Communications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:security-shadow">
            <Map className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:security-shadow">
            <PhoneCall className="h-4 w-4" />
            <span className="hidden sm:inline">Emergency</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:security-shadow">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:security-shadow">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:security-shadow">
            <ScrollText className="h-4 w-4" />
            <span className="hidden sm:inline">Audit Logs</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="overview" className="animate-fade-in shield-pattern">
        <SuperAdminOverview />
      </TabsContent>
      
      <TabsContent value="users" className="animate-fade-in shield-pattern">
        <UsersManagement />
      </TabsContent>
      
      <TabsContent value="communities" className="animate-fade-in shield-pattern">
        <CommunitiesManagement />
      </TabsContent>
      
      <TabsContent value="alerts" className="animate-fade-in shield-pattern">
        <AlertsMonitoring />
      </TabsContent>
      
      <TabsContent value="comms" className="animate-fade-in shield-pattern">
        <CommunicationMonitoring />
      </TabsContent>
      
      <TabsContent value="security" className="animate-fade-in shield-pattern">
        <SecurityTracking />
      </TabsContent>
      
      <TabsContent value="emergency" className="animate-fade-in shield-pattern">
        <EmergencyContactsMonitoring />
      </TabsContent>
      
      <TabsContent value="analytics" className="animate-fade-in shield-pattern">
        <SystemAnalytics />
      </TabsContent>
      
      <TabsContent value="billing" className="animate-fade-in shield-pattern">
        <BillingManagement />
      </TabsContent>
      
      <TabsContent value="logs" className="animate-fade-in shield-pattern">
        <AuditLogs />
      </TabsContent>
    </Tabs>
  );
}
