"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ChatMessage, Attachment } from "@/lib/types";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { VisibilityType } from "./visibility-selector";

interface MultimodalInputProps {
  chatId: string;
  input: string;
  setInput: (input: string) => void;
  status: UseChatHelpers<ChatMessage>["status"];
  stop: UseChatHelpers<ChatMessage>["stop"];
  attachments: Attachment[];
  setAttachments: (attachments: Attachment[]) => void;
  messages: ChatMessage[];
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  className?: string;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  selectedVisibilityType: VisibilityType;
}

export function MultimodalInput({
  input,
  setInput,
  sendMessage,
  className,
}: MultimodalInputProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="min-h-[60px] resize-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage({ content: input });
          }
        }}
      />
      <Button
        onClick={() => sendMessage({ content: input })}
        disabled={!input.trim()}
      >
        Send
      </Button>
    </div>
  );
}
