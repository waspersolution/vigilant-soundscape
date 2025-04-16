
import { SettingsTabs } from "@/components/settings/SettingsTabs";

export default function Settings() {
  return (
    <div className="space-y-6 pb-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gradient">Security Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and security configuration
        </p>
      </div>

      <div className="security-panel p-1">
        <SettingsTabs />
      </div>
    </div>
  );
}
