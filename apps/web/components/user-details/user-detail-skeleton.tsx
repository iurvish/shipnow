"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function UserDetailSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="p-6 border-b border-border/40 bg-muted/30">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-6">
        {/* Bio Section */}
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Education Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        </div>

        {/* Technical Profile Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-4">
            {/* Experience Level */}
            <div>
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Skills */}
            <div>
              <Skeleton className="h-3 w-32 mb-3" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <Skeleton className="h-3 w-12 mb-3" />
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-3 ml-auto" />
                </div>
                <div className="flex items-center gap-2 p-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-3 ml-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions Skeleton */}
      <div className="p-6 border-t border-border/40 bg-muted/30">
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
