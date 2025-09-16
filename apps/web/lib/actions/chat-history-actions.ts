"use server";

import { createClient } from "@/lib/server";

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

export async function getChatHistory(userId: string): Promise<ChatHistoryResponse> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required',
      };
    }

    // Create server client for server actions
    const supabase = await createClient();

    // Fetch chats for the user, ordered by updated_at descending
    const { data: chats, error } = await supabase
      .from('chats')
      .select(`
        id,
        slug,
        title,
        created_at,
        updated_at
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching chat history:', error);
      return {
        success: false,
        error: 'Failed to fetch chat history',
      };
    }

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