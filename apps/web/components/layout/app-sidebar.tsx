"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, MoreHorizontal, HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { UserMenu } from "./user-menu";
import { ActiveDecorator } from "@/components/ui/active-decorator";
import { useSessionUser } from "@/hooks/use-session-user";

// Mock chat history data
const chatHistory = [
  { id: "1", title: "Create Stock Document" },
  { id: "2", title: "NextJS Project Setup" },
  { id: "3", title: "Database Schema Design" },
  { id: "4", title: "API Integration Help" },
];

const timeGroups = {
  "Last 30 days": chatHistory,
};

export function AppSidebar() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const { user, loading } = useSessionUser();

  // Format user data for UserMenu
  const userData = user
    ? {
        name:
          [user.first_name, user.last_name].filter(Boolean).join(" ") ||
          "Anonymous User",
        email: user.email,
        avatar: user.profile_picture || "", // Empty string will fallback to initials
      }
    : loading
      ? {
          name: "Loading...",
          email: "loading...",
          avatar: "",
        }
      : {
          name: "Guest User",
          email: "guest@example.com",
          avatar: "",
        };

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HomeIcon className="size-5" />
            <span className="text-base font-semibold">Chatbot</span>
          </div>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {Object.entries(timeGroups).map(([groupName, chats]) => (
          <div key={groupName} className="mb-6">
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {groupName}
            </div>
            <SidebarMenu className="mt-2">
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveChat(chat.id)}
                    className={cn(
                      "relative w-full justify-start text-left h-auto p-3 hover:bg-accent/50 group transition-colors rounded-none",
                      activeChat === chat.id && "bg-accent/80"
                    )}
                  >
                    <ActiveDecorator isActive={activeChat === chat.id} />
                    <div className="flex items-start gap-3 w-full">
                      <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {chat.title}
                        </div>
                      </div>
                      <div className="h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent transition-opacity">
                        <MoreHorizontal className="h-3 w-3" />
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        ))}

        {chatHistory.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            You have reached the end of your chat history.
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <UserMenu user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
