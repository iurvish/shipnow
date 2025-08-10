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
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center ring-2 ring-primary/10">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background"></div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl font-bold text-foreground truncate">
                        {userData.first_name} {userData.last_name}
                      </h1>
                      <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4" />
                        {userData.email}
                      </p>
                      {userData.technical_profile?.preferred_roles?.[0] && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {userData.technical_profile.preferred_roles[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeArtifact}
                    className="h-8 w-8 p-0 hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Experience Badge */}
                {userData.technical_profile?.experience_level && (
                  <div className="mt-4">
                    <Badge
                      variant="outline"
                      className={`${getExperienceColor(userData.technical_profile.experience_level)} capitalize`}
                    >
                      <Briefcase className="w-3 h-3 mr-1" />
                      {userData.technical_profile.experience_level} Level
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {/* Bio Section */}
                {userData.bio && (
                  <Card className="border-border/50">
                    <CardHeader className="pb-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        About
                      </h3>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {userData.bio}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Contact & Personal Info */}
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Contact Information
                    </h3>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-sm font-medium truncate">
                            {userData.email}
                          </p>
                        </div>
                      </div>

                      {userData.personal_details?.phone && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground">
                              Phone
                            </p>
                            <p className="text-sm font-medium">
                              {userData.personal_details.phone}
                            </p>
                          </div>
                        </div>
                      )}

                      {userData.date_of_birth && (
                        <div className="flex items-center gap-3 sm:col-span-2">
                          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground">
                              Date of Birth
                            </p>
                            <p className="text-sm font-medium">
                              {formatDate(userData.date_of_birth)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Education */}
                {userData.personal_details && (
                  <Card className="border-border/50">
                    <CardHeader className="pb-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        Education
                      </h3>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground capitalize">
                            {userData.personal_details.degree_level?.replace(
                              "_",
                              " "
                            )}{" "}
                            Degree
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {userData.personal_details.department}
                          </p>
                          <p className="text-sm font-medium text-foreground mt-1">
                            {userData.personal_details.university}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Technical Skills */}
                {userData.technical_profile?.primary_skills && (
                  <Card className="border-border/50">
                    <CardHeader className="pb-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Code className="w-4 h-4 text-primary" />
                        Technical Skills
                      </h3>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2">
                        {userData.technical_profile.primary_skills.map(
                          (skill: string, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors"
                            >
                              {skill}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Interests */}
                {userData.technical_profile?.interests && (
                  <Card className="border-border/50">
                    <CardHeader className="pb-3">
                      <h3 className="font-semibold text-sm">Interests</h3>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2">
                        {userData.technical_profile.interests.map(
                          (interest: string, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-muted-foreground/20 hover:bg-muted transition-colors"
                            >
                              {interest}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Social Links & Actions */}
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-primary" />
                      Links & Actions
                    </h3>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button variant="default" className="w-full" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>

                      {userData.technical_profile?.github_url && (
                        <Button
                          variant="outline"
                          className="w-full"
                          size="sm"
                          asChild
                        >
                          <a
                            href={userData.technical_profile.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      )}

                      {userData.technical_profile?.linkedin_url && (
                        <Button
                          variant="outline"
                          className="w-full"
                          size="sm"
                          asChild
                        >
                          <a
                            href={userData.technical_profile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Linkedin className="w-4 h-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      )}

                      {userData.technical_profile?.portfolio_url && (
                        <Button
                          variant="outline"
                          className="w-full"
                          size="sm"
                          asChild
                        >
                          <a
                            href={userData.technical_profile.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Portfolio
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Debug Info (only in development) */}
                <Card className="border-dashed border-muted-foreground/20">
                  <CardContent className="pt-6">
                    <p className="text-xs text-muted-foreground">
                      Profile ID: {artifactData.data.id || "temp-id-123"} • Last
                      updated: {new Date().toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
