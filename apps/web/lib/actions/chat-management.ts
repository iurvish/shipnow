"use server";

import { createClient } from "@/lib/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { nanoid } from "nanoid";

const titleSchema = z.object({
  title: z.string().max(50).describe("A concise, descriptive title for the chat based on the user's first message"),
});

export async function generateChatTitle(firstMessage: string): Promise<string> {
  try {
    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: titleSchema,
      prompt: `Generate a short, descriptive title (max 50 characters) for a chat based on this first message: "${firstMessage}". The title should capture the main topic or intent.`,
    });

    return object.title;
  } catch (error) {
    console.error("Error generating title:", error);
    // Fallback to a simple truncated version
    return firstMessage.length > 40 
      ? firstMessage.substring(0, 37) + "..." 
      : firstMessage;
  }
}

export async function createChatWithFirstMessage(
  userId: string,
  firstMessage: string
): Promise<{ chat: any | null; success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Generate title using AI
    const title = await generateChatTitle(firstMessage);
    const slug = nanoid(12);

    // Create the chat
    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .insert({
        user_id: userId,
        title,
        slug,
      })
      .select()
      .single();

    if (chatError) {
      console.error("Error creating chat:", chatError);
      return { chat: null, success: false, error: chatError.message };
    }

    // Add the first message
    const { error: messageError } = await supabase
      .from("chat_messages")
      .insert({
        chat_id: chat.id,
        role: "user",
        content: firstMessage,
      });

    if (messageError) {
      console.error("Error creating first message:", messageError);
      // Don't fail completely, just log the error
    }

    return { chat, success: true };
  } catch (error) {
    console.error("Error in createChatWithFirstMessage:", error);
    return { 
      chat: null, 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function saveChatMessage(
  chatId: string,
  role: "user" | "assistant",
  content: string,
  metadata?: any
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("chat_messages")
      .insert({
        chat_id: chatId,
        role,
        content,
        metadata: metadata || {},
      });

    if (error) {
      console.error("Error saving message:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in saveChatMessage:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function getChatBySlug(slug: string): Promise<{ 
  chat: any | null; 
  success: boolean; 
  error?: string 
}> {
  try {
    const supabase = await createClient();
    
    const { data: chat, error } = await supabase
      .from("chats")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return { chat: null, success: false, error: "Chat not found" };
      }
      console.error("Error fetching chat:", error);
      return { chat: null, success: false, error: error.message };
    }

    return { chat, success: true };
  } catch (error) {
    console.error("Error in getChatBySlug:", error);
    return { 
      chat: null, 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function getChatMessages(chatId: string): Promise<{
  messages: any[] | null;
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    
    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return { messages: null, success: false, error: error.message };
    }

    return { messages: messages || [], success: true };
  } catch (error) {
    console.error("Error in getChatMessages:", error);
    return { 
      messages: null, 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}