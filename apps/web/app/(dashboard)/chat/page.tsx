'use client';

import React, { useState } from 'react';
import ChatItem from '@/components/shared/chat-item';
import AIInputSearch from '@/components/shared/ai-input-search';
import { UserArtifactProvider, useUserArtifact } from '@/hooks/use-user-artifact';
import { UserArtifactPanel } from '@/components/user-artifact-panel';
import { ChatResponse } from '@/lib/actions/chat-actions';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  chatResponse?: ChatResponse;
  timestamp: Date;
}

function ChatPageContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userArtifact } = useUserArtifact();

  const handleUserMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
  };

  const handleAIResponse = (response: ChatResponse) => {
    setIsLoading(false);

    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      content:
        response.message ||
        (response.query_type === 'people_search'
          ? 'Here are the people I found:'
          : ''),
      role: 'assistant',
      chatResponse: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleRegenerate = async (messageId: string) => {
    // Find the user message that preceded this AI response
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1];
      if (userMessage && userMessage.role === 'user') {
        setIsLoading(true);
        // Remove the old AI response
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
        // Regenerate with the original user message
        handleUserMessage(userMessage.content);
      }
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Chat Content */}
      <div className={`flex flex-col transition-all duration-300 ${
        userArtifact.isVisible ? 'w-[calc(100%-448px)]' : 'w-full'
      }`}>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {messages.length === 0 && !isLoading ? (
              /* Welcome Message */
              <div className="flex justify-center pt-20">
                <div
                  className="bg-muted/30 p-8 max-w-md text-center"
                  style={{ borderRadius: '0px' }}
                >
                  <h3 className="font-semibold mb-3 text-lg">
                    Welcome to People Finder
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tell me about the kind of people you're looking for and I'll
                    search our database to find the perfect matches!
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      <strong>Try asking:</strong>
                    </p>
                    <p>"Find me React developers"</p>
                    <p>"I need experienced UX designers"</p>
                    <p>"Suggest some data scientists"</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Chat Messages */
              <div className="space-y-0">
                {messages.map((message) => (
                  <ChatItem
                    key={message.id}
                    content={message.content}
                    role={message.role}
                    chatResponse={message.chatResponse}
                    onRegenerate={
                      message.role === 'assistant'
                        ? () => handleRegenerate(message.id)
                        : undefined
                    }
                  />
                ))}

                {/* Loading State */}
                {isLoading && (
                  <ChatItem
                    content="Searching for people..."
                    role="assistant"
                    isLoading={true}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Input Area */}
        <div className="border-t border-border/40 bg-background/80 backdrop-blur-sm sticky bottom-0 p-4">
          <div className="max-w-6xl mx-auto">
            <AIInputSearch
              onResponse={handleAIResponse}
              onUserMessage={handleUserMessage}
              disabled={isLoading}
              placeholder="Tell me about the kind of people you're looking for..."
            />
            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
              <span>Press Enter to send, Shift + Enter for new line</span>
              <span>Looking for people? Just describe what you need!</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Artifact Area - Fixed Width Column */}
      <UserArtifactPanel />
    </div>
  );
}

export default function ChatPage() {
  return (
    <UserArtifactProvider>
      <ChatPageContent />
    </UserArtifactProvider>
  );
}
