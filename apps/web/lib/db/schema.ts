// Basic schema types for artifacts
export interface Document {
  id: string;
  createdAt: Date;
  title: string;
  content: string | null;
  kind: string;
  userId: string;
}


export interface Suggestion {
  id: string;
  documentId: string;
  content: string;
  userId: string;
  createdAt: Date;
}
