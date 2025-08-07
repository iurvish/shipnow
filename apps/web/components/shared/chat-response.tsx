"use client";

import React from "react";
import { Users, Search } from "lucide-react";
import { ChatResponse } from "@/lib/actions/chat-actions";
import { SimpleUserCard } from "@/components/simple-user-card-v2";

interface ChatResponseComponentProps {
  response: ChatResponse;
}

export const ChatResponseComponent: React.FC<ChatResponseComponentProps> = ({
  response,
}) => {
  // Database People Results
  if (
    response.query_type === "people_search" &&
    response.people &&
    response.people.length > 0
  ) {
    return (
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-medium text-foreground">
            Found {response.people.length} people in database
          </h4>
        </div>

        {/* Horizontal Scrollable Cards */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {response.people.map((person) => (
              <div key={person.id} className="flex-shrink-0 w-80">
                <SimpleUserCard person={person} />
              </div>
            ))}
          </div>
        </div>

        {/* Query Information */}
        {response.explanation && (
          <div
            className="mt-4 p-3 bg-muted/50 border border-muted"
            style={{ borderRadius: "0px" }}
          >
            <p className="text-xs text-muted-foreground">
              <strong>Search explanation:</strong> {response.explanation}
            </p>
          </div>
        )}
      </div>
    );
  }

  // No Results Message
  if (
    response.query_type === "people_search" &&
    response.people &&
    response.people.length === 0
  ) {
    return (
      <div className="mt-6">
        <div
          className="flex flex-col items-center justify-center p-8 bg-muted/30 border border-muted text-center"
          style={{ borderRadius: "0px" }}
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

  // General Question Response
  if (response.query_type === "general_question" && response.message) {
    return (
      <div
        className="mt-4 p-4 bg-muted/30 border border-muted"
        style={{ borderRadius: "0px" }}
      >
        <p className="text-sm text-muted-foreground">{response.message}</p>
      </div>
    );
  }

  return null;
};
