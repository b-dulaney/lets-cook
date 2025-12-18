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

  return (
    <AppShell
      user={{
        email: user.email || "",
        name: profile?.name,
      }}
    >
      {children}
    </AppShell>
  );
}
