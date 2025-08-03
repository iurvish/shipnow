"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";

export default function AI_Input_Search() {
  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 50,
    maxHeight: 150,
  });

  const handleSubmit = () => {
    if (value.trim()) {
      setValue("");
      adjustHeight(true);
    }
  };

  return (
    <div className="w-full py-2">
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
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Type your message here..."
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-base resize-none border-none outline-none min-h-[50px] scrollbar-thin overflow-y-auto"
              rows={2}
            />
          </div>

          {/* Send Button */}
          <div className="flex justify-end p-2 border-t border-input/50">
            <button
              onClick={handleSubmit}
              className={cn(
                "relative px-3 py-1.5 font-medium text-sm transition-colors flex items-center gap-2",
                value.trim()
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              )}
              style={{
                clipPath:
                  "polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)",
              }}
              disabled={!value.trim()}
            >
              SEND
              <Send size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
