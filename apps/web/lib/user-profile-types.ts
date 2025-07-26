// User schema types for comprehensive recommendation system

export type DegreeLevel =
  | "associate"
  | "bachelor"
  | "master"
  | "doctorate"
  | "bootcamp"
  | "self_taught";

export type ExperienceLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

// Main User table (extends auth.users) - clean with only basic info
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  bio?: string;
  date_of_birth?: string;
  profile_picture: string; // moved from personal_details
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

// Personal details table (linked to users)
export interface PersonalDetails {
  id: string;
  user_id: string;
  university: string;
  department: string;
  degree_level: DegreeLevel;
  phone?: string;
  created_at: string;
  updated_at: string;
}

// Technical profile table (linked to users)
export interface TechnicalProfile {
  id: string;
  user_id: string;
  primary_skills: string[];
  experience_level: ExperienceLevel;
  interests: string[];
  preferred_roles: string[];
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  tools_proficiency: string[];
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
  university: string;
  department: string;
  degree_level: DegreeLevel;
  phone?: string;
}

export interface CreateTechnicalProfileInput {
  primary_skills: string[];
  experience_level: ExperienceLevel;
  interests: string[];
  preferred_roles: string[];
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  tools_proficiency: string[];
}

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  username?: string;
  bio?: string;
  date_of_birth?: string;
  profile_picture?: string;
  onboarded?: boolean;
}

// For recommendation system
export interface UserRecommendationData {
  id: string;
  primary_skills: string[];
  experience_level: ExperienceLevel;
  interests: string[];
  preferred_roles: string[];
  university: string;
  department: string;
  degree_level: DegreeLevel;
}
