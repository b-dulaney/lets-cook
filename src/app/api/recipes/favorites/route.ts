import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/recipes/favorites - Get user's favorite recipes
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  // Get favorites with recipe details
  const { data: favorites, error } = await supabase
    .from("favorite_recipes")
    .select(`
      id,
      created_at,
      recipe:recipes (*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }

  // Flatten the response to just return recipes with favorite metadata
  const recipes = favorites?.map((f) => ({
    ...f.recipe,
    favoritedAt: f.created_at,
  }));

  return NextResponse.json({ recipes });
}
