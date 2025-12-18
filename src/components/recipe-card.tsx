"use client";

import { useRouter } from "next/navigation";
import { RecipeSuggestion } from "@/lib/claude/prompts";

interface RecipeCardProps {
  recipe: RecipeSuggestion;
  onSelect?: (recipe: RecipeSuggestion) => void;
  backTo?: string;
}

const difficultyColors = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

export function RecipeCard({ recipe, onSelect, backTo = "/recipes" }: RecipeCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onSelect) {
      onSelect(recipe);
    } else {
      // Navigate to recipe detail page
      const params = new URLSearchParams({
        name: recipe.name,
        ingredients: recipe.usesIngredients.join(","),
        back: backTo,
      });
      router.push(`/recipes/view?${params.toString()}`);
    }
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
          {recipe.name}
        </h3>
        <span
          className={`text-xs font-medium px-2 py-1 rounded ml-3 whitespace-nowrap ${
            difficultyColors[recipe.difficulty]
          }`}
        >
          {recipe.difficulty}
        </span>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {recipe.description}
      </p>

      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
        <span className="flex items-center gap-1">
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
          {recipe.cookTime}
        </span>
        <span className="flex items-center gap-1">
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
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {recipe.cuisineType}
        </span>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-medium text-gray-500 mb-2">Uses your ingredients:</p>
        <div className="flex flex-wrap gap-1">
          {recipe.usesIngredients.slice(0, 5).map((ingredient, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full"
            >
              {ingredient}
            </span>
          ))}
          {recipe.usesIngredients.length > 5 && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              +{recipe.usesIngredients.length - 5} more
            </span>
          )}
        </div>

        {recipe.additionalIngredients.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-500 mb-1">You&apos;ll also need:</p>
            <p className="text-xs text-gray-600">
              {recipe.additionalIngredients.slice(0, 4).join(", ")}
              {recipe.additionalIngredients.length > 4 &&
                ` +${recipe.additionalIngredients.length - 4} more`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
