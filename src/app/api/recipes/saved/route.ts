import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface SavedRecipe {
  id: string;
  title: string;
  description: string | null;
  difficulty: string | null;
  total_time: string | null;
  servings: number | null;
  created_at: string;
  isFavorite: boolean;
  metadata: {
    generatedName?: string;
  } | null;
}

interface DbRecipe {
  id: string;
  title: string;
  description: string | null;
  difficulty: string | null;
  total_time: string | null;
  servings: number | null;
  created_at: string;
  metadata: unknown;
}

// GET /api/recipes/saved - Get user's saved recipes (from meal plans + favorites)
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const filter = searchParams.get("filter") || "all"; // all, favorites, recent
  const search = searchParams.get("search") || "";

  try {
    // Get user's favorite recipe IDs
    const { data: favorites } = await supabase
      .from("favorite_recipes")
      .select("recipe_id")
      .eq("user_id", user.id);

    const favoriteIds = new Set<string>(
      favorites?.map((f) => f.recipe_id) || []
    );

    // Get recipe IDs from user's meal plans via junction table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { data: mealPlanRecipeLinks } = await db
      .from("meal_plan_recipes")
      .select(`
        recipe_id,
        meal_plans!inner(user_id)
      `)
      .eq("meal_plans.user_id", user.id);

    const mealPlanRecipeIds = new Set<string>(
      mealPlanRecipeLinks?.map((link: { recipe_id: string }) => link.recipe_id) || []
    );

    // Combine all recipe IDs the user has access to
    const allRecipeIds = new Set<string>([...favoriteIds, ...mealPlanRecipeIds]);

    if (allRecipeIds.size === 0) {
      return NextResponse.json({ recipes: [] });
    }

    // Build query based on filter
    let recipeIds = Array.from(allRecipeIds);

    if (filter === "favorites") {
      recipeIds = Array.from(favoriteIds);
      if (recipeIds.length === 0) {
        return NextResponse.json({ recipes: [] });
      }
    }

    // Fetch recipes - cast to any since difficulty/total_time may not be in generated types
    const { data: recipes, error } = await (db
      .from("recipes")
      .select("id, title, description, difficulty, total_time, servings, created_at, metadata")
      .in("id", recipeIds)
      .order("created_at", { ascending: false }) as Promise<{ data: DbRecipe[] | null; error: Error | null }>);

    if (error) {
      console.error("Error fetching saved recipes:", error);
      return NextResponse.json(
        { error: "Failed to fetch saved recipes" },
        { status: 500 }
      );
    }

    // Apply search filter manually if provided (since we're using `any` typed query)
    let filteredRecipes = recipes || [];
    if (search) {
      const searchLower = search.toLowerCase();
      filteredRecipes = filteredRecipes.filter((r) =>
        r.title.toLowerCase().includes(searchLower)
      );
    }

    // Add isFavorite flag to each recipe
    const recipesWithFavorites: SavedRecipe[] = filteredRecipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      difficulty: recipe.difficulty,
      total_time: recipe.total_time,
      servings: recipe.servings,
      created_at: recipe.created_at,
      metadata: recipe.metadata as SavedRecipe["metadata"],
      isFavorite: favoriteIds.has(recipe.id),
    }));

    return NextResponse.json({ recipes: recipesWithFavorites });
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved recipes" },
      { status: 500 }
    );
  }
}
