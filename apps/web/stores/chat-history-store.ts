import { create } from 'zustand';
import { getChatHistory, ChatHistoryItem } from '@/lib/actions/chat-history-actions';

interface ChatHistoryStore {
  chatHistory: ChatHistoryItem[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchChatHistory: (userId: string) => Promise<void>;
  addNewChat: (slug: string, messageTitle: string) => void;
  refreshHistory: (userId: string) => Promise<void>;
  clearHistory: () => void;
}

export const useChatHistoryStore = create<ChatHistoryStore>((set, get) => ({
  chatHistory: [],
  loading: false,
  error: null,

  fetchChatHistory: async (userId: string) => {
    if (!userId) return;
    
    set({ loading: true, error: null });

    try {
      const result = await getChatHistory(userId);

      if (result.success && result.chats) {
        set({ 
          chatHistory: result.chats,
          loading: false,
          error: null 
        });
      } else {
        set({ 
          loading: false, 
          error: result.error || 'Failed to fetch chat history' 
        });
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
      set({ 
        loading: false, 
        error: err instanceof Error ? err.message : 'Failed to fetch chat history' 
      });
    }
  },

  addNewChat: (slug: string, messageTitle: string) => {
    const newChat: ChatHistoryItem = {
      id: `temp-${Date.now()}`, // Temporary ID until we get the real one
      slug,
      title: messageTitle,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to the beginning of the array (most recent first)
    set(state => ({
      chatHistory: [newChat, ...state.chatHistory]
    }));
  },

  refreshHistory: async (userId: string) => {
    await get().fetchChatHistory(userId);
  },

  clearHistory: () => {
    set({ chatHistory: [], loading: false, error: null });
  },
}));