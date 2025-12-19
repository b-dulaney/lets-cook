import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { Json } from "@/types/database";

// GET /api/recipes - List recipes (optionally filter by search)
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search");
  const ids = searchParams.get("ids");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  // If ids provided, fetch specific recipes by ID
  if (ids) {
    const idList = ids.split(",").filter(Boolean);
    const { data: recipes, error } = await supabase
      .from("recipes")
      .select("id, title")
      .in("id", idList);

    if (error) {
      console.error("Error fetching recipes by IDs:", error);
      return NextResponse.json(
        { error: "Failed to fetch recipes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ recipes });
  }

  let query = supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data: recipes, error } = await query;

  if (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }

  return NextResponse.json({ recipes });
}

// POST /api/recipes - Create a new recipe
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    title,
    description,
    ingredients,
    instructions,
    prepTime,
    cookTime,
    servings,
    imageUrl,
    source = "claude",
  } = body;

  if (!title) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  const { data: recipe, error } = await supabase
    .from("recipes")
    .insert({
      title,
      description,
      ingredients: (ingredients || []) as Json,
      instructions: (instructions || []) as Json,
      prep_time: prepTime,
      cook_time: cookTime,
      servings,
      image_url: imageUrl,
      source,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }

  return NextResponse.json({ recipe }, { status: 201 });
}
