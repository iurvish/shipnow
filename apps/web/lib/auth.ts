import { supabase } from "./supabase";

export async function signup(email: string, password: string) {
  return await supabase.auth.signUp({
    email,
    password,
  });
}

export async function verifyOtp(email: string, otp: string) {
  return await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: "signup",
  });
}

export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
}

export async function login(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function logout() {
  return await supabase.auth.signOut();
}
