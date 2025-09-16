"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Triangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import {
  generatePeopleSuggestions,
  ChatResponse,
} from "@/lib/actions/chat-actions";
import {
  createChatWithFirstMessage,
  saveChatMessage,
} from "@/lib/actions/chat-management";
import { AISuggestion, AISuggestions } from "@/components/ai/suggestions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSessionUser } from "@/hooks/use-session-user";

interface AIInputSearchProps {
  onResponse?: (response: ChatResponse) => void;
  onUserMessage?: (message: string) => void;
  onSearch?: (message: string) => void; // New prop for search without API call
  onLoadingChange?: (isLoading: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
  initialMessage?: string; // Add prop for initial message processing
  chatId?: string; // Add prop for existing chat ID
  slug?: string; // Add prop for chat slug
}

const buttonVariants = {
  hidden: { x: 1, opacity: 0, scale: 0.7 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    x: 1,
    opacity: 0,
    scale: 0.9,
    transition: {
      type: "spring" as const,
      duration: 0.2,
    },
  },
};

export default function AIInputSearch({
  onResponse,
  onUserMessage,
  onSearch, // New prop
  onLoadingChange,
  disabled = false,
  placeholder = "Search people you're looking for...",
  initialMessage, // Add initial message prop
  chatId: existingChatId, // Rename to avoid conflict
  slug, // Add slug prop
}: AIInputSearchProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const [initialProcessed, setInitialProcessed] = useState(false);
  const [chatId, setChatId] = useState<string | null>(existingChatId || null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get current user session
  const { user: sessionUser, loading: userLoading } = useSessionUser();

  // Process initial message if provided
  useEffect(() => {
    const processInitialMessage = async () => {
      if (!initialMessage || initialProcessed || userLoading) {
        return;
      }

      // Wait for user session if not available yet
      if (!sessionUser?.id) {
        return;
      }

      setInitialProcessed(true);
      setIsLoading(true);
      onLoadingChange?.(true);
      setShowSuggestions(false);

      try {
        let currentChatId = chatId;

        // Only create new chat if we don't have one
        if (!currentChatId) {
          const { chat, success } = await createChatWithFirstMessage(
            sessionUser.id,
            initialMessage,
            slug
          );

          if (success && chat) {
            setChatId(chat.id);
            currentChatId = chat.id;
          }
        } else {
          // Save user message to existing chat
          await saveChatMessage(currentChatId, "user", initialMessage);
        }

        const response = await generatePeopleSuggestions(
          initialMessage,
          sessionUser.id
        );

        onResponse?.(response);

        // Save AI response message
        if (currentChatId) {
          await saveChatMessage(
            currentChatId,
            "assistant",
            response.message || "Here are the people I found:",
            response
          );
        }
      } catch (error) {
        console.error("Error processing initial message:", error);
        onResponse?.({
          query_type: "general_question",
          reasoning: "Error occurred",
          message:
            "Sorry, something went wrong while processing your request. Please try again.",
        });
      } finally {
        setIsLoading(false);
        onLoadingChange?.(false);
      }
    };

    processInitialMessage();
  }, [
    initialMessage,
    initialProcessed,
    sessionUser?.id,
    userLoading,
    onResponse,
    onLoadingChange,
  ]);

  // Predefined suggestions
  const suggestions = [
    "Find me React developers",
    "Search for UX designers",
    "Backend engineers with Node.js",
    "Data scientists with Python",
    "Full-stack developers",
    "Frontend engineers with TypeScript",
    "DevOps engineers",
    "Mobile app developers",
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!input.trim() || isLoading || disabled) return;

    const userMessage = input.trim();
    setInput("");

    // If onSearch is provided, just pass the message without API call
    if (onSearch) {
      onSearch(userMessage);
      setShowSuggestions(false);
      return;
    }

    // Otherwise, handle the full API flow
    if (userLoading || !sessionUser?.id) return;

    // Check if user is available
    if (!sessionUser?.id) {
      console.error("User not authenticated");
      onResponse?.({
        query_type: "general_question",
        reasoning: "Authentication required",
        message: "Please log in to search for people.",
      });
      return;
    }

    setIsLoading(true);
    onLoadingChange?.(true); // Notify parent about loading state
    setCurrentStep("");
    setShowSuggestions(false);

    // Reset textarea height to minimum
    if (textareaRef.current) {
      textareaRef.current.style.height = "30px";
      setIsMultiLine(false);
    }

    // Notify parent about user message
    onUserMessage?.(userMessage);

    try {
      const response = await generatePeopleSuggestions(
        userMessage,
        sessionUser.id
      );

      onResponse?.(response);

      // Save both user and AI messages if we have a chatId
      if (chatId) {
        await saveChatMessage(chatId, "user", userMessage);
        await saveChatMessage(
          chatId,
          "assistant",
          response.message || "Here are the people I found:",
          response
        );
      }
    } catch (error) {
      console.error("Error generating suggestions:", error);
      // Handle error state
      onResponse?.({
        query_type: "general_question",
        reasoning: "Error occurred",
        message:
          "Sorry, something went wrong while searching for people. Please try again.",
      });
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false); // Notify parent about loading state end
      setCurrentStep("");
      // Don't show suggestions after a successful search
    }
  };

  const onSuggestion = (suggestion: string) => {
    textareaRef.current?.focus();
    setInput(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea and detect line count
  const adjustHeight = () => {
    if (textareaRef.current) {
      // Only adjust if there's actual content
      if (input.trim().length === 0) {
        textareaRef.current.style.height = "50px";
        setIsMultiLine(false);
        return 50;
      }

      textareaRef.current.style.height = "30px"; // Set to our desired minimum
      const newHeight = Math.max(
        30,
        Math.min(textareaRef.current.scrollHeight, 120)
      );
      textareaRef.current.style.height = `${newHeight}px`;

      // More accurate line detection - only consider multi-line when height exceeds single line + padding
      const singleLineHeight = 30 + 24; // min height + approximate line height + padding
      setIsMultiLine(newHeight > singleLineHeight);

      return newHeight;
    }
    return 30; // default min height
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  return (
    <div className="w-full py-2 pb-4 bg-transparent">
      <div className="w-full px-4 max-sm:px-4 bg-transparent">
        {/* AI Suggestions - positioned above input */}
        <AISuggestions className="mb-3" show={showSuggestions && !isLoading}>
          {suggestions.map((suggestion) => (
            <AISuggestion
              key={suggestion}
              onClick={() => onSuggestion(suggestion)}
              suggestion={suggestion}
            />
          ))}
        </AISuggestions>

        {/* Main Input Container with polygon theme */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="w-full focus-visible:outline-none focus-visible:ring-1 focus-within:outline-none focus-within:ring-1 focus-visible:ring-ring flex justify-center bg-input/30"
          style={{
            clipPath:
              "polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)",
          }}
        >
          <div className="relative w-full">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustHeight();
                if (e.target.value.trim().length === 0) {
                  setShowSuggestions(true);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                userLoading ? "Loading user session..." : placeholder
              }
              className={cn(
                "w-full bg-transparent text-foreground placeholder:text-muted-foreground text-base resize-none border-none outline-none min-h-[30px] scrollbar-thin overflow-y-auto px-4 py-3",
                !isMultiLine ? "pr-16" : "pr-4" // Add right padding when button is inline
              )}
              rows={1}
              disabled={disabled || isLoading || userLoading || !sessionUser}
            />

            {/* Single button with conditional positioning */}
            <AnimatePresence>
              {(isLoading || input.trim().length > 0) && (
                <motion.div
                  variants={!isMultiLine ? buttonVariants : undefined}
                  initial={!isMultiLine ? "hidden" : undefined}
                  animate={!isMultiLine ? "visible" : undefined}
                  exit={!isMultiLine ? "exit" : undefined}
                  className={cn(
                    "flex w-full justify-end",
                    isMultiLine
                      ? "border-t border-input/50 p-2"
                      : "absolute top-1/2 right-3 transform -translate-y-1/2 w-auto"
                  )}
                >
                  <Button
                    type="submit"
                    variant="ghost"
                    className={cn(
                      "transition-colors flex items-center justify-center bg-foreground hover:bg-foreground/80 text-background h-10 rounded-none cursor-pointer",
                      isMultiLine ? "w-10" : "w-10 p-0",
                      isLoading &&
                        "bg-foreground/60 hover:bg-foreground/60 cursor-not-allowed"
                    )}
                    style={{
                      clipPath: isMultiLine
                        ? "polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)"
                        : "polygon(2px 0%, 100% 0%, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0% 100%, 0% 2px)",
                    }}
                    onClick={() => {
                      if (!disabled && sessionUser?.id) {
                        handleSubmit();
                      }
                    }}
                    disabled={
                      disabled || !input.trim() || userLoading || !sessionUser
                    }
                  >
                    {isLoading ? (
                      <div
                        className={cn(
                          "flex items-center",
                          isMultiLine ? "gap-2" : ""
                        )}
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "flex items-center",
                          isMultiLine ? "gap-2" : ""
                        )}
                      >
                        <Triangle size={16} className="fill-current" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </div>
  );
}
