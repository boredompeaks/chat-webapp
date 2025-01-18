import { cn } from "@/lib/utils";
import { useState } from "react";
import { Smile, Check, CheckCheck, MoreVertical, Forward, Reply, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatMessageProps {
  id: string;
  content: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  reactions?: Record<string, string>;
  isOwn?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  forwardedFrom?: string;
  replyTo?: {
    id: string;
    content: string;
    sender: string;
  };
  onEdit?: (id: string, newContent: string) => void;
  onDelete?: (id: string) => void;
  onForward?: (id: string) => void;
  onReply?: (id: string) => void;
}

export const ChatMessage = ({
  id,
  content,
  timestamp,
  status = 'sent',
  reactions = {},
  isOwn = false,
  isEdited = false,
  isDeleted = false,
  forwardedFrom,
  replyTo,
  onEdit,
  onDelete,
  onForward,
  onReply,
}: ChatMessageProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

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

  const handleEdit = () => {
    if (isEditing) {
      onEdit?.(id, editedContent);
      setIsEditing(false);
    } else {
      setIsEditing(true);
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

  if (isDeleted) {
    return (
      <div className="flex mb-4 animate-message-appear opacity-50">
        <div className="px-4 py-2 text-sm text-gray-500 italic">
          This message was deleted
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex mb-4 animate-message-appear group",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div className="relative max-w-[70%]">
        {replyTo && (
          <div className="mb-1 px-4 py-2 bg-gray-100/50 rounded-lg text-sm">
            <div className="font-semibold">{replyTo.sender}</div>
            <div className="truncate">{replyTo.content}</div>
          </div>
        )}
        
        {forwardedFrom && (
          <div className="mb-1 text-sm text-gray-500">
            Forwarded from {forwardedFrom}
          </div>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-2 backdrop-blur-sm",
            isOwn
              ? "bg-primary/60 text-white rounded-br-none"
              : "bg-white/60 text-gray-800 rounded-bl-none"
          )}
        >
          {isEditing ? (
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="bg-transparent border-none focus:outline-none w-full"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEdit();
                if (e.key === 'Escape') setIsEditing(false);
              }}
            />
          ) : (
            <div className="text-sm break-words">{content}</div>
          )}
          
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center space-x-2">
              <span
                className={cn(
                  "text-xs",
                  isOwn ? "text-primary-foreground/80" : "text-gray-500"
                )}
              >
                {timestamp}
              </span>
              {isEdited && (
                <span className="text-xs text-gray-500">(edited)</span>
              )}
            </div>
            {isOwn && (
              <span className="ml-2">{getStatusIcon()}</span>
            )}
          </div>

          {Object.keys(reactions).length > 0 && (
            <div className="flex -space-x-1 mt-1">
              {Object.entries(reactions).map(([user, reaction], index) => (
                <span
                  key={index}
                  className="inline-block bg-white/90 rounded-full px-2 py-1 text-xs"
                  title={user}
                >
                  {reaction}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className={cn(
            "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1",
            isOwn ? "-left-24" : "-right-24"
          )}
        >
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Smile className="h-4 w-4 text-gray-500" />
          </button>
          
          <button
            onClick={() => onReply?.(id)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Reply className="h-4 w-4 text-gray-500" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-gray-100 rounded-full">
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {isOwn && (
                <>
                  <DropdownMenuItem onClick={handleEdit}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete?.(id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={() => onForward?.(id)}>
                <Forward className="h-4 w-4 mr-2" />
                Forward
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {showReactions && (
          <div
            className={cn(
              "absolute top-0 bg-white rounded-full shadow-lg px-2 py-1 z-10",
              isOwn ? "-left-40" : "-right-40"
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