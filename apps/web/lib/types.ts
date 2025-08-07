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
  };
  content: string;
};
