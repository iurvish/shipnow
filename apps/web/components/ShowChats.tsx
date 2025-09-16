"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSessionUser } from "@/hooks/use-session-user";
import { AnimatePresence, motion } from "framer-motion";

import ChatMessages, { ChatMessage } from "@/components/shared/chat-messages";
import AIInputSearch from "@/components/shared/ai-input-search-simple";
import {
  ChatResponse,
  generatePeopleSuggestions,
} from "@/lib/actions/chat-actions";
import {
  getChatBySlug,
  getChatMessages,
  createChatWithFirstMessage,
  saveChatMessage,
} from "@/lib/actions/chat-management";

import {
  SimpleArtifactProvider,
  useSimpleArtifact,
} from "@/hooks/use-user-detail-panel";
import { SimpleArtifactPanel } from "@/components/panels/user-detail-panel";

interface ShowChatsProps {
  slug: string;
}

const ShowChats = ({ slug }: ShowChatsProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chat, setChat] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(true);
  const [initialMessageProcessed, setInitialMessageProcessed] = useState(false);

  const { user: sessionUser, loading: userLoading } = useSessionUser();
  const { setMessages: setArtifactMessages } = useSimpleArtifact();

  const searchParams = useSearchParams();
  const initialMessage = searchParams.get("initialMessage");
  const initialMessageProcessedRef = useRef(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Update artifact context with messages whenever they change
  useEffect(() => {
    setArtifactMessages(messages);
  }, [messages, setArtifactMessages]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Load existing chat data when component mounts
  useEffect(() => {
    const loadChatData = async () => {
      if (!slug || userLoading) return;

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
  }, [slug, userLoading]);

  // Process initial message when page loads
  useEffect(() => {
    const processInitialMessage = async () => {
      if (
        initialMessage &&
        !initialMessageProcessedRef.current &&
        !userLoading &&
        !chatLoading &&
        sessionUser?.id
      ) {
        initialMessageProcessedRef.current = true;
        setInitialMessageProcessed(true);
        await handleSubmit(initialMessage);
      }
    };

    processInitialMessage();
  }, [initialMessage, userLoading, chatLoading, sessionUser?.id]);

  const handleSubmit = async (userInput: string) => {
    if (!sessionUser?.id) return;

    // Generate temporary ID for user message
    const tempUserMessageId = `user-${Date.now()}`;

    // Immediately add user message
    const newUserMessage: ChatMessage = {
      id: tempUserMessageId,
      content: userInput,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    // Don't add empty assistant message - let ChatMessages handle loading state
    setIsLoading(true);

    try {
      let currentChatId = chat?.id;

      // Create new chat if we don't have one
      if (!currentChatId) {
        const { chat: newChat, success } = await createChatWithFirstMessage(
          sessionUser.id,
          userInput,
          slug
        );

        if (success && newChat) {
          setChat(newChat);
          currentChatId = newChat.id;
        }
      } else {
        // Save user message to existing chat
        await saveChatMessage(currentChatId, "user", userInput);
      }

      // Generate AI response
      const response = await generatePeopleSuggestions(
        userInput,
        sessionUser.id
      );

      // Save AI response message
      if (currentChatId) {
        await saveChatMessage(
          currentChatId,
          "assistant",
          response.message || "Here are the people I found:",
          response
        );
      }

      // Add the assistant message with the actual response
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
      setMessages((prevMessages) => [...prevMessages, aiMessage]);

      // Clean up URL if initial message
      if (
        typeof window !== "undefined" &&
        initialMessage &&
        !initialMessageProcessed
      ) {
        const url = new URL(window.location.href);
        url.searchParams.delete("initialMessage");
        window.history.replaceState({}, "", url.toString());
      }
    } catch (error) {
      console.error("Error sending data:", error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        content:
          "Sorry, something went wrong while searching for people. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserMessage = (content: string) => {
    // This will be called by AIInputSearch, then we call handleSubmit
    handleSubmit(content);
  };

  const handleAIResponse = (response: ChatResponse) => {
    // This is kept for compatibility but not used since we handle responses in handleSubmit
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

  // Show loading state while user is being fetched or chat is loading (but not if we have initialMessage)
  if ((userLoading || (chatLoading && !initialMessage)) && !initialMessage) {
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
        <div
          className="flex-1 overflow-y-auto pb-24 bg-transparent"
          ref={messagesContainerRef}
        >
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
            onSearch={handleUserMessage} // Use onSearch instead of API calls
            disabled={isLoading || userLoading || !sessionUser}
            placeholder="Search people you're looking for..."
          />
        </div>
      </div>

      {/* Simple Artifact Panel */}
      <SimpleArtifactPanel />
    </div>
  );
};

export default ShowChats;
