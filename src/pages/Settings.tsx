
import { SettingsTabs } from "@/components/settings/SettingsTabs";

export default function Settings() {
  return (
    <div className="space-y-6 pb-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gradient">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <SettingsTabs />
    </div>
  );
}
