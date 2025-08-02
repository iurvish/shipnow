// User schema types for comprehensive recommendation system

export type DegreeLevel =
  | "Bachelor"
  | "Master"
  | "Self_taught"
  | "Diploma"
  | "Other";

export type ExperienceLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert";

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

// Technical profile table (linked to users) - bio removed, it's in users table
export interface TechnicalProfile {
  id: string;
  user_id: string;
  experience: ExperienceLevel;
  skills: string[];
  github?: string;
  portfolio?: string;
  created_at: string;
  updated_at: string;
}

// Complete user with joined data
export interface CompleteUser extends User {
  personal_details?: PersonalDetails;
  technical_profile?: TechnicalProfile;
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
  experience: ExperienceLevel;
  github?: string;
  portfolio?: string;
}

export interface UpdateUserInput {
  username?: string;
  avatar_url?: string;
  bio?: string; // Bio can be updated in users table
  onboarded?: boolean;
}

// For recommendation system
export interface UserRecommendationData {
  id: string;
  skills: string[];
  experience_level: ExperienceLevel;
  university: string;
  department: string;
  degree_level: DegreeLevel;
}
