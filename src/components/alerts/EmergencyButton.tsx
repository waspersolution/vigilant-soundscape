
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAlert } from "@/contexts/AlertContext";
import { AlertTriangle, Siren, ShieldAlert, Radio } from "lucide-react";

export default function EmergencyButton() {
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState<"panic" | "emergency" | "patrol_stop">("emergency");
  const [message, setMessage] = useState("");
  const { createAlert, isLoading } = useAlert();

  const handleSendAlert = async () => {
    // Priority mapping based on alert type
    const priorityMap = {
      panic: 1, // Highest priority
      emergency: 2,
      patrol_stop: 4, // Lower priority
    };

    try {
      await createAlert(alertType, message, priorityMap[alertType] as 1 | 2 | 4);
      setOpen(false);
      setMessage("");
    } catch (error) {
      console.error("Failed to send alert:", error);
    }
  };

  return (
    <>
      <Button
        size="lg"
        variant="destructive"
        className="fixed bottom-24 right-4 z-50 rounded-full h-16 w-16 shadow-lg animate-pulse-alert"
        onClick={() => setOpen(true)}
      >
        <Siren className="h-8 w-8" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Emergency Alert</DialogTitle>
            <DialogDescription>
              Select the type of alert to broadcast to your community
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="emergency" onValueChange={(v) => setAlertType(v as any)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="panic" className="flex flex-col gap-1 py-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span>Panic</span>
              </TabsTrigger>
              <TabsTrigger value="emergency" className="flex flex-col gap-1 py-3">
                <Siren className="h-5 w-5 text-destructive" />
                <span>Emergency</span>
              </TabsTrigger>
              <TabsTrigger value="patrol_stop" className="flex flex-col gap-1 py-3">
                <Radio className="h-5 w-5 text-blue-500" />
                <span>Patrol</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="panic">
              <div className="space-y-3">
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-destructive" />
                    <span className="font-semibold">Panic Alert</span>
                  </div>
                  <p className="text-sm mt-1">
                    Use for immediate danger requiring urgent response. This will send a
                    high-priority alert with sounds to all security personnel and community
                    leaders. Use only in genuine emergencies.
                  </p>
                </div>

                <Textarea
                  placeholder="Describe the emergency situation (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-24"
                />
              </div>
            </TabsContent>

            <TabsContent value="emergency">
              <div className="space-y-3">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <Siren className="h-5 w-5 text-amber-500" />
                    <span className="font-semibold">Emergency Alert</span>
                  </div>
                  <p className="text-sm mt-1">
                    Use for serious situations requiring prompt attention. This alert will
                    notify all security personnel and community managers.
                  </p>
                </div>

                <Textarea
                  placeholder="Describe the emergency situation (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-24"
                />
              </div>
            </TabsContent>

            <TabsContent value="patrol_stop">
              <div className="space-y-3">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <Radio className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">Patrol Notice</span>
                  </div>
                  <p className="text-sm mt-1">
                    Use to notify about patrol activities, breaks, or observations. This is
                    a low-priority notification that will not trigger alarms.
                  </p>
                </div>

                <Textarea
                  placeholder="Describe your patrol status or observation"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-24"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={alertType === "patrol_stop" ? "default" : "destructive"}
              onClick={handleSendAlert}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Alert"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
