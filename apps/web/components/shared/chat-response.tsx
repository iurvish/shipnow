"use client";

import { DatabasePersonCard } from "./database-person-card";
import { ChatResponse } from "@/lib/actions/chat-actions";
import { AlertCircle, Users, Search } from "lucide-react";

interface ChatResponseProps {
  response: ChatResponse;
}

export function ChatResponseComponent({ response }: ChatResponseProps) {
  if (response.query_type === "general_question") {
    return (
      <div
        className="bg-muted/30 border border-border p-6 max-w-md mx-auto"
        style={{
          clipPath:
            "polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0"
            style={{
              clipPath:
                "polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)",
            }}
          >
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">
              Not a People Search
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {response.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (
    response.query_type === "people_search" &&
    response.people &&
    response.people.length > 0
  ) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div
          className="bg-primary/5 border border-primary/20 p-4"
          style={{
            clipPath:
              "polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)",
          }}
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Found {response.people.length} People in Database
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Here are professionals from our database that match your
            requirements
          </p>
        </div>

        {/* Horizontal Scrollable Cards */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {response.people.map((person) => (
              <div key={person.id} className="flex-shrink-0 w-80">
                <DatabasePersonCard person={person} />
              </div>
            ))}
          </div>
        </div>

        {/* Query Information */}
        {response.explanation && (
          <div
            className="p-3 bg-muted/50 border border-muted"
            style={{
              clipPath:
                "polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px)",
            }}
          >
            <p className="text-xs text-muted-foreground">
              <strong>Search explanation:</strong> {response.explanation}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (
    response.query_type === "people_search" &&
    response.people &&
    response.people.length === 0
  ) {
    return (
      <div className="space-y-6">
        {/* No Results Message */}
        <div
          className="flex flex-col items-center justify-center p-8 bg-muted/30 border border-muted text-center"
          style={{
            clipPath:
              "polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)",
          }}
        >
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">
            No People Found
          </h4>
          <p className="text-sm text-muted-foreground max-w-md">
            No people found matching your criteria. Try adjusting your search
            terms or be more specific about the skills and experience level
            you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
