"use server";

import { getUserChatsData } from "@/lib/dal";

export interface ChatHistoryItem {
  id: string;
  slug: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatHistoryResponse {
  success: boolean;
  chats?: ChatHistoryItem[];
  error?: string;
}

/**
 * Get chat history for the current authenticated user.
 * Uses the DAL for proper caching and auth verification.
 */
export async function getChatHistory(userId?: string): Promise<ChatHistoryResponse> {
  try {
    // Use DAL which handles auth verification and caching
    const chats = await getUserChatsData();

    return {
      success: true,
      chats: chats || [],
    };

  } catch (error) {
    console.error('Error in getChatHistory action:', error);
    return {
      success: false,
      error: 'Internal server error',
    };
  }
}