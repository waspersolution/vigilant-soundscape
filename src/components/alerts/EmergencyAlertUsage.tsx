
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock } from "lucide-react";

interface AlertUsage {
  dailyCount: number;
  monthlyCount: number;
  lastSentTimestamp: string | null;
  cooldownEndsAt: string | null;
}

// This would come from a real API in production
const mockFetchAlertUsage = async (userId: string): Promise<AlertUsage> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data
  return {
    dailyCount: Math.floor(Math.random() * 4), // 0-3
    monthlyCount: Math.floor(Math.random() * 11), // 0-10
    lastSentTimestamp: Math.random() > 0.5 ? new Date().toISOString() : null,
    cooldownEndsAt: Math.random() > 0.7 
      ? new Date(Date.now() + 1000 * 60 * 15).toISOString() // 15 min from now
      : null
  };
};

export default function EmergencyAlertUsage() {
  const { user } = useAuth();
  const [alertUsage, setAlertUsage] = useState<AlertUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsage = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const usage = await mockFetchAlertUsage(user.id);
        setAlertUsage(usage);
      } catch (error) {
        console.error("Failed to fetch alert usage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [user?.id]);

  // Update cooldown timer every second
  useEffect(() => {
    if (!alertUsage?.cooldownEndsAt) {
      setCooldownRemaining(null);
      return;
    }

    const cooldownEnd = new Date(alertUsage.cooldownEndsAt).getTime();
    
    const updateCooldown = () => {
      const now = Date.now();
      const remaining = Math.max(0, cooldownEnd - now);
      
      if (remaining <= 0) {
        setCooldownRemaining(null);
        return;
      }
      
      setCooldownRemaining(Math.floor(remaining / 1000)); // in seconds
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    
    return () => clearInterval(interval);
  }, [alertUsage?.cooldownEndsAt]);

  if (loading || !alertUsage) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Alert Usage</CardTitle>
          <CardDescription>Loading usage data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatCooldownTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Alert Usage</CardTitle>
        <CardDescription>Your emergency alert limits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Daily Usage (3 max)</span>
            <span className="font-medium">{alertUsage.dailyCount}/3</span>
          </div>
          <Progress value={(alertUsage.dailyCount / 3) * 100} />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Monthly Usage (10 max)</span>
            <span className="font-medium">{alertUsage.monthlyCount}/10</span>
          </div>
          <Progress value={(alertUsage.monthlyCount / 10) * 100} />
        </div>

        {cooldownRemaining !== null && (
          <div className="flex items-center gap-2 text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md mt-2">
            <Clock size={16} />
            <span className="text-sm">
              Cooldown: {formatCooldownTime(cooldownRemaining)} remaining
            </span>
          </div>
        )}
        
        {alertUsage.lastSentTimestamp && (
          <div className="text-xs text-muted-foreground">
            Last alert sent: {new Date(alertUsage.lastSentTimestamp).toLocaleString()}
          </div>
        )}

        {alertUsage.dailyCount >= 3 && (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-2 rounded-md">
            <AlertTriangle size={16} />
            <span className="text-sm">You've reached your daily alert limit</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
