"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { DatabasePerson } from "@/lib/actions/chat-actions";

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

interface SimpleArtifactContextType {
  isVisible: boolean;
  artifactData: ArtifactData | null;
  openArtifact: (data: ArtifactData) => void;
  closeArtifact: () => void;
}

const SimpleArtifactContext = createContext<
  SimpleArtifactContextType | undefined
>(undefined);

export const SimpleArtifactProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Simple artifact provider for user details
  const [isVisible, setIsVisible] = useState(false);
  const [artifactData, setArtifactData] = useState<ArtifactData | null>(null);

  const openArtifact = (data: ArtifactData) => {
    setArtifactData(data);
    setIsVisible(true);
  };

  const closeArtifact = () => {
    setIsVisible(false);
    // Keep data for exit animation
    setTimeout(() => setArtifactData(null), 500);
  };

  return (
    <SimpleArtifactContext.Provider
      value={{
        isVisible,
        artifactData,
        openArtifact,
        closeArtifact,
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
