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
} from "lucide-react";
import ChatItem from "../shared/chat-item";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";

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

              {/* Chat Messages - with fixed height to leave room for input */}
              <div className="flex-1 flex flex-col min-h-0">
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
                          No messages yet. Start a conversation in the main
                          chat!
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Fixed Chat Input */}
                <div className="p-4 border-t border-border bg-background/95 backdrop-blur-sm">
                  <div className="flex gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Continue the conversation..."
                      className="min-h-[40px] max-h-[120px] resize-none flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      size="sm"
                      className="px-3"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Press Enter to send, Shift + Enter for new line
                  </p>
                </div>
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
            {/* Modern User Profile Header */}
            <div className="border-b border-border/50 bg-gradient-to-r from-background via-muted/20 to-background">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div
                      className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center ring-2 ring-primary/10 shrink-0"
                      style={{
                        clipPath:
                          "polygon(0% 15%, 15% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)",
                      }}
                    >
                      <User className="w-12 h-12 text-primary" />
                    </div>

                    {/* User Info */}
                    <div className="space-y-1.5">
                      <h1 className="text-2xl font-bold text-foreground">
                        {userData.first_name} {userData.last_name}
                      </h1>
                      <p className="text-muted-foreground">
                        {userData.technical_profile?.preferred_roles?.[0] || 'Software Engineer'}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {userData.email}
                      </p>
                    </div>
                  </div>

                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeArtifact}
                    className="self-start"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Experience Badge */}
                {userData.technical_profile?.experience_level && (
                  <div className="mt-5">
                    <Badge
                      variant="outline"
                      className={`${getExperienceColor(userData.technical_profile.experience_level)} capitalize`}
                    >
                      <Briefcase className="w-3 h-3 mr-1.5" />
                      {userData.technical_profile.experience_level} Experience
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-8">
                {/* Bio Section */}
                {userData.bio && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground tracking-wide uppercase">About</h3>
                    <p className="text-sm text-foreground leading-relaxed">
                      {userData.bio}
                    </p>
                  </div>
                )}

                {/* Details Section */}
                <div className="space-y-4 pt-8 border-t border-border/50">
                  <h3 className="font-semibold text-sm text-muted-foreground tracking-wide uppercase">Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{userData.email}</span>
                    </div>
                    {userData.personal_details?.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{userData.personal_details.phone}</span>
                      </div>
                    )}
                    {userData.date_of_birth && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{formatDate(userData.date_of_birth)}</span>
                      </div>
                    )}
                    {userData.personal_details?.university && (
                       <div className="flex items-center gap-3">
                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{userData.personal_details.university}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills & Interests Section */}
                <div className="space-y-4 pt-8 border-t border-border/50">
                  <h3 className="font-semibold text-sm text-muted-foreground tracking-wide uppercase">Skills & Interests</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Primary Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {userData.technical_profile.primary_skills.map(
                          (skill: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                     <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {userData.technical_profile.interests.map(
                          (interest: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {interest}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Links Section */}
                <div className="space-y-3 pt-8 border-t border-border/50">
                  <h3 className="font-semibold text-sm text-muted-foreground tracking-wide uppercase">Links</h3>
                  <div className="flex items-center gap-2">
                     {userData.technical_profile?.github_url && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={userData.technical_profile.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {userData.technical_profile?.linkedin_url && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={userData.technical_profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {userData.technical_profile?.portfolio_url && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={userData.technical_profile.portfolio_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Debug Info (only in development) */}
                <p className="text-xs text-muted-foreground text-center pt-8 border-t border-border/50">
                  Profile ID: {artifactData.data.id || "temp-id-123"}
                </p>
              </div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
