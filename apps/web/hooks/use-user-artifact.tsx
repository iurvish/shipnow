'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { UIUserArtifact } from '../components/user-artifact';
import { initialUserArtifactData } from '../components/user-artifact';

interface UserArtifactContextType {
  userArtifact: UIUserArtifact;
  setUserArtifact: (
    updaterFn: UIUserArtifact | ((currentArtifact: UIUserArtifact) => UIUserArtifact)
  ) => void;
}

const UserArtifactContext = createContext<UserArtifactContextType | null>(null);

export function UserArtifactProvider({ children }: { children: ReactNode }) {
  const [userArtifact, setUserArtifact] = useState<UIUserArtifact>(initialUserArtifactData);

  const updateUserArtifact = useCallback((
    updaterFn: UIUserArtifact | ((currentArtifact: UIUserArtifact) => UIUserArtifact)
  ) => {
    if (typeof updaterFn === 'function') {
      setUserArtifact(updaterFn);
    } else {
      setUserArtifact(updaterFn);
    }
  }, []);

  return (
    <UserArtifactContext.Provider
      value={{
        userArtifact,
        setUserArtifact: updateUserArtifact,
      }}
    >
      {children}
    </UserArtifactContext.Provider>
  );
}

export function useUserArtifact() {
  const context = useContext(UserArtifactContext);
  if (!context) {
    throw new Error('useUserArtifact must be used within a UserArtifactProvider');
  }
  return context;
}
