"use client";
import { useRouter } from "next/navigation";
import { useSessionUser } from "@/hooks/use-session-user";
import { useState } from "react";
import AIInputSearch from "@/components/shared/ai-input-search-simple";
import { Loader, MessageSquare, Users, Search, Sparkles } from "lucide-react";
import Image from "next/image";

export default function ChatPageContent() {
  const router = useRouter();
  const { user: sessionUser, loading: userLoading } = useSessionUser();

  const handleSubmit = (input: string) => {
    const slug = Math.random().toString(36).substring(7);
    router.push(`/chat/${slug}?initialMessage=${encodeURIComponent(input)}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSubmit(suggestion);
  };

  // Suggestion cards data
  const suggestions = [
    {
      icon: Users,
      title: "Find Frontend Developers",
      description: "Search for React, Vue, or Angular developers",
      prompt: "Show me frontend developers with React experience",
    },
    {
      icon: Search,
      title: "Backend Engineers",
      description: "Find Node.js, Python, or Java developers",
      prompt: "Find backend engineers with Node.js skills",
    },
  ];

  // Show loading state while user is being fetched
  if (userLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="mx-auto mb-4">
          <Loader className="h-8 w-8 text-primary" />
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
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const userName =
    [sessionUser?.first_name, sessionUser?.last_name]
      .filter(Boolean)
      .join(" ") || "there";

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto px-6 py-8 max-sm:px-2">
      {/* Logo and Brand */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/40 rounded-2xl flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold font-mono mb-2">
          Hi there, <span className="text-primary">{userName}</span>
        </h1>
        <p className="text-xl text-muted-foreground font-mono">
          How can I help you today?
        </p>
      </div>

      {/* Main Input Field */}
      <div className="w-full max-w-2xl mb-12">
        <AIInputSearch
          onSearch={handleSubmit}
          disabled={userLoading || !sessionUser}
          placeholder="Search for peoples"
        />
      </div>

      {/* Suggestion Cards */}
      <div className="w-full max-w-4xl flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-fit">
          {suggestions.map((suggestion, index) => {
            const IconComponent = suggestion.icon;
            return (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.prompt)}
                className="group p-2 sm:p-3  lg:p-4 border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 text-left bg-background/50 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20 transition-colors">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold font-mono text-sm mb-2 text-foreground">
                  {suggestion.title}
                </h3>
                <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                  {suggestion.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
