"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FullPageLoader } from "@/components/full-page-loader";
import { SkeletonMealPlanDetail } from "@/components/skeleton";

interface MealDay {
  day: string;
  meal: string;
  description?: string;
  cookTime?: string;
  difficulty?: string;
  cuisineType?: string;
  mainIngredients?: string[];
  tags?: string[];
}

interface MealPlan {
  id: string;
  week_start: string;
  meals: {
    weekPlan?: MealDay[];
    prepTips?: string[];
    budgetEstimate?: string;
    shoppingCategories?: {
      proteins?: string[];
      produce?: string[];
      dairy?: string[];
      pantry?: string[];
      other?: string[];
    };
  };
  created_at: string;
}

export default function MealPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [generatingList, setGeneratingList] = useState(false);

  useEffect(() => {
    fetchMealPlan();
  }, [id]);

  const fetchMealPlan = async () => {
    try {
      const res = await fetch(`/api/meal-plans/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMealPlan(data.mealPlan);
      } else {
        setError("Meal plan not found");
      }
    } catch (err) {
      console.error("Error fetching meal plan:", err);
      setError("Failed to load meal plan");
    } finally {
      setLoading(false);
    }
  };

  const deleteMealPlan = async () => {
    if (!confirm("Are you sure you want to delete this meal plan?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/meal-plans/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/meal-plans");
      } else {
        setError("Failed to delete meal plan");
      }
    } catch (err) {
      console.error("Error deleting meal plan:", err);
      setError("Failed to delete meal plan");
    } finally {
      setDeleting(false);
    }
  };

  const generateShoppingList = async () => {
    setGeneratingList(true);
    try {
      const res = await fetch("/api/shopping-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generate: true, mealPlanId: id }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/shopping/${data.shoppingList.id}`);
      } else {
        setError("Failed to generate shopping list");
      }
    } catch (err) {
      console.error("Error generating shopping list:", err);
      setError("Failed to generate shopping list");
    } finally {
      setGeneratingList(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return <SkeletonMealPlanDetail />;
  }

  if (error || !mealPlan) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || "Meal plan not found"}</p>
        <Link href="/meal-plans" className="text-blue-600 hover:text-blue-500">
          Back to Meal Plans
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/meal-plans"
          className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Meal Plans
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Week of {formatDate(mealPlan.week_start)}
            </h1>
            {mealPlan.meals.budgetEstimate && (
              <p className="text-sm text-green-700 mt-1">
                Estimated budget: {mealPlan.meals.budgetEstimate}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generateShoppingList}
              disabled={generatingList}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden sm:inline">Create</span> Shopping List
            </button>
            <button
              onClick={deleteMealPlan}
              disabled={deleting}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-red-300 text-red-700 font-medium rounded-lg hover:bg-red-50 disabled:opacity-50"
            >
              <svg className="w-4 h-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="hidden sm:inline">{deleting ? "Deleting..." : "Delete"}</span>
              <span className="sm:hidden">{deleting ? "..." : "Delete"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Plan */}
      {mealPlan.meals.weekPlan && (
        <div className="grid gap-4 mb-8">
          {mealPlan.meals.weekPlan.map((day, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {day.day}
                    </span>
                    {day.difficulty && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {day.difficulty}
                      </span>
                    )}
                    {day.cookTime && (
                      <span className="text-xs text-gray-500">
                        {day.cookTime}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {day.meal}
                  </h3>
                  {day.description && (
                    <p className="text-gray-600 mt-1">{day.description}</p>
                  )}
                  {day.mainIngredients && day.mainIngredients.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-1">Main ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {day.mainIngredients.map((ing, i) => (
                          <span
                            key={i}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {day.cuisineType && (
                  <span className="text-sm text-gray-500 hidden sm:block">
                    {day.cuisineType}
                  </span>
                )}
              </div>
              {day.tags && day.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {day.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Prep Tips */}
      {mealPlan.meals.prepTips && mealPlan.meals.prepTips.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Prep Tips
          </h2>
          <ul className="space-y-2">
            {mealPlan.meals.prepTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-amber-800">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Shopping Categories Preview */}
      {mealPlan.meals.shoppingCategories && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shopping Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(mealPlan.meals.shoppingCategories).map(([category, items]) => (
              items && items.length > 0 && (
                <div key={category}>
                  <h3 className="text-sm font-medium text-gray-700 capitalize mb-2">
                    {category}
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {items.slice(0, 4).map((item, idx) => (
                      <li key={idx} className="truncate">{item}</li>
                    ))}
                    {items.length > 4 && (
                      <li className="text-gray-400">+{items.length - 4} more</li>
                    )}
                  </ul>
                </div>
              )
            ))}
          </div>
          <button
            onClick={generateShoppingList}
            disabled={generatingList}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Generate full shopping list →
          </button>
        </div>
      )}

      {generatingList && (
        <FullPageLoader
          message="Building your shopping list..."
          submessage="Organizing ingredients by category for easy shopping"
        />
      )}
    </div>
  );
}
