import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Type for meal_plan_recipes junction table (not yet in generated types)
interface MealPlanRecipeLink {
  id: string;
  meal_plan_id: string;
  day_index: number;
  recipe_id: string;
  created_at: string;
}

// GET /api/meal-plans/[id]/recipes?dayIndex=0 (optional)
// If dayIndex provided: check if a recipe exists for that specific day
// If no dayIndex: return all recipe links for this meal plan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id: mealPlanId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify user owns this meal plan
  const { data: mealPlan, error: mealPlanError } = await supabase
    .from("meal_plans")
    .select("id")
    .eq("id", mealPlanId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (mealPlanError || !mealPlan) {
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });
  }

  const dayIndex = request.nextUrl.searchParams.get("dayIndex");

  // Use any-typed supabase client for new table not in generated types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  if (dayIndex !== null) {
    // Return single link for specific day
    const { data: link, error: linkError } = await db
      .from("meal_plan_recipes")
      .select("recipe_id")
      .eq("meal_plan_id", mealPlanId)
      .eq("day_index", parseInt(dayIndex))
      .maybeSingle();

    if (linkError) {
      console.error("Error checking meal plan recipe:", linkError);
      return NextResponse.json(
        { error: "Failed to check recipe" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      hasRecipe: !!link,
      recipeId: link?.recipe_id || null,
    });
  }

  // Return all links for this meal plan
  const { data: links, error: linksError } = (await db
    .from("meal_plan_recipes")
    .select("day_index, recipe_id")
    .eq("meal_plan_id", mealPlanId)
    .order("day_index")) as {
    data: MealPlanRecipeLink[] | null;
    error: Error | null;
  };

  if (linksError) {
    console.error("Error fetching meal plan recipes:", linksError);
    return NextResponse.json(
      { error: "Failed to fetch recipe links" },
      { status: 500 },
    );
  }

  return NextResponse.json({ links: links || [] });
}

// POST /api/meal-plans/[id]/recipes
// Link a recipe to a specific day in the meal plan
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id: mealPlanId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { dayIndex, recipeId } = body;

  if (dayIndex === undefined || !recipeId) {
    return NextResponse.json(
      { error: "dayIndex and recipeId are required" },
      { status: 400 },
    );
  }

  // Verify user owns this meal plan
  const { data: mealPlan, error: mealPlanError } = await supabase
    .from("meal_plans")
    .select("id")
    .eq("id", mealPlanId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (mealPlanError || !mealPlan) {
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });
  }

  // Use any-typed supabase client for new table not in generated types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  // Insert or update the link (upsert)
  const { data: link, error: insertError } = (await db
    .from("meal_plan_recipes")
    .upsert(
      {
        meal_plan_id: mealPlanId,
        day_index: dayIndex,
        recipe_id: recipeId,
      },
      {
        onConflict: "meal_plan_id,day_index",
      },
    )
    .select()
    .single()) as { data: MealPlanRecipeLink | null; error: Error | null };

  if (insertError) {
    console.error("Error linking recipe to meal plan:", insertError);
    return NextResponse.json(
      { error: "Failed to link recipe" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    link,
  });
}
