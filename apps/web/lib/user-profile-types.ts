// User profile types for comprehensive recommendation system

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

export interface UserProfile {
  id: string;
  image: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  bio?: string;
  date_of_birth?: string;
  profile_picture_url?: string;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonalDetails {
  id: string;
  user_id: string;
  university: string;
  department: string;
  degree_level: DegreeLevel;
  phone?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

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

export interface CompleteUserProfile extends UserProfile {
  university?: string;
  department?: string;
  degree_level?: DegreeLevel;
  phone?: string;
  primary_skills?: string[];
  experience_level?: ExperienceLevel;
  interests?: string[];
  preferred_roles?: string[];
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  tools_proficiency?: string[];
}

// For form inputs and API requests
export interface CreatePersonalDetailsInput {
  university: string;
  department: string;
  degree_level: DegreeLevel;
  phone?: string;
  profile_picture?: string;
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

export interface UpdateUserProfileInput {
  image?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  bio?: string;
  date_of_birth?: string;
  profile_picture_url?: string;
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
