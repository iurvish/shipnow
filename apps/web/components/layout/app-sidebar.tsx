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
import {
  Plus,
  MessageSquare,
  MoreHorizontal,
  HomeIcon,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "./user-menu";
import { ActiveDecorator } from "@/components/ui/active-decorator";
import { useSessionUser } from "@/hooks/use-session-user";
import { useChatHistory } from "@/hooks/use-chat-history-auto";
import { Skeleton } from "@/components/ui/skeleton";

export function AppSidebar() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const { user, loading } = useSessionUser();
  const {
    chatHistory,
    loading: historyLoading,
    error: historyError,
  } = useChatHistory();
  const pathname = usePathname();

  // Format user data for UserMenu
  const userData = user
    ? {
        name:
          [user.first_name, user.last_name].filter(Boolean).join(" ") ||
          "Anonymous User",
        email: user.email,
        avatar: user.profile_picture || "", // Empty string will fallback to initials
      }
    : {
        name: "",
        email: "",
        avatar: "",
      };

  // Group chats by time periods
  const groupChatsByTime = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const groups = {
      Today: [] as typeof chatHistory,
      Yesterday: [] as typeof chatHistory,
      "Last 7 days": [] as typeof chatHistory,
      "Last 30 days": [] as typeof chatHistory,
    };

    chatHistory.forEach((chat) => {
      const chatDate = new Date(chat.updated_at);

      if (chatDate >= today) {
        groups["Today"].push(chat);
      } else if (chatDate >= yesterday) {
        groups["Yesterday"].push(chat);
      } else if (chatDate >= lastWeek) {
        groups["Last 7 days"].push(chat);
      } else if (chatDate >= lastMonth) {
        groups["Last 30 days"].push(chat);
      }
    });

    // Remove empty groups
    return Object.entries(groups).filter(([_, chats]) => chats.length > 0);
  };

  const timeGroups = groupChatsByTime();

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        {loading ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HomeIcon className="size-5" />
              <span className="text-base font-semibold">Chatbot</span>
            </div>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Link href="/chat">
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Projects Section */}
        <div className="mb-6">
          {loading ? (
            <div className="space-y-2 px-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Portfolio
              </div>
              <SidebarMenu className="mt-2">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/projects"
                      className={cn(
                        "relative w-full justify-start text-left h-auto p-3 hover:bg-accent/50 group transition-colors rounded-none",
                        pathname?.startsWith("/dashboard/projects") &&
                          "bg-accent/80"
                      )}
                    >
                      <ActiveDecorator
                        isActive={
                          pathname?.startsWith("/dashboard/projects") ?? false
                        }
                      />
                      <div className="flex items-start gap-3 w-full">
                        <FolderOpen className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            My Projects
                          </div>
                        </div>
                        <div className="h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent transition-opacity">
                          <Plus className="h-3 w-3" />
                        </div>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </>
          )}
        </div>

        {/* Chat History */}
        {timeGroups.map(([groupName, chats]) => (
          <div key={groupName} className="mb-6">
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {groupName}
            </div>
            <SidebarMenu className="mt-2">
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/chat/${chat.slug}`}
                      className={cn(
                        "relative w-full justify-start text-left h-auto p-3 hover:bg-accent/50 group transition-colors rounded-none",
                        pathname === `/chat/${chat.slug}` && "bg-accent/80"
                      )}
                    >
                      <ActiveDecorator
                        isActive={pathname === `/chat/${chat.slug}`}
                      />
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
                    </Link>
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
