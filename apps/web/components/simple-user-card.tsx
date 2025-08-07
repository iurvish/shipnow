"use client";

import { memo, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { DatabasePerson } from "@/lib/actions/chat-actions";
import { UserIcon, MailIcon } from "lucide-react";
import { useArtifact } from "@/hooks/use-artifact";

interface UserCardProps {
  person: DatabasePerson;
  isSelected?: boolean;
}

function UserCardComponent({ person, isSelected = false }: UserCardProps) {
  const { setArtifact } = useArtifact();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    const boundingBox = cardRef.current?.getBoundingClientRect();

    if (boundingBox) {
      // Set up the artifact with user data
      setArtifact({
        documentId: `user-${person.id}`,
        content: JSON.stringify(person, null, 2),
        kind: "user" as any,
        title:
          `${person.first_name} ${person.last_name}`.trim() || "User Profile",
        status: "idle",
        isVisible: true,
        boundingBox: {
          top: boundingBox.top,
          left: boundingBox.left,
          width: boundingBox.width,
          height: boundingBox.height,
        },
      });
    }
  }, [person, setArtifact]);

  const displayName =
    person.first_name && person.last_name
      ? `${person.first_name} ${person.last_name}`
      : person.first_name || person.last_name || "Unknown User";

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={cn(
        "relative group cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <div className="flex items-start space-x-4 p-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {displayName}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <MailIcon className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground truncate">
                  {person.email}
                </p>
              </div>
            </div>
          </div>

          {person.bio && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {person.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export const UserCard = memo(UserCardComponent);
