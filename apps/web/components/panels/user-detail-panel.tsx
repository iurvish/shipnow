"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSimpleArtifact } from "../../hooks/use-user-detail-panel";
import { useWindowSize } from "usehooks-ts";
import { useState } from "react";
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
import ChatMessages from "../shared/chat-messages";
import AIInputSearch from "../shared/ai-input-search";
import { ChatResponse } from "@/lib/actions/chat-actions";

export function SimpleArtifactPanel() {
  const { isVisible, artifactData, closeArtifact, messages, sendMessage } =
    useSimpleArtifact();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  // Chat input state
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Send message through the main chat system
    if (sendMessage) {
      sendMessage(input);
    }
    setInput("");
  };

  const handleUserMessage = (content: string) => {
    if (sendMessage) {
      sendMessage(content);
    }
  };

  const handleAIResponse = (response: ChatResponse) => {
    // Handle AI response if needed
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!artifactData) return null;

  // Fallback data for missing database values
  const fallbackData = {
    first_name: "Alex",
    last_name: "Johnson",
    email: "alex.johnson@example.com",
    bio: "Passionate full-stack developer with expertise in modern web technologies. I love building scalable applications and contributing to open-source projects.",
    date_of_birth: "1995-03-15",
    profile_picture: null,
    personal_details: {
      university: "Stanford University",
      department: "Computer Science",
      degree_level: "bachelor",
      phone: "+1 (555) 123-4567",
    },
    technical_profile: {
      primary_skills: [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "Python",
        "PostgreSQL",
      ],
      experience_level: "intermediate",
      interests: ["Machine Learning", "Web3", "Open Source", "UI/UX Design"],
      preferred_roles: [
        "Full Stack Developer",
        "Frontend Engineer",
        "Software Engineer",
      ],
      github_url: "https://github.com/alexjohnson",
      linkedin_url: "https://linkedin.com/in/alexjohnson",
      portfolio_url: "https://alexjohnson.dev",
      tools_proficiency: ["VS Code", "Docker", "AWS", "Figma", "Git"],
    },
  };

  // Merge user data with fallbacks
  const userData = {
    ...fallbackData,
    ...artifactData.data,
    personal_details: {
      ...fallbackData.personal_details,
      ...artifactData.data.personal_details,
    },
    technical_profile: {
      ...fallbackData.technical_profile,
      ...artifactData.data.technical_profile,
    },
  };

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

  const getExperienceColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "advanced":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "expert":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="flex flex-row h-dvh w-dvw fixed top-0 left-0 z-50 bg-transparent"
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
                        isLoading={isLoading}
                        loadingMessage="Searching for people..."
                      />
                    </div>
                  </div>

                  {/* Sticky Input Area */}
                  <div className="lg:w-[88%] xl:w-[80%] md:w-full w-full mx-auto bg-transparent">
                    <AIInputSearch
                      onResponse={handleAIResponse}
                      onUserMessage={handleUserMessage}
                      disabled={isLoading}
                      placeholder="Ask about this person..."
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Profile Details - Full width on mobile, 2/5 on desktop */}
              <div className="w-full md:w-2/5 p-5 bg-neutral-800 flex flex-col gap-3.5 relative overflow-y-auto">
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
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div className="py-2 flex flex-col justify-start items-start gap-2">
                    <div className="justify-start">
                      <span className="text-neutral-50 text-3xl font-bold font-mono leading-none">
                        {userData.first_name}
                      </span>
                      <span className="text-neutral-50 text-3xl font-bold font-mono leading-none">
                        {" "}
                      </span>
                      <span className="text-neutral-50 text-3xl font-bold font-mono leading-none">
                        {userData.last_name}
                      </span>
                    </div>
                    <div className="justify-start text-zinc-400 text-base font-normal font-mono leading-none">
                      {userData.email}
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                {userData.bio && (
                  <div className="self-stretch border-b border-neutral-600 flex flex-col justify-start items-start gap-2 pb-3.5">
                    <div className="justify-start text-white text-lg font-medium font-mono uppercase">
                      Bio
                    </div>
                    <div className="self-stretch justify-start text-zinc-400 text-sm font-normal font-mono leading-snug">
                      {userData.bio}
                    </div>
                  </div>
                )}

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
                        <div className="self-stretch py-[3px] flex flex-col justify-start items-start gap-0.5">
                          <div className="justify-start text-zinc-400 text-xs font-normal font-mono uppercase leading-none">
                            education
                          </div>
                          <div className="justify-start text-white text-sm font-normal font-mono leading-none">
                            {userData.personal_details?.university ||
                              "Stanford University"}
                          </div>
                        </div>
                      </div>

                      {/* GitHub - Top Right */}
                      <div className="p-1.5 border-b border-neutral-600 flex justify-start items-start gap-1">
                        <div className="p-[5px] bg-white/5 rounded-lg shadow-sm outline-[0.80px] outline-offset-[-0.80px] outline-white/20 flex justify-start items-center">
                          <Github
                            className="w-6 h-6 text-zinc-400"
                            strokeWidth={1.2}
                          />
                        </div>
                        <div className="self-stretch py-[3px] flex flex-col justify-start items-start gap-0.5">
                          <div className="justify-start text-zinc-400 text-xs font-normal font-mono leading-none">
                            GITHUB
                          </div>
                          <div className="justify-start text-white text-sm font-normal font-mono leading-none">
                            {userData.technical_profile?.github_url
                              ? `@${userData.technical_profile.github_url.split("/").pop()}`
                              : "@charlicodes"}
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
                          <div className="justify-start text-zinc-400 text-xs font-normal font-mono uppercase leading-none">
                            linkedin
                          </div>
                          <div className="justify-start text-white text-sm font-normal font-mono leading-none">
                            {userData.technical_profile?.linkedin_url
                              ? `@${userData.technical_profile.linkedin_url.split("/").pop()}`
                              : "@charile16"}
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
                          <div className="justify-start text-zinc-400 text-xs font-normal font-mono uppercase leading-none">
                            portfolio
                          </div>
                          <div className="justify-start text-white text-sm font-normal font-mono leading-none">
                            {userData.technical_profile?.portfolio_url
                              ? userData.technical_profile.portfolio_url.replace(
                                  "https://",
                                  ""
                                )
                              : "charliebrown.com"}
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
                    {userData.technical_profile.primary_skills.map(
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
                    )}
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
