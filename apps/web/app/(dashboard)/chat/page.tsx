import React, { Suspense } from "react";
import ChatPageContent from "@/components/ChatPageContent";

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
