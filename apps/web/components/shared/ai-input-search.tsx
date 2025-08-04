"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import {
  generatePeopleSuggestions,
  ToolStatus,
  ChatResponse,
} from "@/lib/actions/chat-actions";
import { ToolStatusIndicator } from "./tool-status-indicator";
import { cn } from "@/lib/utils";

interface AIInputSearchProps {
  onResponse?: (response: ChatResponse) => void;
  onUserMessage?: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function AIInputSearch({
  onResponse,
  onUserMessage,
  disabled = false,
  placeholder = "Tell me about the kind of people you're looking for...",
}: AIInputSearchProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toolStatuses, setToolStatuses] = useState<ToolStatus[]>([]);
  const [currentStep, setCurrentStep] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleStatusUpdate = (status: ToolStatus) => {
    setCurrentStep(status.step);
    setToolStatuses((prev) => {
      const existingIndex = prev.findIndex((s) => s.step === status.step);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = status;
        return updated;
      } else {
        return [...prev, status];
      }
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!input.trim() || isLoading || disabled) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setToolStatuses([]);
    setCurrentStep("");

    // Notify parent about user message
    onUserMessage?.(userMessage);

    try {
      const response = await generatePeopleSuggestions(userMessage);
      onResponse?.(response);
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
      setToolStatuses([]);
      setCurrentStep("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  return (
    <div className="w-full py-2">
      {/* Tool Status Indicator */}
      {isLoading && toolStatuses.length > 0 && (
        <div className="mb-4">
          <ToolStatusIndicator
            statuses={toolStatuses}
            currentStep={currentStep}
          />
        </div>
      )}

      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto px-4 max-sm:px-0">
        {/* Main Input Container with cut corners */}
        <div
          className="relative bg-input/30"
          style={{
            clipPath:
              "polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)",
          }}
        >
          {/* Main Input Area */}
          <div className="p-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-base resize-none border-none outline-none min-h-[50px] scrollbar-thin overflow-y-auto"
              rows={2}
              disabled={disabled || isLoading}
            />
          </div>

          {/* Send Button */}
          <div className="flex justify-end p-2 border-t border-input/50">
            <button
              onClick={handleSubmit}
              className={cn(
                "relative px-3 py-1.5 font-medium text-sm transition-colors flex items-center gap-2",
                input.trim() && !isLoading && !disabled
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              )}
              style={{
                clipPath:
                  "polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)",
              }}
              disabled={!input.trim() || isLoading || disabled}
            >
              {isLoading ? (
                <>
                  SEARCHING...
                  <Loader2 className="w-3 h-3 animate-spin" />
                </>
              ) : (
                <>
                  SEND
                  <Send size={12} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Example Queries */}
        {!isLoading && input.length === 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground mr-2">Try:</span>
            {[
              "React developers",
              "UX designers",
              "Backend engineers",
              "Data scientists",
            ].map((example) => (
              <button
                key={example}
                onClick={() => setInput(`Find me ${example}`)}
                className="text-xs px-2 py-1 bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-muted transition-colors"
                style={{
                  clipPath:
                    "polygon(2px 0%, 100% 0%, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0% 100%, 0% 2px)",
                }}
              >
                {example}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
