import Link from "next/link";
import {
  SearchIcon,
  MealPlanIcon,
  ShoppingIcon,
  SavedRecipesIcon,
  SettingsIcon,
} from "@/components/icons";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Welcome back, Chef!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Find Recipes"
          description="Discover recipes based on ingredients you have"
          href="/recipes"
          icon={<SearchIcon size={32} />}
        />
        <DashboardCard
          title="Meal Plans"
          description="Plan your meals for the week"
          href="/meal-plans"
          icon={<MealPlanIcon size={32} />}
        />
        <DashboardCard
          title="Shopping List"
          description="Generate shopping lists from your meal plans"
          href="/shopping"
          icon={<ShoppingIcon size={32} />}
        />
        <DashboardCard
          title="Saved Recipes"
          description="View your favorite recipes"
          href="/recipes/saved"
          icon={<SavedRecipesIcon size={32} />}
        />
        <DashboardCard
          title="Settings"
          description="Manage your dietary preferences"
          href="/settings"
          icon={<SettingsIcon size={32} />}
        />
      </div>
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
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all group"
    >
      <div className="text-gray-400 group-hover:text-emerald-600 transition-colors mb-3">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  );
}
