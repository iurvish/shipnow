"use client";
import React from "react";
import ShowChats from "@/components/ShowChats";

interface ShowChatsWrapperProps {
  slug: string;
}

export default function ShowChatsWrapper({ slug }: ShowChatsWrapperProps) {
  return <ShowChats slug={slug} />;
}
