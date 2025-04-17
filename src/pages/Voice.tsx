
import React, { useState, useEffect } from "react";
import VoiceChannel from "@/components/voice/VoiceChannel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Channel } from "@/types";
import { RadioTower, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Voice() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelType, setNewChannelType] = useState<Channel["type"]>("general_chat");

  // Fetch available channels
  useEffect(() => {
    const fetchChannels = async () => {
      if (!user?.communityId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("channels")
          .select("*")
          .eq("community_id", user.communityId)
          .order("name");

        if (error) throw error;

        // Transform the data to match Channel type
        const transformedChannels: Channel[] = (data || []).map(channel => ({
          id: channel.id,
          communityId: channel.community_id,
          name: channel.name,
          type: channel.type as Channel["type"]
        }));

        setChannels(transformedChannels);
        
        // Select the first channel by default if there are channels
        if (transformedChannels.length > 0 && !selectedChannelId) {
          setSelectedChannelId(transformedChannels[0].id);
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, [user?.communityId]);

  const handleCreateChannel = async () => {
    if (!user?.communityId || !newChannelName.trim()) return;

    try {
      setIsCreatingChannel(true);

      const { data, error } = await supabase
        .from("channels")
        .insert({
          name: newChannelName.trim(),
          community_id: user.communityId,
          type: newChannelType,
        })
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        const newChannel: Channel = {
          id: data.id,
          communityId: data.community_id,
          name: data.name,
          type: data.type as Channel["type"]
        };

        setChannels([...channels, newChannel]);
        setSelectedChannelId(newChannel.id);
        toast.success(`Channel "${newChannelName}" created`);
        setNewChannelName("");
        setNewChannelType("general_chat");
      }
    } catch (error: any) {
      console.error("Error creating channel:", error);
      toast.error("Failed to create channel");
    } finally {
      setIsCreatingChannel(false);
    }
  };

  const selectedChannel = channels.find(channel => channel.id === selectedChannelId);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Community Voice Channels</h1>
        <p className="text-muted-foreground">
          Push-to-Talk communication with other community members
        </p>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <Select
            value={selectedChannelId}
            onValueChange={setSelectedChannelId}
            disabled={isLoading || channels.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a voice channel" />
            </SelectTrigger>
            <SelectContent>
              {channels.map((channel) => (
                <SelectItem key={channel.id} value={channel.id}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <Plus className="h-4 w-4" />
              <span>New Channel</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Voice Channel</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="channel-name">Channel Name</Label>
                <Input
                  id="channel-name"
                  placeholder="Enter channel name"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Channel Type</Label>
                <RadioGroup
                  value={newChannelType}
                  onValueChange={(value) => setNewChannelType(value as Channel["type"])}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general_chat" id="general" />
                    <Label htmlFor="general">General Chat</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="security_patrol" id="security" />
                    <Label htmlFor="security">Security Patrol</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alerts_only" id="alerts" />
                    <Label htmlFor="alerts">Alerts Only</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewChannelName("")}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateChannel} 
                disabled={!newChannelName.trim() || isCreatingChannel}
              >
                Create Channel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex justify-center items-center h-48">
            <p>Loading channels...</p>
          </CardContent>
        </Card>
      ) : channels.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Voice Channels</CardTitle>
            <CardDescription>
              Create a new voice channel to start communication
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-40">
            <RadioTower className="h-16 w-16 text-muted-foreground/40" />
          </CardContent>
        </Card>
      ) : selectedChannel ? (
        <VoiceChannel channel={selectedChannel} />
      ) : (
        <Card>
          <CardContent className="flex justify-center items-center h-48">
            <p>Select a channel to start communication</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
