import React, { Suspense } from "react";
import ShowChats from "@/components/ShowChats";
import {
  SimpleArtifactProvider,
} from "@/hooks/use-user-detail-panel";

export default function Chat({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);

  return (
    <div className="relative flex w-full overflow-hidden transition-colors z-0">
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Suspense fallback={<div>Loading chat...</div>}>
          <SimpleArtifactProvider
            sendMessage={() => {}} // This will be handled by ShowChats
            onAIResponse={() => {}} // This will be handled by ShowChats
          >
            <ShowChats slug={slug} />
          </SimpleArtifactProvider>
        </Suspense>
      </div>
    </div>
  );
}