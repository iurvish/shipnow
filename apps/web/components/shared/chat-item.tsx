import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Check, RefreshCw, User, Bot } from "lucide-react";
import { ChatResponseComponent } from "./chat-response";
import { ChatResponse } from "@/lib/actions/chat-actions";

interface ChatItemProps {
  content: string;
  role: "user" | "assistant";
  isLoading?: boolean;
  chatResponse?: ChatResponse;
  onRegenerate?: () => Promise<void>;
}

const CHAR_LIMIT = 300;

const ChatItem: React.FC<ChatItemProps> = ({
  content,
  role,
  isLoading = false,
  chatResponse,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    if (onRegenerate) {
      await onRegenerate();
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const isLongUserMessage = role === "user" && content.length > CHAR_LIMIT;
  const displayContent =
    isLongUserMessage && !expanded
      ? content.slice(0, CHAR_LIMIT).trim() + "..."
      : content;

  return (
    <div
      className={`flex items-start gap-4 ${role === "assistant" ? "bg-muted/30" : ""} p-4`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className={`w-8 h-8 flex items-center justify-center ${
            role === "assistant"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
            borderRadius: "0px",
          }}
        >
          {role === "assistant" ? (
            <Bot className="h-4 w-4" />
          ) : (
            <User className="h-4 w-4" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow max-w-full overflow-hidden">
        {isLoading ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 bg-primary animate-pulse"
                style={{ borderRadius: "0px" }}
              />
              <span className="text-sm text-muted-foreground">
                AI is searching for people...
              </span>
            </div>
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
          </div>
        ) : (
          <div>
            {/* Text Content */}
            <div
              className={`${isLongUserMessage ? "cursor-pointer" : ""}`}
              onClick={isLongUserMessage ? toggleExpand : undefined}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {displayContent}
              </p>
              {isLongUserMessage && (
                <p className="text-primary mt-2 text-sm hover:underline">
                  {expanded ? "Show Less" : "Show More"}
                </p>
              )}
            </div>

            {/* Chat Response Component */}
            {chatResponse && (
              <div className="mt-6">
                <ChatResponseComponent response={chatResponse} />
              </div>
            )}
          </div>
        )}

        {/* Action Buttons for Assistant Messages */}
        {role === "assistant" && !isLoading && (
          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 border-muted-foreground/20"
              style={{ borderRadius: "0px" }}
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
            </Button>

            {onRegenerate && (
              <Button
                onClick={handleRegenerate}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 border-muted-foreground/20"
                style={{ borderRadius: "0px" }}
              >
                <RefreshCw className="h-3 w-3" />
                <span className="text-xs">Regenerate</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
