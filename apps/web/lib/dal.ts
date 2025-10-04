import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";

/**
 * Data Access Layer (DAL)
 * This layer provides secure, cached access to user data and ensures
 * all data fetching operations verify user permissions.
 */

/**
 * Verify and get the current user session.
 * This function is cached per request to avoid multiple auth checks.
 */
export const verifySession = cache(async () => {
  const supabase = await createClient();
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { isAuth: false, userId: null };
  }

  return { isAuth: true, userId: user.id };
});

/**
 * Get chat by slug with permission verification.
 * Cached per request.
 */
export const getChatData = cache(async (slug: string) => {
  const { userId, isAuth } = await verifySession();

  if (!isAuth || !userId) {
    return null;
  }

  const supabase = await createClient();

  const { data: chat, error } = await supabase
    .from("chats")
    .select("*")
    .eq("slug", slug)
    .eq("user_id", userId) // Ensure user owns this chat
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    console.error("Error fetching chat:", error);
    return null;
  }

  return chat;
});

/**
 * Get chat messages by chat ID with permission verification.
 * Cached per request.
 */
export const getChatMessagesData = cache(async (chatId: string, slug: string) => {
  const { userId, isAuth } = await verifySession();

  if (!isAuth || !userId) {
    return [];
  }

  // First verify the user owns this chat
  const chat = await getChatData(slug);
  if (!chat || chat.id !== chatId) {
    return [];
  }

  const supabase = await createClient();

  const { data: messages, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return messages || [];
});

/**
 * Get user's chat history with permission verification.
 * Cached per request.
 */
export const getUserChatsData = cache(async () => {
  const { userId, isAuth } = await verifySession();

  if (!isAuth || !userId) {
    return [];
  }

  const supabase = await createClient();

  const { data: chats, error } = await supabase
    .from("chats")
    .select("id, slug, title, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching user chats:", error);
    return [];
  }

  return chats || [];
});

/**
 * Get the current user ID from the session.
 * Cached per request.
 */
export const getCurrentUserId = cache(async () => {
  const { userId, isAuth } = await verifySession();
  return isAuth ? userId : null;
});
