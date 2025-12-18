"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MealPlan {
  id: string;
  week_start: string;
  meals: {
    weekPlan?: Array<{
      day: string;
      meal: string;
      cookTime?: string;
      difficulty?: string;
    }>;
    budgetEstimate?: string;
  };
  created_at: string;
}

interface Preferences {
  skill_level: string | null;
  max_cook_time: string | null;
  budget: string | null;
  household_size: number | null;
  dietary: string[];
  allergies: string[];
  dislikes: string[];
  favorite_cuisines: string[];
}

export default function MealPlansPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMealPlans();
  }, []);

  const fetchMealPlans = async () => {
    try {
      const res = await fetch("/api/meal-plans");
      if (res.ok) {
        const data = await res.json();
        setMealPlans(data.mealPlans);
      } else {
        setError("Failed to load meal plans");
      }
    } catch (err) {
      console.error("Error fetching meal plans:", err);
      setError("Failed to load meal plans");
    } finally {
      setLoading(false);
    }
  };

  const handlePlanCreated = (newPlan: MealPlan) => {
    setMealPlans([newPlan, ...mealPlans]);
    setShowModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getWeekRange = (weekStart: string) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${formatDate(weekStart)} - ${formatDate(end.toISOString())}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading meal plans...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meal Plans</h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Generate New Plan</span>
          <span className="sm:hidden">New Plan</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {mealPlans.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No meal plans yet</h3>
          <p className="mt-2 text-gray-600">
            Generate your first meal plan to get started with weekly meal planning.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Generate Meal Plan
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {mealPlans.map((plan) => (
            <Link
              key={plan.id}
              href={`/meal-plans/${plan.id}`}
              className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Week of {formatDate(plan.week_start)}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {getWeekRange(plan.week_start)}
                  </p>
                </div>
                {plan.meals.budgetEstimate && (
                  <span className="text-sm font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                    {plan.meals.budgetEstimate}
                  </span>
                )}
              </div>

              {plan.meals.weekPlan && (
                <div className={`mt-4 grid gap-2 ${
                  plan.meals.weekPlan.length <= 3
                    ? "grid-cols-3"
                    : plan.meals.weekPlan.length <= 5
                    ? "grid-cols-2 sm:grid-cols-5"
                    : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-7"
                }`}>
                  {plan.meals.weekPlan.map((day, idx) => (
                    <div key={idx} className="text-center">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Day {idx + 1}
                      </p>
                      <p className="text-xs text-gray-700 mt-1 line-clamp-2">
                        {day.meal}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Created {formatDate(plan.created_at)}
              </div>
            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <GeneratePlanModal
          onClose={() => setShowModal(false)}
          onPlanCreated={handlePlanCreated}
        />
      )}
    </div>
  );
}

function GeneratePlanModal({
  onClose,
  onPlanCreated,
}: {
  onClose: () => void;
  onPlanCreated: (plan: MealPlan) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [numberOfDays, setNumberOfDays] = useState(7);
  const [householdSize, setHouseholdSize] = useState<string>("");
  const [dietary, setDietary] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>("");
  const [maxCookTime, setMaxCookTime] = useState<string>("");

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await fetch("/api/preferences");
      if (res.ok) {
        const data = await res.json();
        const prefs = data.preferences as Preferences;

        // Pre-populate from saved preferences
        setHouseholdSize(prefs.household_size?.toString() || "");
        setDietary(prefs.dietary || []);
        setAllergies(prefs.allergies || []);
        setFavoriteCuisines(prefs.favorite_cuisines || []);
        setBudget(prefs.budget || "");
        setMaxCookTime(prefs.max_cook_time || "");
      }
    } catch (err) {
      console.error("Error fetching preferences:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setError(null);

    try {
      const preferences = {
        householdSize: householdSize ? parseInt(householdSize) : undefined,
        dietary,
        allergies,
        favoriteCuisines,
        budget: budget || undefined,
        maxCookTime: maxCookTime || undefined,
      };

      const res = await fetch("/api/meal-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generate: true,
          numberOfDays,
          preferences,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onPlanCreated(data.mealPlan);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to generate meal plan");
      }
    } catch (err) {
      console.error("Error generating meal plan:", err);
      setError("Failed to generate meal plan");
    } finally {
      setGenerating(false);
    }
  };

  const toggleArrayItem = (arr: string[], setArr: (arr: string[]) => void, item: string) => {
    if (arr.includes(item)) {
      setArr(arr.filter((i) => i !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  const COMMON_DIETARY = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Low-Carb"];
  const COMMON_ALLERGIES = ["Peanuts", "Tree Nuts", "Milk", "Eggs", "Wheat", "Soy", "Fish", "Shellfish"];
  const CUISINES = ["Italian", "Mexican", "Chinese", "Japanese", "Indian", "Thai", "Mediterranean", "American"];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Generate Meal Plan
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {loading ? (
                <div className="py-8 text-center text-gray-600">Loading preferences...</div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                      {error}
                    </div>
                  )}

                  {/* Number of Days */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Days
                    </label>
                    <div className="flex gap-2">
                      {[3, 5, 7].map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setNumberOfDays(days)}
                          className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
                            numberOfDays === days
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {days} days
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Household Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Household Size
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={householdSize}
                      onChange={(e) => setHouseholdSize(e.target.value)}
                      placeholder="Number of people"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Budget & Cook Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Budget
                      </label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Any</option>
                        <option value="budget-friendly">Budget-friendly</option>
                        <option value="moderate">Moderate</option>
                        <option value="no-limit">No limit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Cook Time
                      </label>
                      <select
                        value={maxCookTime}
                        onChange={(e) => setMaxCookTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Any</option>
                        <option value="30 minutes">30 min</option>
                        <option value="45 minutes">45 min</option>
                        <option value="1 hour">1 hour</option>
                      </select>
                    </div>
                  </div>

                  {/* Dietary Preferences */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dietary Preferences
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_DIETARY.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleArrayItem(dietary, setDietary, item)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            dietary.includes(item)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Allergies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergies
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_ALLERGIES.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleArrayItem(allergies, setAllergies, item)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            allergies.includes(item)
                              ? "bg-red-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cuisines */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Cuisines
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CUISINES.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleArrayItem(favoriteCuisines, setFavoriteCuisines, item)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            favoriteCuisines.includes(item)
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
              <button
                type="submit"
                disabled={generating || loading}
                className="inline-flex w-full justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  "Generate Plan"
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
