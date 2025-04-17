
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Message, User } from "@/types";

type AudioData = {
  blob: Blob;
  url: string;
};

interface VoiceChannelState {
  isTransmitting: boolean;
  isReceiving: boolean;
  isMuted: boolean;
  activeTransmitters: User[];
  recentMessages: Message[];
  toggleMute: () => void;
  startTransmission: () => void;
  stopTransmission: () => void;
}

export function useVoiceChannel(channelId: string): VoiceChannelState {
  const { user } = useAuth();
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTransmitters, setActiveTransmitters] = useState<User[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  
  // Refs for audio handling
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new AudioContext();
      audioElementRef.current = new Audio();
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Load recent voice messages
  useEffect(() => {
    if (!channelId || !user) return;

    const loadRecentMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('id, sender_id, type, audio_url, created_at, profiles(full_name)')
          .eq('channel_id', channelId)
          .eq('type', 'audio')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        const formattedMessages: Message[] = (data || []).map((msg: any) => ({
          id: msg.id,
          senderId: msg.sender_id,
          senderName: msg.profiles?.full_name,
          channelId,
          type: 'audio',
          audioUrl: msg.audio_url,
          createdAt: msg.created_at,
        }));

        setRecentMessages(formattedMessages);
      } catch (error: any) {
        console.error('Error loading recent voice messages:', error);
      }
    };

    loadRecentMessages();
  }, [channelId, user]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!channelId || !user || !user.communityId) return;

    // Setup realtime subscription
    const channel = supabase.channel(`voice-${channelId}`);
    
    // Handle presence for active transmitters
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const transmitters: User[] = [];
        
        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            if (presence.isTransmitting && presence.user.id !== user.id) {
              transmitters.push(presence.user);
            }
          });
        });
        
        setActiveTransmitters(transmitters);
        setIsReceiving(transmitters.length > 0);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined the channel:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left the channel:', leftPresences);
      })
      .on('broadcast', { event: 'voice-data' }, handleVoiceData)
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user: {
              id: user.id,
              fullName: user.fullName,
            },
            isTransmitting: false,
          });
        }
      });

    // Subscribe to messages table changes
    const messagesSubscription = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${channelId}`,
      }, payload => {
        if (payload.new && payload.new.type === 'audio') {
          fetchMessageDetails(payload.new.id);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(messagesSubscription);
    };
  }, [channelId, user]);

  // Fetch full message details including sender name
  const fetchMessageDetails = async (messageId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, profiles(full_name)')
        .eq('id', messageId)
        .single();

      if (error) throw error;

      const newMessage: Message = {
        id: data.id,
        senderId: data.sender_id,
        senderName: data.profiles?.full_name,
        channelId: data.channel_id,
        type: 'audio',
        audioUrl: data.audio_url,
        createdAt: data.created_at,
      };

      setRecentMessages(prev => [newMessage, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Error fetching message details:', error);
    }
  };

  // Handle incoming voice data
  const handleVoiceData = (payload: any) => {
    if (!audioContextRef.current || isMuted) return;
    
    const { audio, senderId } = payload;
    
    // Don't play own audio
    if (senderId === user?.id) return;
    
    try {
      // Convert base64 to array buffer
      const binaryString = atob(audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Play the audio
      audioContextRef.current.decodeAudioData(bytes.buffer, (buffer) => {
        const source = audioContextRef.current!.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current!.destination);
        source.start(0);
      });
    } catch (error) {
      console.error('Error playing voice data:', error);
    }
  };

  // Start voice transmission
  const startTransmission = useCallback(async () => {
    if (!user || isTransmitting) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Start recording
      mediaRecorderRef.current.start(100);
      
      setIsTransmitting(true);
      
      // Update presence state
      const channelSub = supabase.channel(`voice-${channelId}`);
      
      await channelSub.track({
        user: {
          id: user.id,
          fullName: user.fullName,
        },
        isTransmitting: true,
      });

      // Broadcast voice data chunk periodically 
      const broadcastInterval = setInterval(async () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          
          reader.onloadend = async () => {
            const base64data = (reader.result as string)?.split(',')[1];
            
            await channelSub.send({
              type: 'broadcast',
              event: 'voice-data',
              payload: {
                senderId: user.id,
                audio: base64data,
              },
            });
          };
          
          reader.readAsDataURL(audioBlob);
          audioChunksRef.current = []; // Clear for next chunk
        }
      }, 200);

      return () => clearInterval(broadcastInterval);
    } catch (error: any) {
      console.error('Error starting voice transmission:', error);
      toast.error('Failed to start microphone. Please check permissions.');
      setIsTransmitting(false);
    }
  }, [user, isTransmitting, channelId]);

  // Stop voice transmission
  const stopTransmission = useCallback(async () => {
    if (!isTransmitting || !mediaRecorderRef.current) return;

    try {
      // Stop the media recorder
      mediaRecorderRef.current.stop();
      
      // Reset transmitting state
      setIsTransmitting(false);
      
      // Update presence state
      const channelSub = supabase.channel(`voice-${channelId}`);
      await channelSub.track({
        user: {
          id: user!.id,
          fullName: user!.fullName,
        },
        isTransmitting: false,
      });
      
      // Save the recorded audio
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      if (audioBlob.size > 100) { // Only save if there's actual content
        // Upload to Supabase Storage
        const fileName = `${user!.id}-${new Date().getTime()}.webm`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('voice-messages')
          .upload(`${channelId}/${fileName}`, audioBlob);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('voice-messages')
          .getPublicUrl(`${channelId}/${fileName}`);
        
        // Save metadata to database
        const { error: insertError } = await supabase.from('messages').insert({
          sender_id: user!.id,
          channel_id: channelId,
          type: 'audio',
          audio_url: publicUrlData.publicUrl,
        });
        
        if (insertError) throw insertError;
      }
      
      // Release microphone access
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
      audioChunksRef.current = [];
    } catch (error: any) {
      console.error('Error stopping voice transmission:', error);
      toast.error('Failed to save voice message.');
    }
  }, [isTransmitting, channelId, user]);

  // Toggle mute state
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    
    if (!isMuted) {
      toast.info('Voice channel muted');
    } else {
      toast.info('Voice channel unmuted');
    }
  }, [isMuted]);

  return {
    isTransmitting,
    isReceiving,
    isMuted,
    activeTransmitters,
    recentMessages,
    toggleMute,
    startTransmission,
    stopTransmission
  };
}
