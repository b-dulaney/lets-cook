"use client";

import { useState, useEffect } from "react";
import { SkeletonSettings } from "@/components/skeleton";

interface Preferences {
  user_id: string;
  skill_level: string | null;
  meal_complexity: string | null;
  max_cook_time: string | null;
  budget: string | null;
  household_size: number | null;
  dietary: string[];
  allergies: string[];
  dislikes: string[];
  favorite_cuisines: string[];
  pantry_items: string[];
  additional_notes: string | null;
}

const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const MEAL_COMPLEXITY = [
  { value: "minimal", label: "Minimal", description: "Under 5 ingredients" },
  { value: "simple", label: "Simple", description: "5-7 ingredients" },
  { value: "standard", label: "Standard", description: "8-12 ingredients" },
  { value: "complex", label: "Complex", description: "12+ ingredients" },
];

const COMMON_DIETARY = [
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Keto",
  "Paleo",
  "Gluten-Free",
  "Dairy-Free",
  "Low-Carb",
  "Low-Sodium",
];

const COMMON_ALLERGIES = [
  "Peanuts",
  "Tree Nuts",
  "Milk",
  "Eggs",
  "Wheat",
  "Soy",
  "Fish",
  "Shellfish",
  "Sesame",
];

const CUISINES = [
  "Italian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Indian",
  "Thai",
  "Mediterranean",
  "American",
  "French",
  "Korean",
  "Vietnamese",
  "Greek",
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [skillLevel, setSkillLevel] = useState<string>("");
  const [mealComplexity, setMealComplexity] = useState<string>("");
  const [maxCookTime, setMaxCookTime] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [householdSize, setHouseholdSize] = useState<string>("");
  const [dietary, setDietary] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dislikes, setDislikes] = useState<string>("");
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState<string>("");

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await fetch("/api/preferences");
      if (res.ok) {
        const data = await res.json();
        const prefs = data.preferences as Preferences;

        setSkillLevel(prefs.skill_level || "");
        setMealComplexity(prefs.meal_complexity || "");
        setMaxCookTime(prefs.max_cook_time || "");
        setBudget(prefs.budget || "");
        setHouseholdSize(prefs.household_size?.toString() || "");
        setDietary(prefs.dietary || []);
        setAllergies(prefs.allergies || []);
        setDislikes(prefs.dislikes?.join(", ") || "");
        setFavoriteCuisines(prefs.favorite_cuisines || []);
        setAdditionalNotes(prefs.additional_notes || "");
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillLevel: skillLevel || null,
          mealComplexity: mealComplexity || null,
          maxCookTime: maxCookTime || null,
          budget: budget || null,
          householdSize: householdSize ? parseInt(householdSize) : null,
          dietary,
          allergies,
          dislikes: dislikes ? dislikes.split(",").map((s) => s.trim()).filter(Boolean) : [],
          favoriteCuisines,
          additionalNotes: additionalNotes || null,
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Preferences saved successfully!" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to save preferences" });
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      setMessage({ type: "error", text: "Failed to save preferences" });
    } finally {
      setSaving(false);
    }
  };

  const toggleArrayItem = (
    arr: string[],
    setArr: (arr: string[]) => void,
    item: string
  ) => {
    if (arr.includes(item)) {
      setArr(arr.filter((i) => i !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  if (loading) {
    return <SkeletonSettings />;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Cooking Experience */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cooking Experience</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Level
              </label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select skill level</option>
                {SKILL_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal Complexity
              </label>
              <select
                value={mealComplexity}
                onChange={(e) => setMealComplexity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">No preference</option>
                {MEAL_COMPLEXITY.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label} ({level.description})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Cook Time
              </label>
              <select
                value={maxCookTime}
                onChange={(e) => setMaxCookTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">No preference</option>
                <option value="15 minutes">15 minutes</option>
                <option value="30 minutes">30 minutes</option>
                <option value="45 minutes">45 minutes</option>
                <option value="1 hour">1 hour</option>
                <option value="1+ hours">1+ hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">No preference</option>
                <option value="budget-friendly">Budget-friendly</option>
                <option value="moderate">Moderate</option>
                <option value="no-limit">No limit</option>
              </select>
            </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </section>

        {/* Dietary Preferences */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dietary Preferences</h2>
          <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_DIETARY.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleArrayItem(dietary, setDietary, item)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  dietary.includes(item)
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* Allergies */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Allergies</h2>
          <p className="text-sm text-gray-600 mb-3">Select any food allergies</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_ALLERGIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleArrayItem(allergies, setAllergies, item)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  allergies.includes(item)
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* Favorite Cuisines */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Favorite Cuisines</h2>
          <p className="text-sm text-gray-600 mb-3">Select cuisines you enjoy</p>
          <div className="flex flex-wrap gap-2">
            {CUISINES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleArrayItem(favoriteCuisines, setFavoriteCuisines, item)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  favoriteCuisines.includes(item)
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* Dislikes & Notes */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foods You Dislike
              </label>
              <input
                type="text"
                value={dislikes}
                onChange={(e) => setDislikes(e.target.value)}
                placeholder="e.g., cilantro, olives, mushrooms"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <p className="mt-1 text-xs text-gray-500">Separate items with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any other preferences or notes for meal planning..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}
