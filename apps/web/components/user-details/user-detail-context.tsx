"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { DatabasePerson } from "@/lib/actions/chat-actions";

interface UserDetailContextType {
  selectedUser: DatabasePerson | null;
  isDetailPanelOpen: boolean;
  openDetailPanel: (user: DatabasePerson) => void;
  closeDetailPanel: () => void;
  setSelectedUser: (user: DatabasePerson | null) => void;
}

const UserDetailContext = createContext<UserDetailContextType | undefined>(
  undefined
);

export function UserDetailProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedUser, setSelectedUser] = useState<DatabasePerson | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  const openDetailPanel = useCallback((user: DatabasePerson) => {
    setSelectedUser(user);
    setIsDetailPanelOpen(true);
  }, []);

  const closeDetailPanel = useCallback(() => {
    setIsDetailPanelOpen(false);
    // Keep the selected user for a moment to allow for smooth closing animation
    setTimeout(() => {
      setSelectedUser(null);
    }, 300);
  }, []);

  const value: UserDetailContextType = {
    selectedUser,
    isDetailPanelOpen,
    openDetailPanel,
    closeDetailPanel,
    setSelectedUser,
  };

  return (
    <UserDetailContext.Provider value={value}>
      {children}
    </UserDetailContext.Provider>
  );
}

export function useUserDetail() {
  const context = useContext(UserDetailContext);
  if (context === undefined) {
    throw new Error("useUserDetail must be used within a UserDetailProvider");
  }
  return context;
}
