"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Github,
  ExternalLink,
  Mail,
  Calendar,
  GraduationCap,
  Briefcase,
  MapPin,
  X,
} from "lucide-react";
import { DatabasePerson } from "@/lib/actions/chat-actions";
import { cn } from "@/lib/utils";

interface UserDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: DatabasePerson | null;
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

const getDegreeLevelIcon = (level: string) => {
  switch (level.toUpperCase()) {
    case "PHD":
      return "🎓";
    case "GRADUATE":
    case "MASTER":
      return "📚";
    case "UNDERGRADUATE":
    case "BACHELOR":
      return "📖";
    case "DIPLOMA":
      return "📜";
    default:
      return "🎓";
  }
};

export function UserDetailPanel({
  isOpen,
  onClose,
  user,
}: UserDetailPanelProps) {
  if (!user) return null;

  const fullName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    "Anonymous User";
  const skills = user.technical_profile?.skills || [];
  const hasPersonalDetails = user.personal_details;
  const hasTechnicalProfile = user.technical_profile;
  const displayEmail = user.email || "No email provided";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 border-b border-border/40 bg-muted/30">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <SheetTitle className="text-lg font-semibold mb-1">
                  {fullName}
                </SheetTitle>
                <p className="text-sm text-muted-foreground">{displayEmail}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Bio Section */}
              {user.bio && (
                <div>
                  <h3 className="text-sm font-medium mb-2 text-foreground">
                    About
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {user.bio}
                  </p>
                </div>
              )}

              {/* Personal Details Section */}
              {hasPersonalDetails && (
                <div>
                  <h3 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">
                          {getDegreeLevelIcon(hasPersonalDetails.degree_level)}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {hasPersonalDetails.degree_level}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {hasPersonalDetails.department}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {hasPersonalDetails.university}
                          </p>
                          {hasPersonalDetails.date_of_birth && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Born{" "}
                                {new Date(
                                  hasPersonalDetails.date_of_birth
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Profile Section */}
              {hasTechnicalProfile && (
                <div>
                  <h3 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Technical Profile
                  </h3>
                  <div className="space-y-4">
                    {/* Experience Level */}
                    <div>
                      <span className="text-xs text-muted-foreground mb-2 block">
                        Experience Level
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          getExperienceBadgeColor(
                            hasTechnicalProfile.experience
                          )
                        )}
                      >
                        {hasTechnicalProfile.experience}
                      </Badge>
                    </div>

                    {/* Skills */}
                    {skills.length > 0 && (
                      <div>
                        <span className="text-xs text-muted-foreground mb-3 block">
                          Skills & Technologies
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs py-1 px-2 bg-background border"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    {(hasTechnicalProfile.github ||
                      hasTechnicalProfile.portfolio) && (
                      <div>
                        <span className="text-xs text-muted-foreground mb-3 block">
                          Links
                        </span>
                        <div className="space-y-2">
                          {hasTechnicalProfile.github && (
                            <a
                              href={hasTechnicalProfile.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors group"
                            >
                              <Github className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                              <span className="text-sm text-muted-foreground group-hover:text-foreground">
                                GitHub Profile
                              </span>
                              <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-foreground ml-auto" />
                            </a>
                          )}
                          {hasTechnicalProfile.portfolio && (
                            <a
                              href={hasTechnicalProfile.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors group"
                            >
                              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                              <span className="text-sm text-muted-foreground group-hover:text-foreground">
                                Portfolio
                              </span>
                              <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-foreground ml-auto" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Section */}
              <div>
                <h3 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact
                </h3>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <a
                    href={user.email ? `mailto:${user.email}` : "#"}
                    className={cn(
                      "flex items-center gap-2 text-sm transition-colors",
                      user.email
                        ? "text-muted-foreground hover:text-foreground"
                        : "text-muted-foreground/50 cursor-not-allowed"
                    )}
                    onClick={(e) => {
                      if (!user.email) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Mail className="h-4 w-4" />
                    <span>{displayEmail}</span>
                  </a>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="p-6 border-t border-border/40 bg-muted/30">
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (user.email) {
                    window.open(`mailto:${user.email}`, "_blank");
                  }
                }}
                className="flex-1"
                size="sm"
                disabled={!user.email}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Button>
              {hasTechnicalProfile?.portfolio && (
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(hasTechnicalProfile.portfolio!, "_blank")
                  }
                  size="sm"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
              {hasTechnicalProfile?.github && (
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(hasTechnicalProfile.github!, "_blank")
                  }
                  size="sm"
                >
                  <Github className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
