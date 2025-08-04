import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Check, RefreshCw, User, Bot, Users, Search } from "lucide-react";
import { DatabasePersonCard } from "./database-person-card";
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

            {/* Database People Results */}
            {chatResponse?.query_type === "people_search" &&
              chatResponse.people &&
              chatResponse.people.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-medium text-foreground">
                      Found {chatResponse.people.length} people in database
                    </h4>
                  </div>

                  {/* Horizontal Scrollable Cards */}
                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-4 min-w-max">
                      {chatResponse.people.map((person) => (
                        <div key={person.id} className="flex-shrink-0 w-80">
                          <DatabasePersonCard person={person} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Query Information */}
                  {chatResponse.explanation && (
                    <div
                      className="mt-4 p-3 bg-muted/50 border border-muted"
                      style={{ borderRadius: "0px" }}
                    >
                      <p className="text-xs text-muted-foreground">
                        <strong>Search explanation:</strong>{" "}
                        {chatResponse.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}

            {/* No Results Message */}
            {chatResponse?.query_type === "people_search" &&
              chatResponse.people &&
              chatResponse.people.length === 0 && (
                <div className="mt-6">
                  <div
                    className="flex flex-col items-center justify-center p-8 bg-muted/30 border border-muted text-center"
                    style={{ borderRadius: "0px" }}
                  >
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h4 className="text-lg font-medium text-foreground mb-2">
                      No People Found
                    </h4>
                    <p className="text-sm text-muted-foreground max-w-md">
                      No people found matching your criteria. Try adjusting your
                      search terms or be more specific about the skills and
                      experience level you're looking for.
                    </p>
                  </div>
                </div>
              )}

            {/* General Question Response */}
            {chatResponse?.query_type === "general_question" &&
              chatResponse.message && (
                <div
                  className="mt-4 p-4 bg-muted/30 border border-muted"
                  style={{ borderRadius: "0px" }}
                >
                  <p className="text-sm text-muted-foreground">
                    {chatResponse.message}
                  </p>
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
