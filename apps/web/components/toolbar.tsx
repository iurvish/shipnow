"use client";

import { Button } from "@/components/ui/button";

interface ToolbarProps {
  isToolbarVisible: boolean;
  setIsToolbarVisible: (visible: boolean) => void;
  sendMessage: any;
  status: any;
  stop: any;
  setMessages: any;
  artifactKind: string;
}

export function Toolbar({
  isToolbarVisible,
  setIsToolbarVisible,
  artifactKind,
}: ToolbarProps) {
  if (!isToolbarVisible) return null;

  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Edit {artifactKind}
        </Button>
        <Button variant="outline" size="sm">
          Copy
        </Button>
      </div>
    </div>
  );
}
