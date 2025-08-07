// Complex artifact component - not currently used in the simplified system
// Keeping only essential type exports for compatibility with other components

// Type definitions for legacy compatibility
export type ArtifactKind = "user" | "text" | "code" | "image" | "sheet";

export interface UIArtifact {
  title: string;
  documentId: string;
  kind: ArtifactKind;
  content: string;
  isVisible: boolean;
  status: "streaming" | "idle";
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

// Empty artifact definitions for compatibility
export const artifactDefinitions: Array<{ kind: ArtifactKind }> = [
  { kind: "user" },
];

// Simplified empty component for compatibility
export const Artifact = () => null;
