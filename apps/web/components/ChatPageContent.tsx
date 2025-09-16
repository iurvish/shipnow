"use client";
import { useRouter } from "next/navigation";
import { useSessionUser } from "@/hooks/use-session-user";
import { useState } from "react";
import AIInputSearch from "@/components/shared/ai-input-search-simple";

export default function ChatPageContent() {
  const router = useRouter();
  const { user: sessionUser, loading: userLoading } = useSessionUser();

  const handleSubmit = (input: string) => {
    const slug = Math.random().toString(36).substring(7);
    router.push(`/chat/${slug}?initialMessage=${encodeURIComponent(input)}`);
  };

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
  if (!sessionUser && !userLoading) {
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
    <div className="hide-scrollbar w-full flex flex-col justify-between h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.75rem)] min-h-0 bg-transparent">
      {/* Messages Area - Empty for main chat page */}
      <div className="flex-1 overflow-y-auto pb-24 bg-transparent">
        <div className="max-w-6xl mx-auto">
          {/* Welcome message or empty state can go here */}
        </div>
      </div>

      {/* Sticky Input Area */}
      <div className="lg:w-[88%] xl:w-[80%] md:w-full w-full mx-auto bg-transparent">
        <AIInputSearch
          onSearch={handleSubmit} // Use onSearch instead of API calls
          disabled={userLoading || !sessionUser}
          placeholder="Search people you're looking for..."
        />
      </div>
    </div>
  );
}
