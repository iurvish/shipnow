"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSessionUser } from "@/hooks/use-session-user";

interface ChatHistoryItem {
  id: string;
  slug: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatHistoryContextType {
  chatHistory: ChatHistoryItem[];
  loading: boolean;
  error: string | null;
  addNewChat: (slug: string, messageTitle: string) => void;
  refreshHistory: () => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

export const ChatHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: userLoading } = useSessionUser();

  // Fetch chat history from database
  const fetchChatHistory = useCallback(async () => {
    if (!user?.id || userLoading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chats/history?userId=${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }

      const data = await response.json();
      
      if (data.success && data.chats) {
        // Sort by updated_at descending (most recent first)
        const sortedChats = data.chats.sort((a: ChatHistoryItem, b: ChatHistoryItem) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setChatHistory(sortedChats);
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch chat history');
    } finally {
      setLoading(false);
    }
  }, [user?.id, userLoading]);

  // Load history when user is available
  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  // Add new chat to history
  const addNewChat = useCallback((slug: string, messageTitle: string) => {
    if (!user?.id) return;

    const newChat: ChatHistoryItem = {
      id: `temp-${Date.now()}`, // Temporary ID until we get the real one
      slug,
      title: messageTitle,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to the beginning of the array (most recent first)
    setChatHistory(prev => [newChat, ...prev]);
  }, [user?.id]);

  // Refresh history (can be called manually)
  const refreshHistory = useCallback(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  return (
    <ChatHistoryContext.Provider
      value={{
        chatHistory,
        loading,
        error,
        addNewChat,
        refreshHistory,
      }}
    >
      {children}
    </ChatHistoryContext.Provider>
  );
};

export const useChatHistory = () => {
  const context = useContext(ChatHistoryContext);
  if (!context) {
    throw new Error('useChatHistory must be used within ChatHistoryProvider');
  }
  return context;
};