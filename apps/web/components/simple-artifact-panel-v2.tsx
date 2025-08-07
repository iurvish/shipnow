"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSimpleArtifact } from "../hooks/use-simple-artifact-v2";
import { useWindowSize } from "usehooks-ts";
import { X } from "lucide-react";

export function SimpleArtifactPanel() {
  const { isVisible, artifactData, closeArtifact } = useSimpleArtifact();
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

          {/* Desktop: Left panel (400px) */}
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
              <div className="flex flex-col h-full justify-center items-center p-8">
                <h3 className="text-lg font-semibold mb-4">User Cards</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Click on any user card to see their profile details
                </p>
              </div>
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

            {/* Simple content - just email for now */}
            <div className="flex-1 p-6">
              <div className="max-w-2xl mx-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Email
                    </h3>
                    <p className="text-lg">{artifactData.data.email}</p>
                  </div>

                  <div className="pt-8 text-center">
                    <p className="text-sm text-muted-foreground italic">
                      More profile details like GitHub URL, portfolio, and other
                      information will be added here...
                    </p>
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
