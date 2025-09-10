"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AISuggestionsProps {
  children: React.ReactNode;
  className?: string;
  show: boolean;
}

interface AISuggestionProps {
  suggestion: string;
  className?: string;
  onClick?: () => void;
}

export function AISuggestions({
  children,
  className,
  show,
}: AISuggestionsProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className={cn("w-full", className)}
        >
          <div
            className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide"
            style={{
              WebkitOverflowScrolling: "touch", // iOS smooth scrolling
              scrollBehavior: "smooth", // Smooth scrolling for programmatic scrolling
            }}
            onWheel={(e) => {
              // Enable horizontal scrolling with vertical wheel/touchpad gestures
              if (e.deltaY !== 0 && e.deltaX === 0) {
                e.currentTarget.scrollLeft += e.deltaY;
                e.preventDefault();
              }
            }}
          >
            <div
              className="flex gap-2 pb-2"
              style={{
                width: "max-content",
                minWidth: "100%",
              }}
            >
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AISuggestion({
  suggestion,
  className,
  onClick,
}: AISuggestionProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "text-xs px-3 py-2 bg-muted text-muted-foreground hover:bg-primary cursor-pointer hover:text-primary-foreground transition-colors  whitespace-nowrap flex-shrink-0",
        className
      )}
      style={{
        clipPath:
          "polygon(3px 0%, 100% 0%, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0% 100%, 0% 3px)",
      }}
    >
      {suggestion}
    </motion.button>
  );
}
