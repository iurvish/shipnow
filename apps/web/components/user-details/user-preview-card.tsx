"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Github,
  ExternalLink,
  Mail,
  GraduationCap,
  MapPin,
  Calendar,
} from "lucide-react";
import { DatabasePerson } from "@/lib/actions/chat-actions";
import { cn } from "@/lib/utils";

interface UserPreviewCardProps {
  user: DatabasePerson;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const getExperienceBadgeColor = (level: string) => {
  switch (level.toUpperCase()) {
    case "BEGINNER":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
    case "INTERMEDIATE":
    case "MID-LEVEL":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    case "ADVANCED":
    case "SENIOR":
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
  }
};

export function UserPreviewCard({
  user,
  isSelected = false,
  onClick,
  className,
}: UserPreviewCardProps) {
  const fullName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    "Anonymous User";
  const skills = user.technical_profile?.skills?.slice(0, 3) || [];
  const hasMoreSkills = (user.technical_profile?.skills?.length || 0) > 3;
  const displayEmail = user.email || "No email provided";

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:shadow-md border-border/40",
        "hover:border-muted-foreground/20 hover:bg-muted/20",
        isSelected && "border-primary bg-primary/5 shadow-md",
        className
      )}
      onClick={onClick}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-tight mb-1 truncate">
              {fullName}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {displayEmail}
            </p>
          </div>
          {user.technical_profile?.experience && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs py-0.5 px-2 ml-2 shrink-0",
                getExperienceBadgeColor(user.technical_profile.experience)
              )}
            >
              {user.technical_profile.experience}
            </Badge>
          )}
        </div>

        {/* Education */}
        {user.personal_details && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <GraduationCap className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {user.personal_details.degree_level} •{" "}
              {user.personal_details.university}
            </span>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs py-0.5 px-1.5 bg-background border text-muted-foreground"
              >
                {skill}
              </Badge>
            ))}
            {hasMoreSkills && (
              <Badge
                variant="secondary"
                className="text-xs py-0.5 px-1.5 bg-background border text-muted-foreground"
              >
                +{(user.technical_profile?.skills?.length || 0) - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Bio Preview */}
        {user.bio && (
          <p
            className="text-xs text-muted-foreground leading-relaxed overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {user.bio}
          </p>
        )}

        {/* Quick Actions */}
        <div className="flex items-center gap-1 pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={!user.email}
            onClick={(e) => {
              e.stopPropagation();
              if (user.email) {
                window.open(`mailto:${user.email}`, "_blank");
              }
            }}
          >
            <Mail className="h-3 w-3 mr-1" />
            Contact
          </Button>

          {user.technical_profile?.github && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                window.open(user.technical_profile!.github!, "_blank");
              }}
            >
              <Github className="h-3 w-3" />
            </Button>
          )}

          {user.technical_profile?.portfolio && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                window.open(user.technical_profile!.portfolio!, "_blank");
              }}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
