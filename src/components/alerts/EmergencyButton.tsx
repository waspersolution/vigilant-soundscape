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
import { AlertTriangle, Siren, ShieldAlert, Radio, Mic, MicOff } from "lucide-react";
import EmergencyAlertUsage from "./EmergencyAlertUsage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EmergencyButton() {
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState<"panic" | "emergency" | "patrol_stop">("emergency");
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const { createAlert, isLoading } = useAlert();

  const handleSendAlert = async () => {
    const priorityMap = {
      panic: 1,
      emergency: 2,
      patrol_stop: 4,
    };

    try {
      await createAlert(alertType, message, priorityMap[alertType] as 1 | 2 | 4);
      setOpen(false);
      setMessage("");
      setIsRecording(false);
      setRecordingTime(0);
    } catch (error) {
      console.error("Failed to send alert:", error);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      console.log("Voice recording stopped after", recordingTime, "seconds");
    } else {
      setIsRecording(true);
      setRecordingTime(0);

      const interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) {
            clearInterval(interval);
            setIsRecording(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      (window as any).recordingInterval = interval;
    }
  };

  const handleCloseDialog = () => {
    if (isRecording) {
      clearInterval((window as any).recordingInterval);
      setIsRecording(false);
      setRecordingTime(0);
    }
    setOpen(false);
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

      <Dialog open={open} onOpenChange={handleCloseDialog}>
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
                    high-priority alert with sounds to all security personnel, community
                    leaders, and your emergency contacts.
                  </p>
                </div>

                <Textarea
                  placeholder="Describe the emergency situation (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-24"
                />
                
                <div className="mt-4">
                  <Button 
                    type="button" 
                    variant={isRecording ? "destructive" : "outline"}
                    className="w-full flex items-center justify-center gap-2"
                    onClick={toggleRecording}
                  >
                    {isRecording ? (
                      <>
                        <MicOff size={16} /> Stop Recording ({recordingTime}s)
                      </>
                    ) : (
                      <>
                        <Mic size={16} /> Record Voice Message
                      </>
                    )}
                  </Button>
                </div>
                
                {alertType === "panic" && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      Sending a panic alert will notify your emergency contacts via SMS with your location.
                    </AlertDescription>
                  </Alert>
                )}
                
                <EmergencyAlertUsage />
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
                
                <EmergencyAlertUsage />
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
            <Button variant="outline" onClick={handleCloseDialog}>
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
