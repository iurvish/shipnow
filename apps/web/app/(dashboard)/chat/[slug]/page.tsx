"use client";
import React, { useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { useSessionUser } from "@/hooks/use-session-user";

import ChatMessages, { ChatMessage } from "@/components/shared/chat-messages";
import AIInputSearch from "@/components/shared/ai-input-search";
import { ChatResponse } from "@/lib/actions/chat-actions";

import {
  SimpleArtifactProvider,
  useSimpleArtifact,
} from "@/hooks/use-user-detail-panel";
import { SimpleArtifactPanel } from "@/components/panels/user-detail-panel";

interface ChatPageContentProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleUserMessage: (content: string) => void;
  handleAIResponse: (response: ChatResponse) => void;
  userLoading: boolean;
  sessionUser: any;
}

function ChatPageContent({
  messages,
  setMessages,
  isLoading,
  setIsLoading,
  handleUserMessage,
  handleAIResponse,
  userLoading,
  sessionUser,
}: ChatPageContentProps) {
  const { setMessages: setArtifactMessages } = useSimpleArtifact();

  // Update artifact context with messages whenever they change
  useEffect(() => {
    setArtifactMessages(messages);
  }, [messages, setArtifactMessages]);

  // Show loading state while user is being fetched
  if (userLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if user is not authenticated
  if (!sessionUser) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Please log in to search for people
          </p>
          <button
            onClick={() => (window.location.href = "/auth/login")}
            className="bg-foreground text-background px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full relative">
      {/* Main Chat Content */}
      <div className="hide-scrollbar w-full flex flex-col justify-between h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.75rem)] min-h-0 bg-transparent">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto pb-24 bg-transparent">
          <div className="max-w-6xl mx-auto">
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              loadingMessage="Searching for people..."
            />
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

const Page = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = React.use(params);
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get("initialMessage");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chat, setChat] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialMessageProcessed, setInitialMessageProcessed] = useState(false);
  const { user: sessionUser, loading: userLoading } = useSessionUser();

  // Process initial message when page loads
  useEffect(() => {
    const processInitialMessage = async () => {
      if (!sessionUser || userLoading || initialMessageProcessed || !initialMessage) {
        return;
      }

      setInitialMessageProcessed(true);
      setIsLoading(true);

      // Add user message to UI immediately
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content: initialMessage,
        role: "user",
        timestamp: new Date(),
      };
      setMessages([userMessage]);

      // Import and call AI response
      try {
        const { generatePeopleSuggestions } = await import("@/lib/actions/chat-actions");
        const response = await generatePeopleSuggestions(initialMessage, sessionUser.id);
        handleAIResponse(response);
      } catch (error) {
        console.error("Error generating AI response:", error);
        // Add error message
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          content: "Sorry, I encountered an error while processing your request. Please try again.",
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        
        // Clean up URL
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.delete("initialMessage");
          window.history.replaceState({}, "", url.toString());
        }
      }
    };

    processInitialMessage();
  }, [sessionUser, userLoading, initialMessage, initialMessageProcessed]);

  const handleUserMessage = async (content: string) => {
    if (!sessionUser) return;

    setIsLoading(true);
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const { generatePeopleSuggestions } = await import("@/lib/actions/chat-actions");
      const response = await generatePeopleSuggestions(content, sessionUser.id);
      handleAIResponse(response);
    } catch (error) {
      console.error("Error generating AI response:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
        userLoading={userLoading}
        sessionUser={sessionUser}
      />
    </SimpleArtifactProvider>
  );
};

export default Page;
