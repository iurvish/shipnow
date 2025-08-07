"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSimpleArtifact } from "../../hooks/use-user-detail-panel";
import { useWindowSize } from "usehooks-ts";
import { X, MessageCircle } from "lucide-react";
import ChatItem from "../shared/chat-item";
import { ScrollArea } from "../ui/scroll-area";

export function SimpleArtifactPanel() {
  const { isVisible, artifactData, closeArtifact, messages } =
    useSimpleArtifact();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  if (!artifactData) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="flex flex-row h-dvh w-dvw fixed top-0 left-0 z-50 bg-transparent"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.4 } }}
        >
          {/* Desktop: Background */}
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

          {/* Desktop: Left panel (400px) - Chat Messages */}
          {!isMobile && (
            <motion.div
              className="relative w-[400px] bg-muted dark:bg-background h-dvh shrink-0 border-r border-border flex flex-col"
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
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Chat History</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your conversation with the AI assistant
                </p>
              </div>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <ChatItem
                        key={message.id}
                        content={message.content}
                        role={message.role}
                        chatResponse={message.chatResponse}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        No messages yet. Start a conversation in the main chat!
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          )}

          {/* Main artifact panel */}
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
                    borderRadius: 50,
                  }
                : {
                    opacity: 1,
                    x: artifactData.boundingBox.left,
                    y: artifactData.boundingBox.top,
                    height: artifactData.boundingBox.height,
                    width: artifactData.boundingBox.width,
                    borderRadius: 50,
                  }
            }
            animate={
              isMobile
                ? {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    height: windowHeight,
                    width: windowWidth ? windowWidth : "calc(100dvw)",
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
                    width: windowWidth
                      ? windowWidth - 400
                      : "calc(100dvw-400px)",
                    borderRadius: 0,
                    transition: {
                      delay: 0,
                      type: "spring",
                      stiffness: 200,
                      damping: 30,
                    },
                  }
            }
            exit={{
              opacity: 0,
              scale: 0.5,
              transition: {
                delay: 0.1,
                type: "spring",
                stiffness: 600,
                damping: 30,
              },
            }}
          >
            {/* Header with close button */}
            <div className="p-4 flex flex-row justify-between items-start border-b">
              <div className="flex flex-col">
                <h2 className="font-semibold text-lg">
                  {artifactData.data.first_name && artifactData.data.last_name
                    ? `${artifactData.data.first_name} ${artifactData.data.last_name}`
                    : artifactData.data.first_name ||
                      artifactData.data.last_name ||
                      "User"}
                </h2>
                <p className="text-sm text-muted-foreground">User Profile</p>
              </div>

              <button
                onClick={closeArtifact}
                className="p-2 hover:bg-muted rounded-md transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Simple content - enhanced user profile */}
            <div className="flex-1 p-6">
              <div className="max-w-2xl mx-auto">
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          First Name
                        </label>
                        <p className="text-base mt-1">
                          {artifactData.data.first_name || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Last Name
                        </label>
                        <p className="text-base mt-1">
                          {artifactData.data.last_name || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Email Address
                      </label>
                      <p className="text-base mt-1">
                        {artifactData.data.email}
                      </p>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Professional Profile
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          GitHub Profile
                        </label>
                        <p className="text-base mt-1 text-muted-foreground italic">
                          Coming soon...
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Portfolio
                        </label>
                        <p className="text-base mt-1 text-muted-foreground italic">
                          Coming soon...
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Skills & Expertise
                        </label>
                        <p className="text-base mt-1 text-muted-foreground italic">
                          Coming soon...
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Additional Information
                    </h3>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        This profile view shows user information in a dedicated
                        panel, similar to Vercel AI's artifact system.
                        Additional profile fields and interactive features will
                        be added here.
                      </p>
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
