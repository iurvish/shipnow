'use client';

export type UserArtifactKind = 'user-detail';

export interface UserArtifactData {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  bio: string | null;
  personalDetails: {
    university: string;
    department: string;
    degreeLevel: string;
    dateOfBirth: string | null;
  } | null;
  technicalProfile: {
    skills: string[];
    experience: string;
    github: string | null;
    portfolio: string | null;
  } | null;
}

export interface UIUserArtifact {
  userId: string;
  kind: UserArtifactKind;
  userData: UserArtifactData | null;
  title: string;
  isVisible: boolean;
  status: 'idle' | 'streaming';
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null;
}

export const initialUserArtifactData: UIUserArtifact = {
  userId: '',
  kind: 'user-detail',
  userData: null,
  title: '',
  isVisible: false,
  status: 'idle',
  boundingBox: null,
};
