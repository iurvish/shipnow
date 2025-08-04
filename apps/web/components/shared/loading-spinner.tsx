"use client";

export function LoadingSpinner() {
  return (
    <div
      className="bg-muted/30 border border-border p-6 max-w-md mx-auto"
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 0 100%)",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-pulse"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
        <span className="text-sm text-muted-foreground">
          Finding people for you...
        </span>
      </div>
    </div>
  );
}
