import { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  status?: 'sent' | 'delivered' | 'read';
  reactions?: Record<string, string>;
}

const Index = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch messages
  const { data: messages = [] } = useQuery({
    queryKey: ['messages'],
    queryFn: api.getMessages,
    refetchInterval: 3000 // Poll every 3 seconds
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: api.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    sendMessageMutation.mutate(content);
  };

  const handleFileUpload = async (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const content = file.type.startsWith('image') 
      ? `<img src="${objectUrl}" alt="uploaded" class="max-w-xs rounded-lg" />`
      : `<div class="flex items-center space-x-2 p-2 bg-white/10 rounded-lg">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
          <span>${file.name}</span>
        </div>`;
    
    sendMessageMutation.mutate(content);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId");
    navigate("/login");
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
            {messages.map((message: Message) => (
              <ChatMessage
                key={message.id}
                id={message.id}
                content={message.content}
                timestamp={new Date(message.created_at).toLocaleTimeString()}
                isOwn={message.sender_id === localStorage.getItem('userId')}
                status={message.status}
                reactions={message.reactions}
              />
            ))}
          </div>
          <ChatInput 
            onSendMessage={handleSendMessage} 
            onFileSelect={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;