"use client";
import React from "react";
import ShowChats from "@/components/ShowChats";
import { SimpleArtifactProvider } from "@/hooks/use-user-detail-panel";
import { SimpleArtifactPanel } from "@/components/panels/user-detail-panel";

interface ShowChatsWrapperProps {
  slug: string;
}

export default function ShowChatsWrapper({ slug }: ShowChatsWrapperProps) {
  return (
    <SimpleArtifactProvider>
      <div className="flex h-full relative">
        <ShowChats slug={slug} />
        <SimpleArtifactPanel />
      </div>
    </SimpleArtifactProvider>
  );
}
