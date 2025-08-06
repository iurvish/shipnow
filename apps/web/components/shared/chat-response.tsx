'use client';

import React, { useEffect } from 'react';
import { Users, Search } from 'lucide-react';
import { ChatResponse } from '@/lib/actions/chat-actions';
import { MemoizedUserCard } from '@/components/user-card';
import { useUserArtifact } from '@/hooks/use-user-artifact';

interface ChatResponseComponentProps {
  response: ChatResponse;
}

export const ChatResponseComponent: React.FC<ChatResponseComponentProps> = ({
  response,
}) => {
  const { userArtifact, setUserArtifact } = useUserArtifact();

  // Auto-open panel with first user when people are found
  useEffect(() => {
    if (response.query_type === "people_search" && 
        response.people && 
        response.people.length > 0) {
      
      const firstPerson = response.people[0];
      if (!firstPerson) return;
      
      const displayName = firstPerson.first_name && firstPerson.last_name
        ? `${firstPerson.first_name} ${firstPerson.last_name}`
        : firstPerson.first_name || firstPerson.last_name || 'Unknown User';

      // Small delay to allow the component to mount
      setTimeout(() => {
        setUserArtifact((artifact) => ({
          ...artifact,
          userId: firstPerson.id,
          title: displayName,
          userData: {
            id: firstPerson.id,
            firstName: firstPerson.first_name,
            lastName: firstPerson.last_name,
            email: firstPerson.email,
            bio: firstPerson.bio,
            personalDetails: firstPerson.personal_details ? {
              university: firstPerson.personal_details.university,
              department: firstPerson.personal_details.department,
              degreeLevel: firstPerson.personal_details.degree_level,
              dateOfBirth: firstPerson.personal_details.date_of_birth,
            } : null,
            technicalProfile: firstPerson.technical_profile,
          },
          isVisible: true,
          status: 'idle',
        }));
      }, 100);
    }
  }, [response, setUserArtifact]);

  // Database People Results
  if (response.query_type === "people_search" && response.people && response.people.length > 0) {
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
            {response.people.map((person) => {
              const isSelected = userArtifact.userId === person.id;
              
              return (
                <div key={person.id} className="flex-shrink-0 w-80">
                  <MemoizedUserCard 
                    person={person}
                    isSelected={isSelected}
                  />
                </div>
              );
            })}
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
  if (response.query_type === "people_search" && response.people && response.people.length === 0) {
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
