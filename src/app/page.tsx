import Link from "next/link";
import { FrogChef } from "@/components/frog-chef";
import { MealPlanIcon, ShoppingIcon, SavedRecipesIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      {/* Header */}
      <header className="py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FrogChef size={40} />
            <span className="text-xl font-bold text-emerald-800">Let&apos;s Cook</span>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <FrogChef size={160} animated />
                {/* Decorative sparkles */}
                <svg className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
                </svg>
                <svg className="absolute -bottom-1 -left-3 w-6 h-6 text-pink-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Your AI-Powered
              <span className="text-emerald-600"> Kitchen Companion</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Plan delicious meals, discover recipes based on what you have, and generate
              smart shopping lists. Let our friendly frog chef help you cook with confidence!
            </p>

            {/* CTA Card */}
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to start cooking?
                </h2>
                <p className="text-gray-600 mb-6">
                  Sign in to create personalized meal plans and save your favorite recipes.
                </p>
                <Link
                  href="/login"
                  className="block w-full py-3 px-6 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <FeatureCard
              icon={<MealPlanIcon size={32} />}
              title="Smart Meal Planning"
              description="Generate weekly meal plans tailored to your preferences, dietary needs, and schedule."
            />
            <FeatureCard
              icon={<ShoppingIcon size={32} />}
              title="Shopping Lists"
              description="Automatically create organized shopping lists from your meal plans. Never forget an ingredient!"
            />
            <FeatureCard
              icon={<SavedRecipesIcon size={32} />}
              title="Save Favorites"
              description="Build your personal cookbook by saving recipes you love for quick access anytime."
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FrogChef size={24} />
            <span className="text-sm font-medium text-gray-600">Let&apos;s Cook</span>
          </div>
          <p className="text-xs text-gray-500">
            Made with love for home cooks everywhere
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-xl mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
