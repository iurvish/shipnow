"use client";

import React, { useState, useEffect } from "react";
import ChatMessages, { ChatMessage } from "@/components/shared/chat-messages";
import AIInputSearch from "@/components/shared/ai-input-search";
import {
  SimpleArtifactProvider,
  useSimpleArtifact,
} from "../../../hooks/use-user-detail-panel";
import { SimpleArtifactPanel } from "@/components/panels/user-detail-panel";
import { ChatResponse } from "@/lib/actions/chat-actions";
import { useSessionUser } from "@/hooks/use-session-user";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();

  const handleSubmit = (input: string) => {
    const slug = Math.random().toString(36).substring(7);
    // addNewChat(slug, input);
    router.push(`/chat/${slug}?initialMessage=${encodeURIComponent(input)}`);
  };

  return (
    <div className="">
      <div className=" w-full flex  lg:w-[88%] xl:w-[80%] mx-auto flex-col justify-end bg-background">
        {/* <p className="text-slate-200 text-2xl">{email}</p> */}

        <div className="">
          <AIInputSearch
            onSearch={handleSubmit}
            placeholder="Search people you're looking for..."
          />
        </div>
      </div>
    </div>
  );
}
