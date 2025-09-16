import React, { Suspense } from "react";
import ShowChatsWrapper from "@/components/ShowChatsWrapper";

export default function Chat({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);

  return (
    <div className="relative flex w-full overflow-hidden transition-colors z-0">
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Suspense fallback={<div>Loading chat...</div>}>
          <ShowChatsWrapper slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}
