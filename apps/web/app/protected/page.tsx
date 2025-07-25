import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { createClient } from "@/lib/server";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <p className="font-bitcount text-xl">
        Hello <span className="font-bold">{data.user.email}</span>
      </p>
      <LogoutButton />
    </div>
  );
}
