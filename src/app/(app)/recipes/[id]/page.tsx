"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SkeletonRecipeDetail } from "@/components/skeleton";
import {
  FullRecipe,
  RecipeIngredient,
  RecipeInstruction,
} from "@/lib/claude/prompts";

const difficultyColors = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RecipeByIdPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [recipe, setRecipe] = useState<FullRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);

  const backTo = searchParams.get("back") || "/recipes";

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/recipes/${id}`);

      if (res.ok) {
        const data = await res.json();
        setRecipe(data.recipe);
        setIsFavorite(data.isFavorite || false);
      } else if (res.status === 404) {
        setError("Recipe not found");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to load recipe");
      }
    } catch (err) {
      console.error("Error fetching recipe:", err);
      setError("Failed to load recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    setTogglingFavorite(true);
    try {
      const res = await fetch(`/api/recipes/${id}/favorite`, {
        method: isFavorite ? "DELETE" : "POST",
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setTogglingFavorite(false);
    }
  };

  if (loading) {
    return <SkeletonRecipeDetail />;
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-12">
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          {error || "Recipe not found"}
        </h3>
        <p className="mt-2 text-gray-600">
          We couldn&apos;t find this recipe. It may have been deleted.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href={backTo}
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {recipe.recipeName}
          </h1>
          <button
            onClick={toggleFavorite}
            disabled={togglingFavorite}
            className={`shrink-0 p-2 rounded-full transition-colors cursor-pointer ${
              isFavorite
                ? "bg-red-50 text-red-500 hover:bg-red-100"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            } ${togglingFavorite ? "opacity-50" : ""}`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              className="w-6 h-6"
              fill={isFavorite ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <span
            className={`text-sm font-medium px-3 py-1 rounded ${
              difficultyColors[recipe.difficulty]
            }`}
          >
            {recipe.difficulty}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {recipe.totalTime}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {recipe.servings} servings
          </span>
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
            Prep: {recipe.prepTime} | Cook: {recipe.cookTime}
          </span>
        </div>
      </div>

      {/* Nutrition summary */}
      {recipe.nutrition && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="font-medium text-emerald-800">Calories:</span>{" "}
              <span className="text-emerald-700">{recipe.nutrition.calories}</span>
            </div>
            <div>
              <span className="font-medium text-emerald-800">Protein:</span>{" "}
              <span className="text-emerald-700">{recipe.nutrition.protein}</span>
            </div>
            {recipe.nutrition.notes && (
              <div className="text-emerald-700">{recipe.nutrition.notes}</div>
            )}
          </div>
        </div>
      )}

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ingredients (sidebar on desktop) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-5 lg:sticky lg:top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Ingredients
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ing: RecipeIngredient, idx: number) => (
                <li key={idx} className="flex gap-2 text-sm">
                  <span className="font-medium text-gray-900 shrink-0 min-w-[60px]">
                    {ing.amount}
                  </span>
                  <span className="text-gray-700">
                    {ing.item}
                    {ing.notes && (
                      <span className="text-gray-500"> ({ing.notes})</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            {/* Substitutions */}
            {recipe.substitutions && recipe.substitutions.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Substitutions
                </h3>
                <ul className="space-y-2 text-sm">
                  {recipe.substitutions.map((sub, idx) => (
                    <li key={idx} className="text-gray-600">
                      <span className="font-medium">{sub.original}</span>
                      {" → "}
                      <span className="text-emerald-700">{sub.alternative}</span>
                      {sub.reason && (
                        <span className="block text-xs text-gray-500 mt-0.5">
                          {sub.reason}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Instructions
            </h2>
            <ol className="space-y-6">
              {recipe.instructions.map((step: RecipeInstruction, idx: number) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-semibold text-sm">
                    {step.step}
                  </span>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700">{step.instruction}</p>
                    {step.time && (
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {step.time}
                      </p>
                    )}
                    {step.tip && (
                      <p className="text-sm text-emerald-700 mt-2 bg-emerald-50 px-3 py-2 rounded">
                        <span className="font-medium">Tip:</span> {step.tip}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips section */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-5 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Chef&apos;s Tips
              </h2>
              <ul className="space-y-2">
                {recipe.tips.map((tip, idx) => (
                  <li
                    key={idx}
                    className="flex gap-2 text-sm text-gray-700"
                  >
                    <svg
                      className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
