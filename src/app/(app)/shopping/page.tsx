"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FullPageLoader } from "@/components/full-page-loader";
import { SkeletonListPage } from "@/components/skeleton";

interface ShoppingListItem {
  item: string;
  quantity: string;
  category?: string;
  purchased: boolean;
}

interface ShoppingList {
  id: string;
  meal_plan_id: string | null;
  recipe_id: string | null;
  items: ShoppingListItem[];
  created_at: string;
  updated_at: string;
}

interface MealPlan {
  id: string;
  created_at: string;
}

interface Recipe {
  id: string;
  title: string;
}

export default function ShoppingListsPage() {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [listsRes, plansRes] = await Promise.all([
        fetch("/api/shopping-lists"),
        fetch("/api/meal-plans?limit=100"), // Get all meal plans for numbering
      ]);

      if (listsRes.ok) {
        const data = await listsRes.json();
        setShoppingLists(data.shoppingLists);

        // Fetch recipes for recipe-based shopping lists
        const recipeIds = data.shoppingLists
          .filter((list: ShoppingList) => list.recipe_id)
          .map((list: ShoppingList) => list.recipe_id);

        if (recipeIds.length > 0) {
          const recipesRes = await fetch(
            `/api/recipes?ids=${recipeIds.join(",")}`,
          );
          if (recipesRes.ok) {
            const recipesData = await recipesRes.json();
            setRecipes(recipesData.recipes || []);
          }
        }
      }

      if (plansRes.ok) {
        const data = await plansRes.json();
        setMealPlans(data.mealPlans);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load shopping lists");
    } finally {
      setLoading(false);
    }
  };

  const handleListCreated = (newList: ShoppingList) => {
    setShoppingLists([newList, ...shoppingLists]);
    setShowModal(false);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Get meal plan number (oldest = 1, newest = highest)
  const getMealPlanNumber = (mealPlanId: string): number | null => {
    // mealPlans is sorted by created_at descending, so reverse to get chronological order
    const sortedPlans = [...mealPlans].reverse();
    const index = sortedPlans.findIndex((plan) => plan.id === mealPlanId);
    return index >= 0 ? index + 1 : null;
  };

  // Get shopping list display name based on source
  const getListName = (list: ShoppingList): string => {
    if (list.recipe_id) {
      const recipe = recipes.find((r) => r.id === list.recipe_id);
      return recipe ? `Shopping List for ${recipe.title}` : "Shopping List";
    }
    if (list.meal_plan_id) {
      const planNumber = getMealPlanNumber(list.meal_plan_id);
      return planNumber
        ? `Shopping List for Meal Plan ${planNumber}`
        : "Shopping List";
    }
    return "Shopping List";
  };

  const getCompletionStats = (items: ShoppingListItem[]) => {
    const total = items.length;
    const purchased = items.filter((i) => i.purchased).length;
    return {
      total,
      purchased,
      percentage: total > 0 ? Math.round((purchased / total) * 100) : 0,
    };
  };

  if (loading) {
    return <SkeletonListPage type="shopping" cardCount={3} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Lists</h1>
        <button
          onClick={() => setShowModal(true)}
          disabled={mealPlans.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="hidden sm:inline">New Shopping List</span>
          <span className="sm:hidden">New List</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {shoppingLists.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No shopping lists yet
          </h3>
          <p className="mt-2 text-gray-600 max-w-sm mx-auto">
            {mealPlans.length === 0
              ? "Create a meal plan first, then generate a shopping list from it."
              : "Generate a shopping list from one of your meal plans."}
          </p>
          {mealPlans.length === 0 ? (
            <Link
              href="/meal-plans"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700"
            >
              Create Meal Plan
            </Link>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700"
            >
              New Shopping List
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {shoppingLists.map((list) => {
            const stats = getCompletionStats(list.items);
            return (
              <Link
                key={list.id}
                href={`/shopping/${list.id}`}
                className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getListName(list)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {list.items.length} items • Created{" "}
                      {formatDateTime(list.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-medium ${
                        stats.percentage === 100
                          ? "text-green-700"
                          : "text-gray-700"
                      }`}
                    >
                      {stats.purchased}/{stats.total}
                    </span>
                    <p className="text-xs text-gray-500">completed</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        stats.percentage === 100
                          ? "bg-green-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Category preview */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {Array.from(
                    new Set(list.items.map((i) => i.category).filter(Boolean)),
                  )
                    .slice(0, 4)
                    .map((category) => (
                      <span
                        key={category}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {category}
                      </span>
                    ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {showModal && (
        <CreateListModal
          mealPlans={mealPlans}
          onClose={() => setShowModal(false)}
          onListCreated={handleListCreated}
          onGeneratingChange={setGenerating}
        />
      )}

      {generating && (
        <FullPageLoader
          message="Building your shopping list..."
          submessage="Organizing ingredients by category for easy shopping"
        />
      )}
    </div>
  );
}

function CreateListModal({
  mealPlans,
  onClose,
  onListCreated,
  onGeneratingChange,
}: {
  mealPlans: MealPlan[];
  onClose: () => void;
  onListCreated: (list: ShoppingList) => void;
  onGeneratingChange: (generating: boolean) => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Get meal plan number (oldest = 1, newest = highest)
  const getMealPlanNumber = (index: number): number => {
    // mealPlans is sorted by created_at descending, so reverse index
    return mealPlans.length - index;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setGenerating(true);
    onGeneratingChange(true);
    onClose(); // Close modal to show full-page loader
    setError(null);

    try {
      const res = await fetch("/api/shopping-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generate: true,
          mealPlanId: selectedPlan,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onListCreated(data.shoppingList);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to generate shopping list");
      }
    } catch (err) {
      console.error("Error generating shopping list:", err);
      setError("Failed to generate shopping list");
    } finally {
      setGenerating(false);
      onGeneratingChange(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Generate Shopping List
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a Meal Plan
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {mealPlans.map((plan, index) => (
                    <label
                      key={plan.id}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPlan === plan.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="mealPlan"
                        value={plan.id}
                        checked={selectedPlan === plan.id}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Meal Plan {getMealPlanNumber(index)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created {formatDateTime(plan.created_at)}
                        </p>
                      </div>
                      {selectedPlan === plan.id && (
                        <svg
                          className="w-5 h-5 text-emerald-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
              <button
                type="submit"
                disabled={generating || !selectedPlan}
                className="inline-flex w-full justify-center items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
              >
                {generating ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Generating...
                  </>
                ) : (
                  "Generate List"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={generating}
                className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
