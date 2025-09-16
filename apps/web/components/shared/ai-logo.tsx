import React from "react";

interface AILogoProps {
  className?: string;
}

export function AILogo({ className = "w-4 h-4" }: AILogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Neural network nodes */}
      <circle cx="4" cy="4" r="1.5" fill="url(#aiGradient)" />
      <circle cx="12" cy="4" r="1.5" fill="url(#aiGradient)" />
      <circle cx="20" cy="4" r="1.5" fill="url(#aiGradient)" />

      <circle cx="8" cy="12" r="1.5" fill="url(#aiGradient)" />
      <circle cx="16" cy="12" r="1.5" fill="url(#aiGradient)" />

      <circle cx="4" cy="20" r="1.5" fill="url(#aiGradient)" />
      <circle cx="12" cy="20" r="1.5" fill="url(#aiGradient)" />
      <circle cx="20" cy="20" r="1.5" fill="url(#aiGradient)" />

      {/* Neural network connections */}
      <line
        x1="4"
        y1="4"
        x2="8"
        y2="12"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.4"
      />
      <line
        x1="4"
        y1="4"
        x2="16"
        y2="12"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.4"
      />
      <line
        x1="12"
        y1="4"
        x2="8"
        y2="12"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.4"
      />
      <line
        x1="12"
        y1="4"
        x2="16"
        y2="12"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.4"
      />
      <line
        x1="20"
        y1="4"
        x2="8"
        y2="12"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.4"
      />
      <line
        x1="20"
        y1="4"
        x2="16"
        y2="12"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.4"
      />

      <line
        x1="8"
        y1="12"
        x2="4"
        y2="20"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.4"
      />
      <line
        x1="8"
        y1="12"
        x2="12"
        y2="20"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.4"
      />
      <line
        x1="16"
        y1="12"
        x2="12"
        y2="20"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.4"
      />
      <line
        x1="16"
        y1="12"
        x2="20"
        y2="20"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.4"
      />
    </svg>
  );
}
