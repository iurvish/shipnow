"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSimpleArtifact } from "../../hooks/use-user-detail-panel";
import { useWindowSize } from "usehooks-ts";
import {
  X,
  MessageCircle,
  Send,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Code,
  Github,
  Linkedin,
  ExternalLink,
  Calendar,
  Briefcase,
  Globe,
} from "lucide-react";
import ChatItem from "../shared/chat-item";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import ChatMessages, { ChatMessage } from "../shared/chat-messages";
import AIInputSearch from "@/components/shared/ai-input-search-simple";
import { ChatResponse } from "@/lib/actions/chat-actions";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import type { Project } from "@/lib/types";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";

// Narrow client-side project shape for lightweight rendering
type MinimalProject = Pick<
  Project,
  "id" | "project_name" | "project_image" | "tags" | "case_summary"
>;

export function SimpleArtifactPanel() {
  const {
    isVisible,
    artifactData,
    closeArtifact,
    messages,
    sendMessage,
    onAIResponse,
    isLoading,
  } = useSimpleArtifact();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  const handleUserMessage = (content: string) => {
    // Pass the message to the main chat system through sendMessage
    if (sendMessage) {
      sendMessage(content);
    }
  };

  const handleAIResponse = (response: ChatResponse) => {
    // This shouldn't be needed since we're using the main chat system
    console.log("Artifact panel handleAIResponse called with:", response);
    if (onAIResponse) {
      onAIResponse(response);
    }
  };

  // Load user's projects (client-side) - must be before any early returns to keep hook order stable
  const [projects, setProjects] = useState<MinimalProject[] | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<MinimalProject | null>(
    null
  );
  const [selectedProjectFull, setSelectedProjectFull] =
    useState<Project | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      const targetUserId = artifactData?.data?.id;
      if (!targetUserId) {
        if (isMounted) setProjects(null);
        return;
      }
      try {
        setProjectsLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from("projects")
          .select(
            "id, project_name, project_image, tags, case_summary, created_at"
          )
          .eq("user_id", targetUserId)
          .order("created_at", { ascending: false });
        if (error) {
          console.error("Error loading projects:", error);
        }
        if (isMounted) {
          setProjects((data as MinimalProject[]) || []);
        }
      } catch (e) {
        console.error("Failed to load projects", e);
      } finally {
        if (isMounted) setProjectsLoading(false);
      }
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [artifactData?.data?.id]);

  const openProjectDrawer = async (project: MinimalProject) => {
    setSelectedProject(project);
    setIsProjectDrawerOpen(true);
    setDrawerLoading(true);
    setSelectedProjectFull(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", project.id)
        .single();
      if (error) {
        console.error("Failed to load project details:", error);
      } else {
        setSelectedProjectFull(data as Project);
      }
    } catch (e) {
      console.error("Failed to fetch project details", e);
    } finally {
      setDrawerLoading(false);
    }
  };

  if (!artifactData) return null;

  // Use only real database data - no fallbacks
  const userData = artifactData.data;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="flex flex-row h-dvh w-dvw fixed inset-0 z-[999] bg-black/20"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.4 } }}
        >
          {/* Main artifact panel - Now full width and centered */}
          <motion.div
            className="w-full flex flex-col h-dvh overflow-y-scroll bg-background dark:bg-muted"
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
                    x: 0, // Animate to x:0 for full width
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
            }
            exit={{
              opacity: 0,
              scale: 0.5,
              transition: {
                delay: 0.2,
                type: "spring",
                stiffness: 600,
                damping: 30,
              },
            }}
          >
            <div className="flex-1 flex flex-col md:flex-row h-full">
              {/* Left Column - Chat Messages - Hidden on mobile */}
              <div className="hidden md:flex md:w-3/5 relative bg-muted dark:bg-background h-dvh shrink-0 border-r border-border flex-col">
                {/* Messages Area */}
                <div className="hide-scrollbar w-full flex flex-col justify-between min-h-0 bg-transparent">
                  <div className="flex-1 overflow-y-auto pb-24 bg-transparent">
                    <div className="max-w-6xl mx-auto">
                      <ChatMessages
                        messages={messages}
                        isLoading={isLoading || false}
                        loadingMessage="Searching for people..."
                      />
                    </div>
                  </div>

                  {/* Sticky Input Area */}
                  <div className="md:w-full w-full mx-auto bg-transparent">
                    <AIInputSearch
                      onSearch={handleUserMessage}
                      disabled={isLoading || false}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Profile Details - Full width on mobile, 2/5 on desktop */}
              <ScrollArea className="w-full md:w-2/5 bg-neutral-800 h-dvh">
                <div className="p-5 flex flex-col gap-3.5 relative">
                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeArtifact}
                    className="absolute top-4 right-4 h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {/* Header with Avatar and Name */}
                  <div className="self-stretch flex justify-start items-center gap-3">
                    <div
                      className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center"
                      style={{
                        clipPath:
                          "polygon(0% 15%, 15% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)",
                      }}
                    >
                      {userData.avatar_url ? (
                        <Image
                          src={userData.avatar_url}
                          alt="Profile Picture"
                          width={64}
                          height={64}
                        />
                      ) : (
                        <User className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <div className="py-2 flex flex-col justify-start items-start gap-2">
                      <div className="justify-start">
                        <span className="text-neutral-50 text-3xl font-bold font-mono leading-none capitalize">
                          {userData.first_name}
                        </span>
                        <span className="text-neutral-50 text-3xl font-bold font-mono leading-none">
                          {" "}
                        </span>
                        <span className="text-neutral-50 text-3xl font-bold font-mono leading-none capitalize">
                          {userData.last_name}
                        </span>
                      </div>
                      <div className="justify-start text-zinc-400 text-base font-normal font-mono leading-none lowercase">
                        {userData.email}
                      </div>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="self-stretch border-b border-neutral-600 flex flex-col justify-start items-start gap-2 pb-3.5">
                    <div className="justify-start text-white text-lg font-medium font-mono uppercase">
                      Bio
                    </div>
                    <div className="self-stretch justify-start text-zinc-400 text-sm font-normal font-mono leading-snug">
                      {userData.bio || "Bio not added"}
                    </div>
                  </div>

                  {/* Essentials Section */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-2 overflow-hidden">
                    <div className="w-20 justify-start text-white text-lg font-medium font-mono uppercase">
                      Essentials
                    </div>
                    <div className="self-stretch">
                      {/* 2x2 Grid Layout */}
                      <div className="grid grid-cols-2 border border-neutral-600">
                        {/* Education - Top Left */}
                        <div className="p-1.5 border-r border-b border-neutral-600 flex justify-start items-start gap-1">
                          <div className="p-[5px] bg-white/5 rounded-lg shadow-sm outline-[0.80px] outline-offset-[-0.80px] outline-white/20 flex justify-start items-start">
                            <GraduationCap
                              className="w-6 h-6 text-zinc-400"
                              strokeWidth={1.2}
                            />
                          </div>
                          <div className="self-stretch py-[3px] flex flex-col justify-start items-start gap-[2.5px]">
                            <div className="justify-start text-zinc-400 text-xs font-normal font-mono uppercase leading-none">
                              education
                            </div>
                            <div className="justify-start text-white text-sm font-normal font-mono leading-none capitalize">
                              {userData.personal_details?.university ||
                                "University not added"}
                            </div>
                          </div>
                        </div>

                        {/* GitHub - Top Right */}
                        <div className="p-1.5 border-b border-neutral-600 flex justify-start items-start gap-1 ">
                          <div className="p-[5px] bg-white/5 rounded-lg shadow-sm outline-[0.80px] outline-offset-[-0.80px] outline-white/20 flex justify-start items-center ">
                            <Github
                              className="w-6 h-6 text-zinc-400"
                              strokeWidth={1.2}
                            />
                          </div>
                          <div className="self-stretch py-[3px] flex flex-col justify-start items-start gap-[2.5px] ">
                            <div className="justify-start text-zinc-400 text-xs font-normal font-mono leading-none">
                              GITHUB
                            </div>
                            <div className="justify-start text-white text-sm font-normal font-mono leading-none  ">
                              {userData.technical_profile?.github ? (
                                <Link
                                  href={userData.technical_profile.github}
                                  target="_blank"
                                  className="hover:underline "
                                  rel="noopener noreferrer"
                                >
                                  @
                                  {userData.technical_profile.github
                                    .replace(
                                      /https?:\/\/(www\.)?github\.com\//,
                                      ""
                                    )
                                    .replace(/\/$/, "")}
                                </Link>
                              ) : (
                                "Not added"
                              )}
                            </div>
                          </div>
                        </div>

                        {/* LinkedIn - Bottom Left */}
                        <div className="p-1.5 border-r border-neutral-600 flex justify-start items-start gap-1">
                          <div className="p-[5px] bg-white/5 rounded-lg shadow-sm outline-[0.80px] outline-offset-[-0.80px] outline-white/20 flex justify-start items-start">
                            <Linkedin
                              className="w-6 h-6 text-zinc-400"
                              strokeWidth={1.2}
                            />
                          </div>
                          <div className="self-stretch py-[3px] flex flex-col justify-start items-start gap-0.5">
                            <div className="justify-start text-zinc-400 text-xs font-normal font-mono uppercase leading-none gap-[2.5px]">
                              linkedin
                            </div>
                            <div className="justify-start text-white text-sm font-normal font-mono leading-none capitalize">
                              {userData.technical_profile?.linkedin ? (
                                <Link
                                  href={userData.technical_profile.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline "
                                >
                                  @
                                  {(() => {
                                    const match =
                                      userData.technical_profile.linkedin.match(
                                        /linkedin\.com\/in\/([^\/?#]+)/i
                                      );
                                    return match
                                      ? match[1]
                                      : userData.technical_profile.linkedin
                                          .replace(
                                            /https?:\/\/(www\.)?linkedin\.com\//,
                                            ""
                                          )
                                          .replace(/\/$/, "");
                                  })()}
                                </Link>
                              ) : (
                                "Not added"
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Portfolio - Bottom Right */}
                        <div className="p-1.5 flex justify-start items-start gap-1">
                          <div className="p-[5px] bg-white/5 rounded-lg shadow-sm outline-[0.80px] outline-offset-[-0.80px] outline-white/20 flex justify-start items-start">
                            <Globe
                              className="w-6 h-6 text-zinc-400"
                              strokeWidth={1.2}
                            />
                          </div>
                          <div className="self-stretch py-[3px] flex flex-col justify-start items-start gap-0.5">
                            <div className="justify-start text-zinc-400 text-xs font-normal font-mono uppercase leading-none gap-[2.5px]">
                              portfolio
                            </div>
                            <div className="justify-start text-white text-sm font-normal font-mono leading-none">
                              {userData.technical_profile?.portfolio ? (
                                <Link
                                  href={userData.technical_profile.portfolio}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {userData.technical_profile.portfolio.replace(
                                    /^https?:\/\//,
                                    ""
                                  )}
                                </Link>
                              ) : (
                                "Not added"
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-2 overflow-hidden">
                    <div className="w-20 justify-start text-white text-lg font-medium font-mono uppercase">
                      SKILLS
                    </div>
                    <div className="flex justify-start items-start gap-2 flex-wrap">
                      {userData.technical_profile?.skills &&
                      userData.technical_profile.skills.length > 0 ? (
                        userData.technical_profile.skills.map(
                          (skill: string, index: number) => (
                            <div
                              key={index}
                              className="p-2 bg-zinc-100 flex justify-start items-center"
                            >
                              <div className="justify-start text-neutral-500 text-sm font-medium font-mono uppercase">
                                {skill}
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <div className="text-zinc-400 text-sm font-normal font-mono">
                          Skills not added
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Projects Section */}
                  {projectsLoading && (!projects || projects.length === 0) ? (
                    <div className="self-stretch">
                      <div className="w-28 justify-start text-white text-lg font-medium font-mono uppercase mb-3">
                        PROJECTS
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex flex-col gap-2">
                            <Skeleton className="w-full aspect-[16/10]" />
                            <Skeleton className="h-4 w-2/3" />
                            <div className="flex gap-1">
                              <Skeleton className="h-5 w-14" />
                              <Skeleton className="h-5 w-10" />
                              <Skeleton className="h-5 w-16" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {projects && projects.length > 0 ? (
                    <div className="self-stretch flex flex-col justify-start items-start gap-3 overflow-hidden mt-4">
                      <div className="w-28 justify-start text-white text-lg font-medium font-mono uppercase">
                        PROJECTS
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                        {projects.map((project) => {
                          const hasImage = Boolean(project.project_image);
                          return (
                            <div
                              key={project.id}
                              className={
                                hasImage
                                  ? "flex flex-col gap-2"
                                  : "flex flex-col gap-2 border border-neutral-600 p-3"
                              }
                            >
                              {hasImage && (
                                <button
                                  type="button"
                                  className="w-full aspect-[16/10] overflow-hidden text-left"
                                  onClick={() => openProjectDrawer(project)}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={project.project_image as string}
                                    alt={project.project_name}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              )}
                              <button
                                type="button"
                                className="text-white font-mono text-base leading-tight text-left hover:underline"
                                onClick={() => openProjectDrawer(project)}
                              >
                                {project.project_name}
                              </button>
                              {Array.isArray(project.tags) &&
                                project.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {project.tags.slice(0, 6).map((tag) => (
                                      <span
                                        key={tag}
                                        className="text-[11px] font-mono uppercase text-zinc-400 border border-neutral-700 px-1.5 py-0.5"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              {!hasImage && project.case_summary ? (
                                <p
                                  className="text-zinc-400 text-sm font-mono"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical" as any,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {project.case_summary}
                                </p>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {/* Project Drawer */}
                  <Drawer
                    open={isProjectDrawerOpen}
                    onOpenChange={setIsProjectDrawerOpen}
                  >
                    <DrawerContent className="min-h-[90vh]">
                      <DrawerHeader>
                        <DrawerTitle>
                          {selectedProjectFull?.project_name ||
                            selectedProject?.project_name}
                        </DrawerTitle>
                      </DrawerHeader>
                      <ScrollArea className="max-h-[75vh] overflow-y-auto">
                        <div className="p-4 flex flex-col gap-4">
                          {drawerLoading ? (
                            <>
                              <Skeleton className="w-full h-40 md:h-56" />
                              <div className="flex gap-1">
                                {Array.from({ length: 4 }).map((_, i) => (
                                  <Skeleton key={i} className="h-5 w-16" />
                                ))}
                              </div>
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-4 w-2/3" />
                            </>
                          ) : null}
                          {!drawerLoading &&
                          (selectedProjectFull?.project_image ||
                            selectedProject?.project_image) ? (
                            <div className=" flex w-full items-center justify-center">
                              {/* eslint-disable-next-lin e @next/next/no-img-element */}
                              <img
                                src={
                                  (selectedProjectFull?.project_image ||
                                    selectedProject?.project_image) as string
                                }
                                alt={
                                  selectedProjectFull?.project_name ||
                                  selectedProject?.project_name ||
                                  "Project"
                                }
                                className="w-[70%] h-fit max-auto flex  md:h-fit max-md:w-full overflow-hidden object-cover"
                              />
                            </div>
                          ) : null}
                          {!drawerLoading &&
                          (selectedProjectFull?.tags?.length ||
                            selectedProject?.tags?.length) ? (
                            <div className="flex flex-wrap gap-1">
                              {(
                                selectedProjectFull?.tags ||
                                selectedProject?.tags ||
                                []
                              )
                                .slice(0, 6)
                                .map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[11px] font-mono uppercase text-zinc-400 border border-neutral-700 px-1.5 py-0.5"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                          ) : null}
                          {!drawerLoading &&
                          (selectedProjectFull?.live_site_url ||
                            selectedProjectFull?.github_link) ? (
                            <div className="flex gap-3 pt-1">
                              {selectedProjectFull.live_site_url ? (
                                <Link
                                  href={selectedProjectFull.live_site_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary underline text-sm font-mono"
                                >
                                  Live Site
                                </Link>
                              ) : null}
                              {selectedProjectFull.github_link ? (
                                <Link
                                  href={selectedProjectFull.github_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary underline text-sm font-mono"
                                >
                                  GitHub
                                </Link>
                              ) : null}
                            </div>
                          ) : null}

                          {/* Detailed Sections */}
                          {!drawerLoading &&
                          selectedProjectFull?.case_summary ? (
                            <section className="pt-1">
                              <h2 className="text-white font-semibold text-base font-mono mb-1">
                                Case Summary
                              </h2>
                              <p className="text-zinc-300 text-sm font-mono leading-snug whitespace-pre-line">
                                {selectedProjectFull.case_summary}
                              </p>
                            </section>
                          ) : null}

                          {!drawerLoading &&
                          selectedProjectFull?.build_journey ? (
                            <section className="pt-1">
                              <h2 className="text-white font-semibold text-base font-mono mb-1">
                                Build Journey
                              </h2>
                              <p className="text-zinc-300 text-sm font-mono leading-snug whitespace-pre-line">
                                {selectedProjectFull.build_journey}
                              </p>
                            </section>
                          ) : null}

                          {!drawerLoading &&
                          selectedProjectFull?.key_features &&
                          selectedProjectFull.key_features.length > 0 ? (
                            <section className="pt-1">
                              <h2 className="text-white font-semibold text-base font-mono mb-1">
                                Key Features
                              </h2>
                              <ul className="list-disc pl-5 space-y-1">
                                {selectedProjectFull.key_features.map(
                                  (feat, idx) => (
                                    <li
                                      key={idx}
                                      className="text-zinc-300 text-sm font-mono leading-snug"
                                    >
                                      {feat}
                                    </li>
                                  )
                                )}
                              </ul>
                            </section>
                          ) : null}

                          {!drawerLoading && selectedProjectFull?.results ? (
                            <section className="pt-1 pb-2">
                              <h2 className="text-white font-semibold text-base font-mono mb-1">
                                Results
                              </h2>
                              <p className="text-zinc-300 text-sm font-mono leading-snug whitespace-pre-line">
                                {selectedProjectFull.results}
                              </p>
                            </section>
                          ) : null}
                        </div>
                      </ScrollArea>
                    </DrawerContent>
                  </Drawer>
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
