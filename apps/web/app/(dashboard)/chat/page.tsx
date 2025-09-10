"use client";

import React, { useState, useEffect } from "react";
import ChatMessages, { ChatMessage } from "@/components/shared/chat-messages";
import AIInputSearch from "@/components/shared/ai-input-search";
import {
  SimpleArtifactProvider,
  useSimpleArtifact,
} from "../../../hooks/use-user-detail-panel";
import { SimpleArtifactPanel } from "@/components/panels/user-detail-panel";
import { ChatResponse } from "@/lib/actions/chat-actions";

interface ChatPageContentProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleUserMessage: (content: string) => void;
  handleAIResponse: (response: ChatResponse) => void;
}

function ChatPageContent({
  messages,
  setMessages,
  isLoading,
  setIsLoading,
  handleUserMessage,
  handleAIResponse,
}: ChatPageContentProps) {
  const { setMessages: setArtifactMessages } = useSimpleArtifact();

  // Update artifact context with messages whenever they change
  useEffect(() => {
    setArtifactMessages(messages);
  }, [messages, setArtifactMessages]);

  return (
    <div className="flex h-full relative">
      {/* Main Chat Content */}
      <div className="hide-scrollbar w-full flex flex-col justify-between h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.75rem)] min-h-0 bg-transparent">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto pb-24 bg-transparent">
          <div className="max-w-6xl mx-auto">
            {messages.length === 0 && !isLoading ? (
              /* Welcome Message */
              <div className="flex justify-center pt-20">
                <div
                  className="bg-muted/30 p-8 max-w-md text-center"
                  style={{ borderRadius: "0px" }}
                >
                  <h3 className="font-semibold mb-3 text-lg">
                    Welcome to People Finder
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tell me about the kind of people you're looking for and I'll
                    search our database to find the perfect matches!
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      <strong>Try asking:</strong>
                    </p>
                    <p>"Find me React developers"</p>
                    <p>"I need experienced UX designers"</p>
                    <p>"Suggest some data scientists"</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Chat Messages without regenerate */
              <ChatMessages
                messages={messages}
                isLoading={isLoading}
                loadingMessage="Searching for people..."
              />
            )}
          </div>
        </div>

        {/* Sticky Input Area */}
        <div className="lg:w-[88%] xl:w-[80%] md:w-full w-full mx-auto bg-transparent">
          <AIInputSearch
            onResponse={handleAIResponse}
            onUserMessage={handleUserMessage}
            onLoadingChange={setIsLoading}
            disabled={isLoading}
            placeholder="Search people you're looking for..."
          />
        </div>
      </div>

      {/* Simple Artifact Panel */}
      <SimpleArtifactPanel />
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    // Loading state is now handled by AIInputSearch component via onLoadingChange
  };

  const handleAIResponse = (response: ChatResponse) => {
    // Loading state is now handled by AIInputSearch component via onLoadingChange

    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      content:
        response.message ||
        (response.query_type === "people_search"
          ? "Here are the people I found:"
          : ""),
      role: "assistant",
      chatResponse: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  return (
    <SimpleArtifactProvider 
      sendMessage={handleUserMessage}
      onAIResponse={handleAIResponse}
    >
      <ChatPageContent
        messages={messages}
        setMessages={setMessages}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        handleUserMessage={handleUserMessage}
        handleAIResponse={handleAIResponse}
      />
    </SimpleArtifactProvider>
  );
}
