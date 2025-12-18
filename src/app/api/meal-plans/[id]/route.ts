import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { Database, Json } from "@/types/database";
import { rerollMeal } from "@/lib/claude/client";
import type { MealPlanDay, UserPreferences } from "@/lib/claude/client";

type MealPlanUpdate = Database["public"]["Tables"]["meal_plans"]["Update"];

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/meal-plans/[id] - Get a single meal plan
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: mealPlan, error } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !mealPlan) {
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });
  }

  return NextResponse.json({ mealPlan });
}

// PUT /api/meal-plans/[id] - Update a meal plan
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { weekStart, meals } = body;

  // Build update object with only provided fields
  const updates: MealPlanUpdate = {};
  if (weekStart !== undefined) updates.week_start = weekStart;
  if (meals !== undefined) updates.meals = meals as Json;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  const { data: mealPlan, error } = await supabase
    .from("meal_plans")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating meal plan:", error);
    return NextResponse.json(
      { error: "Failed to update meal plan" },
      { status: 500 }
    );
  }

  if (!mealPlan) {
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });
  }

  return NextResponse.json({ mealPlan });
}

// DELETE /api/meal-plans/[id] - Delete a meal plan
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("meal_plans")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting meal plan:", error);
    return NextResponse.json(
      { error: "Failed to delete meal plan" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

// PATCH /api/meal-plans/[id] - Re-roll a single meal in the plan
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { dayIndex } = body;

  if (typeof dayIndex !== "number") {
    return NextResponse.json(
      { error: "dayIndex is required" },
      { status: 400 }
    );
  }

  // Fetch the current meal plan
  const { data: mealPlan, error: fetchError } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !mealPlan) {
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });
  }

  const meals = mealPlan.meals as {
    weekPlan?: MealPlanDay[];
    prepTips?: string[];
    budgetEstimate?: string;
    shoppingCategories?: Record<string, string[]>;
  };

  if (!meals.weekPlan || dayIndex < 0 || dayIndex >= meals.weekPlan.length) {
    return NextResponse.json(
      { error: "Invalid day index" },
      { status: 400 }
    );
  }

  // Fetch user preferences
  const { data: prefsData } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const userPreferences: UserPreferences = {
    dietary: prefsData?.dietary as string[] || [],
    allergies: prefsData?.allergies as string[] || [],
    dislikes: prefsData?.dislikes as string[] || [],
    favoriteCuisines: prefsData?.favorite_cuisines as string[] || [],
    skillLevel: prefsData?.skill_level as UserPreferences["skillLevel"] || undefined,
    maxCookTime: prefsData?.max_cook_time || undefined,
    budget: prefsData?.budget || undefined,
    householdSize: prefsData?.household_size || undefined,
  };

  const currentMeal = meals.weekPlan[dayIndex];
  const otherMeals = meals.weekPlan.filter((_, i) => i !== dayIndex);

  try {
    // Generate a new meal using Claude
    const response = await rerollMeal({
      dayIndex,
      currentMeal,
      otherMeals,
      userPreferences,
    });

    // Update the meal plan with the new meal and shopping categories
    const updatedWeekPlan = [...meals.weekPlan];
    updatedWeekPlan[dayIndex] = response.data;

    // Only update shopping categories if we got valid ones back
    const hasValidShoppingCategories = response.shoppingCategories &&
      (response.shoppingCategories.proteins?.length > 0 ||
       response.shoppingCategories.produce?.length > 0 ||
       response.shoppingCategories.pantry?.length > 0 ||
       response.shoppingCategories.dairy?.length > 0);

    const updatedMeals = {
      ...meals,
      weekPlan: updatedWeekPlan,
      ...(hasValidShoppingCategories && { shoppingCategories: response.shoppingCategories }),
    };

    const { data: updatedPlan, error: updateError } = await supabase
      .from("meal_plans")
      .update({ meals: updatedMeals as unknown as Json })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating meal plan:", updateError);
      return NextResponse.json(
        { error: "Failed to update meal plan" },
        { status: 500 }
      );
    }

    // Mark any associated shopping list as stale
    await supabase
      .from("shopping_lists")
      .update({ stale: true })
      .eq("meal_plan_id", id)
      .eq("user_id", user.id);

    return NextResponse.json({
      mealPlan: updatedPlan,
      newMeal: response.data,
      message: response.message,
    });
  } catch (error) {
    console.error("Error re-rolling meal:", error);
    return NextResponse.json(
      { error: "Failed to generate new meal" },
      { status: 500 }
    );
  }
}
