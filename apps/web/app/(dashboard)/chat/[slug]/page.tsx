"use client";
import React, { useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { useSessionUser } from "@/hooks/use-session-user";

import ChatMessages, { ChatMessage } from "@/components/shared/chat-messages";
import AIInputSearch from "@/components/shared/ai-input-search";
import { ChatResponse } from "@/lib/actions/chat-actions";
import { getChatBySlug, getChatMessages } from "@/lib/actions/chat-management";

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
  initialMessage: string | null;
  initialMessageProcessed: boolean;
  chatLoading: boolean;
  chat: any;
  slug: string;
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
  initialMessage,
  initialMessageProcessed,
  chatLoading,
  chat,
  slug,
}: ChatPageContentProps) {
  const { setMessages: setArtifactMessages } = useSimpleArtifact();

  // Update artifact context with messages whenever they change
  useEffect(() => {
    setArtifactMessages(messages);
  }, [messages, setArtifactMessages]);

  // Show loading state while user is being fetched or chat is loading (but not if we have initialMessage)
  if (((userLoading && !initialMessage) || chatLoading) && !initialMessage) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {chatLoading ? "Loading chat..." : "Loading your profile..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error state if user is not authenticated (only if no initial message and not loading)
  if (!sessionUser && !userLoading && !initialMessage) {
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
            initialMessage={
              !initialMessageProcessed ? initialMessage || undefined : undefined
            }
            chatId={chat?.id}
            slug={slug}
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
  const [chatLoading, setChatLoading] = useState(true);
  const { user: sessionUser, loading: userLoading } = useSessionUser();

  // Load existing chat data when component mounts (only if no initialMessage)
  useEffect(() => {
    const loadChatData = async () => {
      if (!slug || userLoading || initialMessage) return;

      setChatLoading(true);

      try {
        // Try to get existing chat by slug
        const { chat: existingChat, success } = await getChatBySlug(slug);

        if (success && existingChat) {
          setChat(existingChat);

          // Load chat messages
          const { messages: chatMessages, success: messagesSuccess } =
            await getChatMessages(existingChat.id);

          if (messagesSuccess && chatMessages) {
            // Convert database messages to ChatMessage format
            const formattedMessages: ChatMessage[] = chatMessages.map(
              (msg: any) => ({
                id: msg.id,
                content: msg.content,
                role: msg.role,
                chatResponse: msg.metadata,
                timestamp: new Date(msg.created_at),
              })
            );
            setMessages(formattedMessages);
          }
        }
      } catch (error) {
        console.error("Error loading chat:", error);
      } finally {
        setChatLoading(false);
      }
    };

    loadChatData();
  }, [slug, userLoading, initialMessage]);

  // Process initial message when page loads - only if no existing chat
  useEffect(() => {
    const processInitialMessage = () => {
      if (
        initialMessageProcessed ||
        !initialMessage ||
        userLoading ||
        chatLoading ||
        chat
      ) {
        return;
      }

      setInitialMessageProcessed(true);

      // Add user message to UI immediately
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content: initialMessage,
        role: "user",
        timestamp: new Date(),
      };
      setMessages([userMessage]);

      // Clean up URL
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("initialMessage");
        window.history.replaceState({}, "", url.toString());
      }
    };

    processInitialMessage();
  }, [userLoading, initialMessage, initialMessageProcessed, chatLoading, chat]);

  const handleUserMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
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
        initialMessage={initialMessage}
        initialMessageProcessed={initialMessageProcessed}
        chatLoading={chatLoading}
        chat={chat}
        slug={slug}
      />
    </SimpleArtifactProvider>
  );
};

export default Page;
