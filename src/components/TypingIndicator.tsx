import { cn } from "@/lib/utils";

export const TypingIndicator = ({ isTyping }: { isTyping: boolean }) => {
  if (!isTyping) return null;

  return (
    <div className="flex items-center space-x-2 p-2 animate-fade-in">
      <div className="text-sm text-gray-500">typing</div>
      <div className="flex space-x-1">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={cn(
              "w-1.5 h-1.5 bg-gray-400 rounded-full",
              "animate-[bounce_1.4s_ease-in-out_infinite]"
            )}
            style={{ animationDelay: `${dot * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};