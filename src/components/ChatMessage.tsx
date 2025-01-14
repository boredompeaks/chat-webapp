import { cn } from "@/lib/utils";
import { useState } from "react";
import { Smile, Check, CheckCheck } from "lucide-react";
import { toast } from "sonner";

interface ChatMessageProps {
  id: string;
  content: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  reactions?: Record<string, string>;
  isOwn?: boolean;
}

export const ChatMessage = ({ 
  id, 
  content, 
  timestamp, 
  status = 'sent',
  reactions = {},
  isOwn = false 
}: ChatMessageProps) => {
  const [showReactions, setShowReactions] = useState(false);

  const handleReact = async (emoji: string) => {
    try {
      const response = await fetch(`/api/messages/${id}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reaction: emoji })
      });

      if (!response.ok) throw new Error('Failed to react');
      
      toast.success('Reaction added!');
      setShowReactions(false);
    } catch (error) {
      toast.error('Failed to add reaction');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'sent':
        return <Check className="h-4 w-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-4 w-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex mb-4 animate-message-appear group",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "max-w-[70%] rounded-2xl px-4 py-2 backdrop-blur-sm",
            isOwn
              ? "bg-primary/80 text-white rounded-br-none"
              : "bg-white/80 text-gray-800 rounded-bl-none"
          )}
        >
          <div 
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          
          <div className="flex items-center justify-between mt-1">
            <span
              className={cn(
                "text-xs",
                isOwn ? "text-primary-foreground/80" : "text-gray-500"
              )}
            >
              {timestamp}
            </span>
            {isOwn && (
              <span className="ml-2">{getStatusIcon()}</span>
            )}
          </div>

          {Object.keys(reactions).length > 0 && (
            <div className="flex -space-x-1 mt-1">
              {Object.values(reactions).map((reaction, index) => (
                <span
                  key={index}
                  className="inline-block bg-white/90 rounded-full px-2 py-1 text-xs"
                >
                  {reaction}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowReactions(!showReactions)}
          className={cn(
            "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
            isOwn ? "-left-8" : "-right-8"
          )}
        >
          <Smile className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        </button>

        {showReactions && (
          <div
            className={cn(
              "absolute top-0 bg-white rounded-full shadow-lg px-2 py-1 z-10",
              isOwn ? "-left-24" : "-right-24"
            )}
          >
            {["❤️", "👍", "😂", "😮", "😢", "🙏"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                className="hover:scale-125 transition-transform px-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};