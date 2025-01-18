import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, Mic, Image, Video, FileText } from "lucide-react";
import { toast } from "sonner";
import { debounce } from "lodash";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFileSelect: (file: File) => void;
  onTyping?: (isTyping: boolean) => void;
}

export const ChatInput = ({ onSendMessage, onFileSelect, onTyping }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const debouncedTyping = useRef(
    debounce((typing: boolean) => {
      onTyping?.(typing);
    }, 1000)
  ).current;

  useEffect(() => {
    if (message && onTyping) {
      onTyping(true);
      debouncedTyping(false);
    }
  }, [message, onTyping, debouncedTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      onTyping?.(false);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File size must be less than 10MB");
        return;
      }
      onFileSelect(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info("Voice recording started");
    } else {
      toast.success("Voice recording saved");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-white/20 p-4 backdrop-blur-sm bg-white/10">
      <div className="flex items-center space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        />
        <div className="flex space-x-1">
          <button
            type="button"
            onClick={handleFileClick}
            className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = "image/*";
                fileInputRef.current.click();
              }
            }}
            className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
            title="Send image"
          >
            <Image className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = "video/*";
                fileInputRef.current.click();
              }
            }}
            className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
            title="Send video"
          >
            <Video className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = ".pdf,.doc,.docx";
                fileInputRef.current.click();
              }
            }}
            className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
            title="Send document"
          >
            <FileText className="w-5 h-5" />
          </button>
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 bg-white/20 text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={handleVoiceRecord}
          className={`p-2 hover:bg-white/20 rounded-full transition-colors text-white ${
            isRecording ? "bg-red-500" : ""
          }`}
          title="Voice message"
        >
          <Mic className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
          title="Emoji"
        >
          <Smile className="w-5 h-5" />
        </button>
        <button
          type="submit"
          className="p-2 bg-primary hover:bg-primary/90 rounded-full transition-colors"
          title="Send message"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </form>
  );
};
