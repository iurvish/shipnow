// User schema types for comprehensive recommendation system
import { Project } from './types';

export type DegreeLevel =
  | "Bachelor"
  | "Master"
  | "Self_taught"
  | "Diploma"
  | "Other";


// Main User table (extends auth.users) - clean with only basic info
export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  bio?: string; // Bio is stored in users table
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

// Personal details table (linked to users)
export interface PersonalDetails {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  university: string;
  department: string;
  degree_level: DegreeLevel;
  created_at: string;
  updated_at: string;
}

// Technical profile table (linked to users) - experience removed, now inferred from projects
export interface TechnicalProfile {
  id: string;
  user_id: string;
  skills: string[];
  github?: string;
  portfolio?: string;
  created_at: string;
  updated_at: string;
}

// Complete user with joined data including projects
export interface CompleteUser extends User {
  personal_details?: PersonalDetails;
  technical_profile?: TechnicalProfile;
  projects?: Project[]; // Add projects relationship
}

// For form inputs and API requests
export interface CreatePersonalDetailsInput {
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  university: string;
  department: string;
  degree_level: DegreeLevel;
}

export interface CreateTechnicalProfileInput {
  skills: string[];
  github?: string;
  portfolio?: string;
}

export interface UpdateUserInput {
  username?: string;
  avatar_url?: string;
  bio?: string; // Bio can be updated in users table
  onboarded?: boolean;
}

// For recommendation system - experience now inferred from project complexity/count
export interface UserRecommendationData {
  id: string;
  skills: string[];
  university: string;
  department: string;
  degree_level: DegreeLevel;
  project_count: number;
  recent_projects: string[]; // Recent project tags for skills inference
}
