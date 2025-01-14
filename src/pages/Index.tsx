import { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { query } from "@/utils/dbConnection";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  contentType?: 'text' | 'image' | 'file' | 'voice';
}

const Index = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // Fetch messages
  const { data: messages = [], refetch } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const result = await query(
        'SELECT m.*, u.id as sender_id FROM messages m JOIN users u ON m.sender_id = u.id ORDER BY m.created_at DESC LIMIT 50'
      );
      return result.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        timestamp: new Date(msg.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        isOwn: msg.sender_id === localStorage.getItem('userId'),
        contentType: msg.content_type
      }));
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const userId = localStorage.getItem('userId');
      const result = await query(
        'INSERT INTO messages (id, conversation_id, sender_id, content) VALUES (UUID(), ?, ?, ?)',
        ['default', userId, content]
      );
      return result;
    },
    onSuccess: () => {
      refetch();
      toast.success("Message sent successfully");
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    }
  });

  // File upload mutation
  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      // In a real app, you would upload to a server here
      // For now, we'll just create a local URL
      const objectUrl = URL.createObjectURL(file);
      
      const userId = localStorage.getItem('userId');
      const contentType = file.type.startsWith('image') ? 'image' : 'file';
      
      let content = '';
      if (contentType === 'image') {
        content = `<img src="${objectUrl}" alt="uploaded" class="max-w-xs rounded-lg" />`;
      } else {
        content = `<div class="flex items-center space-x-2 p-2 bg-white/10 rounded-lg">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
          <span>${file.name}</span>
        </div>`;
      }

      const result = await query(
        'INSERT INTO messages (id, conversation_id, sender_id, content, content_type) VALUES (UUID(), ?, ?, ?, ?)',
        ['default', userId, content, contentType]
      );
      return result;
    },
    onSuccess: () => {
      refetch();
      toast.success("File uploaded successfully");
    },
    onError: (error) => {
      console.error('Error uploading file:', error);
      toast.error("Failed to upload file");
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleSendMessage = (content: string) => {
    sendMessageMutation.mutate(content);
  };

  const handleFileUpload = async (file: File) => {
    uploadFileMutation.mutate(file);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5')] 
        bg-cover bg-center bg-no-repeat opacity-80"
      />
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30" />
      
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="ghost" 
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="flex h-screen relative z-0">
        <ChatSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
        <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-md">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                id={message.id}
                content={message.content}
                timestamp={message.timestamp}
                isOwn={message.isOwn}
              />
            ))}
          </div>
          <ChatInput onSendMessage={handleSendMessage} onFileSelect={handleFileUpload} />
        </div>
      </div>
    </div>
  );
};

export default Index;