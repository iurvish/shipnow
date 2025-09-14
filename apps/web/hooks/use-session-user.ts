"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/client";

interface SessionUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  profile_picture?: string | null;
}

/**
 * Ultra-fast user hook that only uses session/cookie data.
 * No API calls, immediate access to basic user information.
 * Perfect for UI components that need quick user data.
 */
export function useSessionUser() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSessionUser() {
      try {
        const supabase = createClient();
        const { data: { user: authUser }, error } = await supabase.auth.getUser();

        if (error || !authUser) {
          setUser(null);
        } else {
          setUser({
            id: authUser.id,
            first_name: authUser.user_metadata?.first_name || null,
            last_name: authUser.user_metadata?.last_name || null,
            email: authUser.email || "",
            profile_picture: authUser.user_metadata?.avatar_url || null,
          });
        }
      } catch (err) {
        console.error("Error getting session user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    getSessionUser();

    // Listen for auth state changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        getSessionUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
