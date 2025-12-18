import { getUser, getUserProfile, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getUserProfile();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Let&apos;s Cook
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {profile?.name || user.email}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Welcome, {profile?.name || "Chef"}!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Find Recipes"
              description="Discover recipes based on ingredients you have"
              href="/recipes"
              icon="🍳"
            />
            <DashboardCard
              title="Meal Plans"
              description="Plan your meals for the week"
              href="/meal-plans"
              icon="📅"
            />
            <DashboardCard
              title="Shopping List"
              description="Generate shopping lists from your meal plans"
              href="/shopping"
              icon="🛒"
            />
            <DashboardCard
              title="Saved Recipes"
              description="View your favorite recipes"
              href="/recipes/saved"
              icon="❤️"
            />
            <DashboardCard
              title="Settings"
              description="Manage your dietary preferences"
              href="/settings"
              icon="⚙️"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </a>
  );
}
