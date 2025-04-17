
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Channel } from "@/types";
import { fetchChannels, fetchDirectMessages } from "@/services/communicationService";
import ChannelList from "@/components/communication/ChannelList";
import DirectMessagesList from "@/components/communication/DirectMessagesList";
import MessagePanel from "@/components/communication/MessagePanel";
import EmergencyContacts from "@/components/communication/EmergencyContacts";
import AnnouncementPanel from "@/components/communication/AnnouncementPanel";
import { useAuth } from "@/contexts/AuthContext";

export default function Communication() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { channelId } = useParams<{ channelId: string }>();
  const [activeTab, setActiveTab] = useState("channels");
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  // Fetch channels for the user's community
  const { data: channels = [] } = useQuery({
    queryKey: ["channels", user?.communityId],
    queryFn: () => fetchChannels(user?.communityId || ""),
    enabled: !!user?.communityId,
  });

  // Fetch direct messages for the user
  const { data: directMessages = [] } = useQuery({
    queryKey: ["directMessages", user?.id],
    queryFn: () => fetchDirectMessages(user?.id || ""),
    enabled: !!user?.id,
  });

  // Handle channel selection
  useEffect(() => {
    if (channelId) {
      const channel = [...channels, ...directMessages].find(c => c.id === channelId);
      if (channel) {
        setSelectedChannel(channel);
        setActiveTab(channel.type === "direct" ? "direct" : "channels");
      }
    }
  }, [channelId, channels, directMessages]);

  // Navigate to a specific channel
  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    navigate(`/communication/${channel.id}`);
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gradient">Communication</h1>
        <p className="text-muted-foreground">
          Stay connected with your community members and security team
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left sidebar: Channels and DMs */}
        <Card className="p-4 md:col-span-1">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="direct">Direct</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
            </TabsList>
            
            <TabsContent value="channels" className="mt-0">
              <ChannelList 
                channels={channels.filter(c => c.type !== "direct")} 
                selectedChannelId={selectedChannel?.id}
                onSelectChannel={handleChannelSelect}
              />
            </TabsContent>
            
            <TabsContent value="direct" className="mt-0">
              <DirectMessagesList 
                directMessages={directMessages} 
                selectedChannelId={selectedChannel?.id}
                onSelectChannel={handleChannelSelect}
              />
            </TabsContent>
            
            <TabsContent value="emergency" className="mt-0">
              <EmergencyContacts />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Right panel: Messages or Announcements */}
        <Card className="p-4 md:col-span-2">
          {selectedChannel ? (
            selectedChannel.type === "announcements" ? (
              <AnnouncementPanel channel={selectedChannel} />
            ) : (
              <MessagePanel channel={selectedChannel} />
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-muted-foreground">Select a channel or start a new conversation</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
