import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function POST() {
  try {
    const supabase = await createClient();

    // Check if user_profiles table exists
    const { data: tables } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "user_profiles")
      .eq("table_schema", "public");

    if (!tables || tables.length === 0) {
      return NextResponse.json({
        message:
          "User profiles table doesn't exist. Please run the migration manually in Supabase SQL Editor.",
        migration_sql: "See manual_migration.sql file",
      });
    }

    // Create profile for current user if it doesn't exist
    const { data: user } = await supabase.auth.getUser();

    if (user?.user) {
      const { error } = await supabase.from("user_profiles").upsert(
        {
          id: user.user.id,
          email: user.user.email,
          username: user.user.email?.split("@")[0] || "user",
          onboarded: false,
        },
        {
          onConflict: "id",
        }
      );

      if (error) {
        console.error("Error creating user profile:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      message: "User profile setup completed",
      user_id: user?.user?.id,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to setup user profile" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "User Profile Setup API",
    instructions: "POST to this endpoint to setup user profiles",
  });
}
