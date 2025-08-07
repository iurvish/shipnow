"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSimpleArtifact } from "@/hooks/use-simple-artifact";
import { useWindowSize } from "usehooks-ts";
import { X, UserIcon, MailIcon, GithubIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

export function SimpleArtifactPanel() {
  const { isVisible, artifactData, closeArtifact } = useSimpleArtifact();
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const isMobile = useMemo(() => windowWidth < 768, [windowWidth]);

  if (!artifactData) return null;

  const user = artifactData.data;
  const displayName =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.first_name || user.last_name || "Unknown User";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="flex flex-row h-dvh w-dvw fixed top-0 left-0 z-50 bg-transparent"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.4 } }}
        >
          {/* Desktop: Left panel (chat messages area) */}
          {!isMobile && (
            <motion.div
              className="fixed bg-background h-dvh"
              initial={{
                width: windowWidth,
                right: 0,
              }}
              animate={{ width: windowWidth, right: 0 }}
              exit={{
                width: windowWidth,
                right: 0,
              }}
            />
          )}

          {/* Desktop: Chat messages panel */}
          {!isMobile && (
            <motion.div
              className="relative w-[400px] bg-muted dark:bg-background h-dvh shrink-0"
              initial={{ opacity: 0, x: 10, scale: 1 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 30,
                },
              }}
              exit={{
                opacity: 0,
                x: 0,
                scale: 1,
                transition: { duration: 0 },
              }}
            >
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Chat Messages</h3>
                <p className="text-sm text-muted-foreground">
                  Continue your conversation here
                </p>
              </div>
            </motion.div>
          )}

          {/* Main artifact content area */}
          <motion.div
            className="fixed dark:bg-muted bg-background h-dvh flex flex-col overflow-y-scroll md:border-l dark:border-zinc-700 border-zinc-200"
            initial={
              isMobile
                ? {
                    opacity: 1,
                    x: artifactData.boundingBox.left,
                    y: artifactData.boundingBox.top,
                    height: artifactData.boundingBox.height,
                    width: artifactData.boundingBox.width,
                    borderRadius: 12,
                  }
                : {
                    opacity: 1,
                    x: artifactData.boundingBox.left,
                    y: artifactData.boundingBox.top,
                    height: artifactData.boundingBox.height,
                    width: artifactData.boundingBox.width,
                    borderRadius: 12,
                  }
            }
            animate={
              isMobile
                ? {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    height: windowHeight,
                    width: windowWidth,
                    borderRadius: 0,
                    transition: {
                      delay: 0,
                      type: "spring",
                      stiffness: 200,
                      damping: 30,
                    },
                  }
                : {
                    opacity: 1,
                    x: 400,
                    y: 0,
                    height: windowHeight,
                    width: windowWidth - 400,
                    borderRadius: 0,
                    transition: {
                      delay: 0,
                      type: "spring",
                      stiffness: 200,
                      damping: 30,
                    },
                  }
            }
            exit={
              isMobile
                ? {
                    opacity: 1,
                    x: artifactData.boundingBox.left,
                    y: artifactData.boundingBox.top,
                    height: artifactData.boundingBox.height,
                    width: artifactData.boundingBox.width,
                    borderRadius: 12,
                    transition: {
                      delay: 0,
                      type: "spring",
                      stiffness: 200,
                      damping: 30,
                    },
                  }
                : {
                    opacity: 1,
                    x: artifactData.boundingBox.left,
                    y: artifactData.boundingBox.top,
                    height: artifactData.boundingBox.height,
                    width: artifactData.boundingBox.width,
                    borderRadius: 12,
                    transition: {
                      delay: 0,
                      type: "spring",
                      stiffness: 200,
                      damping: 30,
                    },
                  }
            }
          >
            {/* Close button */}
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={closeArtifact}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* User Profile Content */}
            <div className="h-full overflow-y-scroll !max-w-full">
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
              <div className="flex-1 p-6">
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
                  {user.personal_details && (
                    <div>
                      <h2 className="text-lg font-semibold mb-3">Education</h2>
                      <div className="space-y-3">
                        {user.personal_details.university && (
                          <div className="flex items-start gap-3">
                            <MapPinIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium">
                                {user.personal_details.university}
                              </p>
                              {user.personal_details.department && (
                                <p className="text-sm text-muted-foreground">
                                  {user.personal_details.department}
                                </p>
                              )}
                              {user.personal_details.degree_level && (
                                <p className="text-sm text-muted-foreground">
                                  {user.personal_details.degree_level}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {user.personal_details.date_of_birth && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Date of Birth:</strong>{" "}
                            {user.personal_details.date_of_birth}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Technical Profile */}
                  {user.technical_profile && (
                    <div>
                      <h2 className="text-lg font-semibold mb-3">
                        Technical Profile
                      </h2>
                      <div className="space-y-4">
                        {user.technical_profile.skills &&
                          user.technical_profile.skills.length > 0 && (
                            <div>
                              <h3 className="font-medium mb-2">Skills</h3>
                              <div className="flex flex-wrap gap-2">
                                {user.technical_profile.skills.map(
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

                        {user.technical_profile.github && (
                          <div className="flex items-center gap-3">
                            <GithubIcon className="h-5 w-5 text-muted-foreground" />
                            <a
                              href={`https://github.com/${user.technical_profile.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {user.technical_profile.github}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
