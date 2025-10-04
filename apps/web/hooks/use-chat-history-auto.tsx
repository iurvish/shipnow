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
      // Call without userId - DAL handles auth
      fetchChatHistory();
    } else if (!user && !userLoading) {
      // Clear history if user logs out
      clearHistory();
    }
  }, [user?.id, userLoading, fetchChatHistory, clearHistory]);

  // Wrapper functions
  const refresh = () => {
    if (user?.id) {
      refreshHistory();
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
