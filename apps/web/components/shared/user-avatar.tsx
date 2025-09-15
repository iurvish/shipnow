"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserAvatarProps {
  firstName?: string | null;
  lastName?: string | null;
  profilePicture?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({
  firstName,
  lastName,
  profilePicture,
  size = "md",
  className,
}: UserAvatarProps) {
  const getInitials = () => {
    if (!firstName && !lastName) return "";
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return `${first}${last}`;
  };

  const sizeClasses = {
    sm: "size-6",
    md: "size-8",
    lg: "size-12",
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className || ""}`}>
      {profilePicture && (
        <AvatarImage
          src={profilePicture}
          alt={`${firstName || ""} ${lastName || ""}`.trim()}
        />
      )}
      <AvatarFallback className="bg-muted text-muted-foreground">
        {getInitials() || <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}
