"use client";

import { Button } from "@/components/ui/button";
import type { Document } from "@/lib/db/schema";

interface VersionFooterProps {
  currentVersionIndex: number;
  documents: Document[] | undefined;
  handleVersionChange: (type: "next" | "prev" | "toggle" | "latest") => void;
}

export function VersionFooter({
  currentVersionIndex,
  documents,
  handleVersionChange,
}: VersionFooterProps) {
  const totalVersions = documents?.length || 0;

  return (
    <div className="p-4 border-t bg-muted/30">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Version {currentVersionIndex + 1} of {totalVersions}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVersionChange("prev")}
            disabled={currentVersionIndex <= 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVersionChange("next")}
            disabled={currentVersionIndex >= totalVersions - 1}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVersionChange("latest")}
          >
            Latest
          </Button>
        </div>
      </div>
    </div>
  );
}
