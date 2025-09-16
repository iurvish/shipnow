"use client";

import React from "react";
import ChatItem from "@/components/shared/chat-item";
import { ChatResponse } from "@/lib/actions/chat-actions";
import AIInputSearch from "./ai-input-search";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  chatResponse?: ChatResponse;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  loadingMessage?: string;
}

export default function ChatMessages({
  messages,
  isLoading = false,
  loadingMessage = "Searching for people...",
}: ChatMessagesProps) {
  return (
    <div className="space-y-0">
      {messages.map((message, idx) => (
        <ChatItem
          key={message.id ? `${message.id}` : `msg-${idx}`}
          content={message.content}
          role={message.role}
          chatResponse={message.chatResponse}
        />
      ))}

      {/* Loading State */}
      {isLoading && (
        <ChatItem content={loadingMessage} role="assistant" isLoading={true} />
      )}
    </div>
  );
}

export type { ChatMessage, ChatMessagesProps };
