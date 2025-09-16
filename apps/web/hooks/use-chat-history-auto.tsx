import { useEffect } from "react";
import { useChatHistoryStore } from "@/stores/chat-history-store";
import { useSessionUser } from "@/hooks/use-session-user";

export const useChatHistory = () => {
  const { user, loading: userLoading } = useSessionUser();
  const {
    chatHistory,
    loading,
    error,
    fetchChatHistory,
    addNewChat,
    refreshHistory,
    clearHistory,
  } = useChatHistoryStore();

  // Auto-fetch chat history when user is available
  useEffect(() => {
    if (user?.id && !userLoading) {
      fetchChatHistory(user.id);
    } else if (!user && !userLoading) {
      // Clear history if user logs out
      clearHistory();
    }
  }, [user?.id, userLoading, fetchChatHistory, clearHistory]);

  // Wrapper functions that include userId
  const refresh = () => {
    if (user?.id) {
      refreshHistory(user.id);
    }
  };

  return {
    chatHistory,
    loading,
    error,
    addNewChat,
    refreshHistory: refresh,
  };
};
