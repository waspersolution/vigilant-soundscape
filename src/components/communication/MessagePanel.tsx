import { useState, useEffect, useRef } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Channel, Message } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMessages, sendMessage } from "@/services/communicationService";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface MessagePanelProps {
  channel: Channel;
}

export default function MessagePanel({ channel }: MessagePanelProps) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: messages = [], refetch } = useQuery({
    queryKey: ["messages", channel.id],
    queryFn: () => fetchMessages(channel.id),
    enabled: !!channel.id,
  });
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  useEffect(() => {
    if (!channel.id) return;
    
    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${channel.id}`,
      }, () => {
        refetch();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channel.id, refetch]);
  
  const handleSendMessage = async () => {
    if (!user?.id || !newMessage.trim()) return;
    
    await sendMessage({
      senderId: user.id,
      channelId: channel.id,
      recipientId: channel.type === "direct" ? channel.participants?.find(id => id !== user.id) : undefined,
      type: "text",
      content: newMessage.trim(),
    });
    
    setNewMessage("");
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here in a real implementation
  };
  
  const getNameInitials = (name: string = "User") => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-250px)]">
      <div className="pb-2 border-b">
        <h3 className="font-semibold">{channel.name}</h3>
        {channel.description && (
          <p className="text-sm text-muted-foreground">{channel.description}</p>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId === user?.id;
            return (
              <div 
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[80%]`}>
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>{getNameInitials(message.senderName)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} text-xs mb-1`}>
                      <span className="font-medium">{isCurrentUser ? 'You' : message.senderName}</span>
                      <span className="text-muted-foreground ml-2">
                        {format(new Date(message.createdAt), 'h:mm a')}
                      </span>
                    </div>
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        isCurrentUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      }`}
                    >
                      {message.type === 'text' ? (
                        <p>{message.content}</p>
                      ) : (
                        <audio controls src={message.audioUrl} className="max-w-full" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="pt-4 border-t mt-auto">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="min-h-[80px]"
          />
          <div className="flex flex-col gap-2">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={toggleRecording}
              title={isRecording ? "Stop recording" : "Start voice recording"}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              title="Send message"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
