"use client";

import { Badge } from "@/components/ui/badge";
import { PersonSuggestion } from "@/lib/actions/chat-actions";
import { MapPin, Briefcase, Clock, User } from "lucide-react";

interface PersonCardProps {
  person: PersonSuggestion;
}

export function PersonCard({ person }: PersonCardProps) {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "busy":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "available":
        return "Available";
      case "busy":
        return "Busy";
      default:
        return "Not Specified";
    }
  };

  return (
    <div
      className="relative bg-card border border-border p-6 transition-all duration-200 hover:bg-accent/50"
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 0 100%)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 bg-primary/10 flex items-center justify-center"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 6px) 0%, 100% 6px, 100% 100%, 0 100%)",
            }}
          >
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              {person.name}
            </h3>
            <p className="text-sm text-muted-foreground">{person.title}</p>
          </div>
        </div>
        <Badge
          className={`text-xs rounded-none ${getAvailabilityColor(person.availability)}`}
        >
          <Clock className="w-3 h-3 mr-1" />
          {getAvailabilityText(person.availability)}
        </Badge>
      </div>

      {/* Company and Location */}
      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Briefcase className="w-4 h-4" />
          <span>{person.company}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{person.location}</span>
        </div>
      </div>

      {/* Experience */}
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">
          Experience:{" "}
        </span>
        <span className="text-sm text-muted-foreground">
          {person.experience}
        </span>
      </div>

      {/* Bio */}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {person.bio}
      </p>

      {/* Skills */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {person.skills.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs rounded-none bg-muted/50 text-foreground hover:bg-muted"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Contact Button */}
      <div className="mt-6">
        <button
          className="w-full bg-primary text-primary-foreground py-2 px-4 text-sm font-medium transition-colors hover:bg-primary/90"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 8px) 0%, 100% 8px, 100% 100%, 0 100%)",
          }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}
