import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { FullRecipe } from "@/lib/claude/prompts";
import type { Json } from "@/types/database";

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface RecipeMetadata {
  tips?: string[];
  substitutions?: { original: string; alternative: string; reason: string }[];
  nutrition?: { calories: string; protein: string; notes: string };
  generatedName?: string;
}

interface DbRecipe {
  id: string;
  title: string;
  description: string | null;
  ingredients: Json;
  instructions: Json;
  prep_time: number | null;
  cook_time: number | null;
  total_time: string | null;
  servings: number | null;
  difficulty: string | null;
  metadata: Json | null;
}

// Convert database recipe to FullRecipe format
function dbToFullRecipe(dbRecipe: DbRecipe): FullRecipe {
  const metadata = (dbRecipe.metadata || {}) as RecipeMetadata;

  return {
    recipeName: metadata.generatedName || dbRecipe.title,
    servings: dbRecipe.servings || 4,
    prepTime: dbRecipe.prep_time ? `${dbRecipe.prep_time} minutes` : "N/A",
    cookTime: dbRecipe.cook_time ? `${dbRecipe.cook_time} minutes` : "N/A",
    totalTime: dbRecipe.total_time || "N/A",
    difficulty: (dbRecipe.difficulty as "Easy" | "Medium" | "Hard") || "Medium",
    ingredients: dbRecipe.ingredients as unknown as FullRecipe["ingredients"],
    instructions: dbRecipe.instructions as unknown as FullRecipe["instructions"],
    tips: metadata.tips || [],
    substitutions: metadata.substitutions || [],
    nutrition: metadata.nutrition || { calories: "N/A", protein: "N/A", notes: "" },
  };
}

// GET /api/recipes/[id] - Get a single recipe by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get recipe
  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  // Check if user has favorited this recipe
  const { data: favorite } = await supabase
    .from("favorite_recipes")
    .select("id")
    .eq("user_id", user.id)
    .eq("recipe_id", id)
    .maybeSingle();

  const fullRecipe = dbToFullRecipe(recipe as unknown as DbRecipe);

  return NextResponse.json({
    recipe: fullRecipe,
    recipeId: recipe.id,
    isFavorite: !!favorite,
  });
}
