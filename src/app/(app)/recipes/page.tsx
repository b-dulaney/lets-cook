"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import Link from "next/link";
import { RecipeCard } from "@/components/recipe-card";
import { SkeletonRecipeResults } from "@/components/skeleton";
import { FullPageLoader } from "@/components/full-page-loader";
import { RecipeSuggestion } from "@/lib/claude/prompts";

interface Preferences {
  dietary: string[];
  allergies: string[];
  dislikes: string[];
  favorite_cuisines: string[];
}

export default function RecipesPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [recipes, setRecipes] = useState<RecipeSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await fetch("/api/preferences");
      if (res.ok) {
        const data = await res.json();
        setPreferences(data.preferences);
      }
    } catch (err) {
      console.error("Error fetching preferences:", err);
    }
  };

  const handleAddIngredient = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    } else if (e.key === "Backspace" && inputValue === "" && ingredients.length > 0) {
      setIngredients(ingredients.slice(0, -1));
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSearch = async () => {
    if (ingredients.length === 0) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch("/api/recipes/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          preferences: preferences
            ? {
                dietaryRestrictions: preferences.dietary || [],
                allergies: preferences.allergies || [],
                dislikes: preferences.dislikes || [],
                favoriteCuisines: preferences.favorite_cuisines || [],
              }
            : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRecipes(data.recipes);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to find recipes");
      }
    } catch (err) {
      console.error("Error searching recipes:", err);
      setError("Failed to find recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const COMMON_INGREDIENTS = [
    "chicken",
    "rice",
    "pasta",
    "eggs",
    "onion",
    "garlic",
    "tomatoes",
    "potatoes",
    "beef",
    "salmon",
    "broccoli",
    "cheese",
  ];

  const suggestedIngredients = COMMON_INGREDIENTS.filter(
    (ing) => !ingredients.includes(ing)
  ).slice(0, 6);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Recipes</h1>
          <p className="text-gray-600">
            Tell us what ingredients you have, and we&apos;ll find delicious recipes for you.
          </p>
        </div>
        <Link
          href="/recipes/saved"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          Saved Recipes
        </Link>
      </div>

      {/* Ingredient input area */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What ingredients do you have?
        </label>

        {/* Tag input */}
        <div
          className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[52px] cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {ingredients.map((ingredient, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
            >
              {ingredient}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveIngredient(idx);
                }}
                className="ml-1 text-emerald-600 hover:text-emerald-800 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={ingredients.length === 0 ? "Type an ingredient and press Enter..." : "Add more..."}
            className="flex-1 min-w-[150px] outline-none bg-transparent text-gray-900 placeholder:text-gray-500"
          />
        </div>

        {/* Suggested ingredients */}
        {ingredients.length < 5 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedIngredients.map((ingredient) => (
                <button
                  key={ingredient}
                  type="button"
                  onClick={() => setIngredients([...ingredients, ingredient])}
                  className="px-2.5 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  + {ingredient}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search button */}
        <button
          onClick={handleSearch}
          disabled={ingredients.length === 0 || loading}
          className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Find Recipes
        </button>
      </div>

      {/* Preference info */}
      {preferences && (preferences.dietary?.length > 0 || preferences.allergies?.length > 0) && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
          <span className="font-medium">Your preferences will be applied:</span>{" "}
          {[...(preferences.dietary || []), ...(preferences.allergies || [])].join(", ")}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Results section */}
      {loading ? (
        <SkeletonRecipeResults count={4} />
      ) : recipes.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Found {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} for you
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {recipes.map((recipe, idx) => (
              <RecipeCard key={idx} recipe={recipe} />
            ))}
          </div>
        </div>
      ) : searched ? (
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No recipes found</h3>
          <p className="mt-2 text-gray-600">
            Try adding different ingredients or removing some restrictions.
          </p>
        </div>
      ) : (
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Ready to discover recipes</h3>
          <p className="mt-2 text-gray-600">
            Add your ingredients above and click &quot;Find Recipes&quot; to get started.
          </p>
        </div>
      )}

      {/* Full page loader for initial search */}
      {loading && !searched && (
        <FullPageLoader
          message="Finding delicious recipes..."
          submessage="Searching for the perfect meals based on your ingredients"
        />
      )}
    </div>
  );
}
