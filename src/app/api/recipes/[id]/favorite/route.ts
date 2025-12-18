import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/recipes/[id]/favorite - Add recipe to favorites
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id: recipeId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if recipe exists
  const { data: recipe } = await supabase
    .from("recipes")
    .select("id")
    .eq("id", recipeId)
    .single();

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from("favorite_recipes")
    .select("id")
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId)
    .single();

  if (existing) {
    return NextResponse.json({ message: "Already favorited" });
  }

  // Add to favorites
  const { error } = await supabase.from("favorite_recipes").insert({
    user_id: user.id,
    recipe_id: recipeId,
  });

  if (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Added to favorites" }, { status: 201 });
}

// DELETE /api/recipes/[id]/favorite - Remove recipe from favorites
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id: recipeId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("favorite_recipes")
    .delete()
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId);

  if (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Removed from favorites" });
}
