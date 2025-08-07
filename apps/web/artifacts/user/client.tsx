import { Artifact } from "@/components/create-artifact";
import { UserIcon, MailIcon, GithubIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DatabasePerson } from "@/lib/actions/chat-actions";

interface UserArtifactMetadata {
  userData: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    bio: string | null;
    personalDetails: {
      university: string | null;
      department: string | null;
      degreeLevel: string | null;
      dateOfBirth: string | null;
    } | null;
    technicalProfile: any;
  } | null;
}

export const userArtifact = new Artifact<"user", UserArtifactMetadata>({
  kind: "user",
  description: "A user profile artifact for displaying user information.",

  initialize: async ({ documentId, setMetadata }) => {
    // Initialize with empty metadata
    setMetadata({
      userData: null,
    });
  },

  onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
    if (streamPart.type === "data-userData") {
      setMetadata((metadata) => ({
        ...metadata,
        userData: streamPart.data as UserArtifactMetadata["userData"],
      }));
    }

    if (streamPart.type === "data-content") {
      setArtifact((draftArtifact) => ({
        ...draftArtifact,
        content: draftArtifact.content + (streamPart.data as string),
        isVisible:
          draftArtifact.status === "streaming" &&
          draftArtifact.content.length > 50 &&
          draftArtifact.content.length < 100
            ? true
            : draftArtifact.isVisible,
      }));
    }
  },

  content: ({
    mode,
    status,
    content,
    isCurrentVersion,
    currentVersionIndex,
    onSaveContent,
    getDocumentContentById,
    isLoading,
    metadata,
  }) => {
    if (isLoading || !metadata?.userData) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading user profile...</p>
          </div>
        </div>
      );
    }

    const user = metadata.userData;
    const displayName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.lastName || "Unknown User";

    if (mode === "diff") {
      const oldContent = getDocumentContentById(currentVersionIndex - 1);
      const newContent = getDocumentContentById(currentVersionIndex);
      return (
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Profile Changes</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Previous</h4>
              <pre className="text-sm bg-muted p-3 rounded">{oldContent}</pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Current</h4>
              <pre className="text-sm bg-muted p-3 rounded">{newContent}</pre>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-muted/30 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6 max-w-2xl">
            {/* Bio */}
            {user.bio && (
              <div>
                <h2 className="text-lg font-semibold mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MailIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            {/* Education */}
            {user.personalDetails && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Education</h2>
                <div className="space-y-3">
                  {user.personalDetails.university && (
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {user.personalDetails.university}
                        </p>
                        {user.personalDetails.department && (
                          <p className="text-sm text-muted-foreground">
                            {user.personalDetails.department}
                          </p>
                        )}
                        {user.personalDetails.degreeLevel && (
                          <p className="text-sm text-muted-foreground">
                            {user.personalDetails.degreeLevel}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {user.personalDetails.dateOfBirth && (
                    <div className="text-sm text-muted-foreground">
                      <strong>Date of Birth:</strong>{" "}
                      {user.personalDetails.dateOfBirth}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technical Profile */}
            {user.technicalProfile && (
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  Technical Profile
                </h2>
                <div className="space-y-4">
                  {user.technicalProfile.skills &&
                    user.technicalProfile.skills.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {user.technicalProfile.skills.map(
                            (skill: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {user.technicalProfile.github && (
                    <div className="flex items-center gap-3">
                      <GithubIcon className="h-5 w-5 text-muted-foreground" />
                      <a
                        href={`https://github.com/${user.technicalProfile.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {user.technicalProfile.github}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t border-border">
              <div className="flex gap-3">
                <Button>
                  <MailIcon className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline">View Full Profile</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },

  actions: [
    {
      icon: <MailIcon className="h-4 w-4" />,
      description: "Send email to user",
      onClick: () => {
        // Handle email action
        console.log("Send email clicked");
      },
    },
    {
      icon: <UserIcon className="h-4 w-4" />,
      description: "View user details",
      onClick: () => {
        // Handle view details action
        console.log("View details clicked");
      },
    },
  ],

  toolbar: [
    {
      icon: <span>📋</span>,
      description: "Copy user information",
      onClick: ({ sendMessage }) => {
        // Handle copy action
        console.log("Copy user info clicked");
      },
    },
  ],
});
