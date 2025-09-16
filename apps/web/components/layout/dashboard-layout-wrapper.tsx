"use client";

import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ChatNavbar } from "@/components/layout/chat-navbar";
import { SimpleArtifactProvider } from "@/hooks/use-user-detail-panel";
import { SimpleArtifactPanel } from "@/components/panels/user-detail-panel";

interface DashboardLayoutWrapperProps {
  children: React.ReactNode;
}

export function DashboardLayoutWrapper({
  children,
}: DashboardLayoutWrapperProps) {
  return (
    <SimpleArtifactProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 h-14">
            <SidebarTrigger />
            <div className="flex-1">
              <ChatNavbar />
            </div>
          </div>
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </SidebarProvider>
      <SimpleArtifactPanel />
    </SimpleArtifactProvider>
  );
}
