
import { useState } from "react";
import { Megaphone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Channel, Message } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMessages, broadcastAnnouncement } from "@/services/communicationService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

interface AnnouncementPanelProps {
  channel: Channel;
}

export default function AnnouncementPanel({ channel }: AnnouncementPanelProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [announcement, setAnnouncement] = useState("");
  
  // Check if the user can make announcements
  const canMakeAnnouncements = 
    user?.role === "community_leader" || 
    user?.role === "admin" || 
    user?.role === "community_manager" ||
    user?.role === "security_personnel";
  
  // Fetch announcements
  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements", channel.id],
    queryFn: () => fetchMessages(channel.id),
    enabled: !!channel.id,
  });
  
  // Handle sending announcement
  const announcementMutation = useMutation({
    mutationFn: (content: string) => 
      broadcastAnnouncement(user?.communityId || "", user?.id || "", content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setAnnouncement("");
    },
  });
  
  const handleSendAnnouncement = () => {
    if (!announcement.trim()) return;
    announcementMutation.mutate(announcement);
  };
  
  return (
    <div className="space-y-4">
      <div className="pb-2 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <Megaphone size={18} /> Community Announcements
        </h3>
        <p className="text-sm text-muted-foreground">
          Important updates and information for all community members
        </p>
      </div>
      
      {canMakeAnnouncements && (
        <div className="bg-muted/50 rounded-lg p-4">
          <Textarea
            placeholder="Write an announcement to the entire community..."
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="min-h-[100px] mb-2"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSendAnnouncement}
              disabled={!announcement.trim() || announcementMutation.isPending}
              className="flex items-center gap-1"
            >
              <Megaphone size={16} /> Broadcast Announcement
            </Button>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No announcements have been made yet.</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <Alert key={announcement.id} variant="default">
              <div className="flex justify-between items-start">
                <AlertTitle className="mb-2">{announcement.senderName || "Community Leader"}</AlertTitle>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(announcement.createdAt), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              <AlertDescription className="whitespace-pre-wrap">
                {announcement.content}
              </AlertDescription>
            </Alert>
          ))
        )}
      </div>
    </div>
  );
}
