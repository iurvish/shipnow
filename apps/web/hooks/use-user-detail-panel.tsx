"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { DatabasePerson, ChatResponse } from "@/lib/actions/chat-actions";

interface ArtifactData {
  type: "user";
  data: DatabasePerson;
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  chatResponse?: ChatResponse;
  timestamp: Date;
}

interface SimpleArtifactContextType {
  isVisible: boolean;
  artifactData: ArtifactData | null;
  messages: ChatMessage[];
  openArtifact: (data: ArtifactData) => void;
  closeArtifact: () => void;
  setMessages: (messages: ChatMessage[]) => void;
  sendMessage?: (content: string) => void;
}

const SimpleArtifactContext = createContext<
  SimpleArtifactContextType | undefined
>(undefined);

export const SimpleArtifactProvider: React.FC<{
  children: ReactNode;
  sendMessage?: (content: string) => void;
}> = ({ children, sendMessage }) => {
  // Simple artifact provider for user details
  const [isVisible, setIsVisible] = useState(false);
  const [artifactData, setArtifactData] = useState<ArtifactData | null>(null);
  const [messages, setMessagesState] = useState<ChatMessage[]>([]);

  const openArtifact = (data: ArtifactData) => {
    setArtifactData(data);
    setIsVisible(true);
  };

  const closeArtifact = () => {
    setIsVisible(false);
    // Keep data for exit animation
    setTimeout(() => setArtifactData(null), 500);
  };

  const setMessages = (newMessages: ChatMessage[]) => {
    setMessagesState(newMessages);
  };

  return (
    <SimpleArtifactContext.Provider
      value={{
        isVisible,
        artifactData,
        messages,
        openArtifact,
        closeArtifact,
        setMessages,
        sendMessage,
      }}
    >
      {children}
    </SimpleArtifactContext.Provider>
  );
};

export function useSimpleArtifact() {
  const context = useContext(SimpleArtifactContext);
  if (!context) {
    throw new Error(
      "useSimpleArtifact must be used within SimpleArtifactProvider"
    );
  }
  return context;
}
