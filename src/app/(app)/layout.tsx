import { redirect } from "next/navigation";
import { getUser, getUserProfile } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getUserProfile();

  // Get avatar from Google OAuth metadata
  const avatarUrl =
    user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

  return (
    <AppShell
      user={{
        email: user.email || "",
        name: profile?.name || user.user_metadata?.full_name,
        avatarUrl,
      }}
    >
      {children}
    </AppShell>
  );
}
