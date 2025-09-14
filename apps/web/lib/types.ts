export type Attachment = {
  name: string;
  contentType: string;
  size: number;
  url: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Date;
  attachments?: Attachment[];
  // Required for AI SDK compatibility
  parts: Array<{
    type: 'text';
    text: string;
  }>;
};

// Project-related types
export type Project = {
  id: string;
  user_id: string;
  project_name: string;
  project_image?: string | null;
  live_site_url?: string | null;
  github_link?: string | null;
  video_url?: string | null;
  tags: string[];
  case_summary?: string | null;
  build_journey?: string | null;
  key_features: string[];
  results?: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectInput = Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'> & {
  user_id?: string; // Optional for input since it can be inferred from auth
};

export type CustomUIDataTypes = {
  // Define custom data types for UI streaming
  userData: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    bio: string | null;
    personalDetails: any;
    technicalProfile: any;
    projects?: Project[]; // Add projects to user data
  };
  content: string;
};
