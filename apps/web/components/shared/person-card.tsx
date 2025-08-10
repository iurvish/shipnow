"use client";

import { memo, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { DatabasePerson } from "@/lib/actions/chat-actions";
import {
  Clock,
  User,
  ExternalLink,
  GraduationCap,
  ChevronsLeftRight,
} from "lucide-react";
import { useSimpleArtifact } from "../../hooks/use-user-detail-panel";

interface PersonCardProps {
  person: DatabasePerson;
  isSelected?: boolean;
}

export function PersonCard({ person, isSelected = false }: PersonCardProps) {
  const { openArtifact } = useSimpleArtifact();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    const boundingBox = cardRef.current?.getBoundingClientRect();

    if (boundingBox) {
      openArtifact({
        type: "user",
        data: person,
        boundingBox: {
          top: boundingBox.top,
          left: boundingBox.left,
          width: boundingBox.width,
          height: boundingBox.height,
        },
      });
    }
  }, [person, openArtifact]);

  const fullName = `${person.first_name} ${person.last_name}`;
  const skills = person.technical_profile?.skills || [];
  const experience = person.technical_profile?.experience || "Not specified";
  const university = person.personal_details?.university || "Not specified";
  const department = person.personal_details?.department || "Developer";

  // Helper function to truncate text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className="group relative bg-card border border-border/40 transition-all duration-300  hover:shadow-lg hover:shadow-primary/5 cursor-pointer h-[320px] flex flex-col p-4"
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 16px) 0%, 100% 16px, 100% 100%, 0 100%)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Hover indicator */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <ChevronsLeftRight className="w-4 h-4 text-primary transition-transform duration-300 group-hover:rotate-45" />
      </div>

      {/* Header with Avatar and Name */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 6px) 0%, 100% 6px, 100% 100%, 0 100%)",
          }}
        >
          <User className="w-6 h-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-base text-foreground mb-1 truncate group-hover:text-primary transition-colors duration-300">
            {fullName}
          </h3>
          {/* Email right below name */}
          <p className="text-sm text-muted-foreground truncate mb-2">
            {person.email}
          </p>
        </div>
      </div>

      {/* Bio Section with character limit */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {person.bio
            ? truncateText(person.bio, 60)
            : "Passionate developer focused on creating innovative solutions and contributing to meaningful projects."}
        </p>
      </div>

      {/* Skills Section */}
      <div className="mb-4 flex-1">
        <h4 className="text-sm font-semibold text-foreground mb-2">Skills</h4>
        <div className="flex flex-wrap gap-1.5">
          {skills.length > 0 ? (
            skills.slice(0, 7).map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-1 bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors duration-300"
              >
                {truncateText(skill, 10)}
              </Badge>
            ))
          ) : (
            <>
              <Badge
                variant="secondary"
                className="text-xs px-2 py-1 bg-primary/5 text-primary border-primary/10"
              >
                JavaScript
              </Badge>
              <Badge
                variant="secondary"
                className="text-xs px-2 py-1 bg-primary/5 text-primary border-primary/10"
              >
                React
              </Badge>
              <Badge
                variant="secondary"
                className="text-xs px-2 py-1 bg-primary/5 text-primary border-primary/10"
              >
                TypeScript
              </Badge>
            </>
          )}
          {skills.length > 6 && (
            <Badge
              variant="secondary"
              className="text-xs px-2 py-1 bg-muted/50 text-muted-foreground"
            >
              +{skills.length - 6}
            </Badge>
          )}
        </div>
      </div>

      {/* Bottom Section: University/Department and Experience with vertical separator */}
      <div className="mt-auto pt-3 border-t border-border/30">
        <div className="flex items-center justify-between gap-3">
          {/* Left side: University and Department */}
          <div className="flex items-start gap-2  min-w-0 flex-1 ">
            <GraduationCap className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p
                className="text-sm font-medium text-foreground leading-3.5 "
                title={university}
              >
                {truncateText(university, 10)}
              </p>
              <p
                className="text-xs text-muted-foreground mt-0.5"
                title={department}
              >
                {truncateText(department, 10)}
              </p>
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="w-px bg-border self-stretch" />

          {/* Right side: Experience */}
          <div className="flex items-start gap-2 flex-1 justify-center">
            <Clock className="w-[15px] h-[15px] text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground leading-3.5">
                Experience
              </p>
              <p
                className="text-sm font-medium text-foreground"
                title={experience}
              >
                {truncateText(experience, 15)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
