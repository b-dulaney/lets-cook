import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { Database, Json } from "@/types/database";

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
