"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Triangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import { AISuggestion, AISuggestions } from "@/components/ai/suggestions";
import { cn } from "@/lib/utils";

interface AIInputSearchProps {
  onSearch?: (message: string) => void; // New prop for search without API call
  onLoadingChange?: (isLoading: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
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
  onSearch,
  onLoadingChange,
  disabled = false,
  placeholder = "Search people you're looking for...",
}: AIInputSearchProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    if (!input.trim() || disabled) return;

    const userMessage = input.trim();
    setInput("");

    // Pass the message to parent component
    if (onSearch) {
      onSearch(userMessage);
      setShowSuggestions(false);
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
        <AISuggestions className="mb-3" show={showSuggestions}>
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
              placeholder={placeholder}
              className={cn(
                "w-full bg-transparent text-foreground placeholder:text-muted-foreground text-base resize-none border-none outline-none min-h-[30px] scrollbar-thin overflow-y-auto px-4 py-3",
                !isMultiLine ? "pr-16" : "pr-4" // Add right padding when button is inline
              )}
              rows={1}
              disabled={disabled}
            />

            {/* Single button with conditional positioning */}
            <AnimatePresence>
              {input.trim().length > 0 && (
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
                      isMultiLine ? "w-10" : "w-10 p-0"
                    )}
                    style={{
                      clipPath: isMultiLine
                        ? "polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)"
                        : "polygon(2px 0%, 100% 0%, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0% 100%, 0% 2px)",
                    }}
                    onClick={() => {
                      if (!disabled) {
                        handleSubmit();
                      }
                    }}
                    disabled={disabled || !input.trim()}
                  >
                    <div
                      className={cn(
                        "flex items-center",
                        isMultiLine ? "gap-2" : ""
                      )}
                    >
                      <Triangle size={16} className="fill-current" />
                    </div>
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
