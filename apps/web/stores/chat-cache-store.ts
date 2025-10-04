import { create } from 'zustand';

interface ChatData {
  id: string;
  slug: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: any;
  created_at: string;
}

interface CachedChat {
  chat: ChatData;
  messages: ChatMessage[];
  lastFetched: number;
}

interface ChatCacheStore {
  cache: Map<string, CachedChat>;
  
  // Actions
  getCachedChat: (slug: string) => CachedChat | null;
  setChatCache: (slug: string, chat: ChatData, messages: ChatMessage[]) => void;
  addMessageToCache: (slug: string, message: ChatMessage) => void;
  clearCache: () => void;
  isCacheValid: (slug: string, maxAge?: number) => boolean;
}

// Cache for 5 minutes by default
const DEFAULT_CACHE_TIME = 5 * 60 * 1000;

export const useChatCacheStore = create<ChatCacheStore>((set, get) => ({
  cache: new Map(),

  getCachedChat: (slug: string) => {
    const cache = get().cache;
    return cache.get(slug) || null;
  },

  setChatCache: (slug: string, chat: ChatData, messages: ChatMessage[]) => {
    const cache = new Map(get().cache);
    cache.set(slug, {
      chat,
      messages,
      lastFetched: Date.now()
    });
    set({ cache });
  },

  addMessageToCache: (slug: string, message: ChatMessage) => {
    const cache = new Map(get().cache);
    const cached = cache.get(slug);
    
    if (cached) {
      cache.set(slug, {
        ...cached,
        messages: [...cached.messages, message],
        lastFetched: Date.now()
      });
      set({ cache });
    }
  },

  isCacheValid: (slug: string, maxAge = DEFAULT_CACHE_TIME) => {
    const cached = get().getCachedChat(slug);
    if (!cached) return false;
    
    return Date.now() - cached.lastFetched < maxAge;
  },

  clearCache: () => {
    set({ cache: new Map() });
  },
}));