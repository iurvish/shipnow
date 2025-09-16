"use client";
import React from "react";
import ShowChats from "@/components/ShowChats";
import { SimpleArtifactProvider } from "@/hooks/use-user-detail-panel";

interface ShowChatsWrapperProps {
  slug: string;
}

export default function ShowChatsWrapper({ slug }: ShowChatsWrapperProps) {
  const handleSendMessage = () => {
    // This will be handled by ShowChats component internally
  };

  const handleAIResponse = () => {
    // This will be handled by ShowChats component internally
  };

  return (
    <SimpleArtifactProvider
      sendMessage={handleSendMessage}
      onAIResponse={handleAIResponse}
    >
      <ShowChats slug={slug} />
    </SimpleArtifactProvider>
  );
}
