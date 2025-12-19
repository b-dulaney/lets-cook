import { createClient } from "@/lib/supabase/server";
import { createMealPlan } from "@/lib/claude/client";
import { NextRequest, NextResponse } from "next/server";
import type { Json } from "@/types/database";

// GET /api/meal-plans - List user's meal plans
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");

  const { data: mealPlans, error } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching meal plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal plans" },
      { status: 500 }
    );
  }

  return NextResponse.json({ mealPlans });
}

// POST /api/meal-plans - Create a new meal plan
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { weekStart, meals, generate, numberOfDays, preferences, slowCookerMeals } = body;

  // If generate flag is set, use Claude to create the meal plan
  if (generate) {
    try {
      // Fetch recent meal plans to avoid repeating recipes
      const { data: recentPlans } = await supabase
        .from("meal_plans")
        .select("meals")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3); // Last 3 weeks of plans

      // Extract recipe names from recent plans
      const recentRecipes: string[] = [];
      if (recentPlans) {
        for (const plan of recentPlans) {
          const meals = plan.meals as { weekPlan?: Array<{ meal?: string }> };
          if (meals?.weekPlan) {
            for (const day of meals.weekPlan) {
              if (day.meal) {
                recentRecipes.push(day.meal.toLowerCase());
              }
            }
          }
        }
      }

      const response = await createMealPlan(preferences, numberOfDays || 7, recentRecipes, slowCookerMeals);

      // Calculate week start date (next Monday if not provided)
      const startDate = weekStart || getNextMonday();

      const { data: mealPlan, error } = await supabase
        .from("meal_plans")
        .insert({
          user_id: user.id,
          week_start: startDate,
          meals: response.data as unknown as Json,
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving meal plan:", error);
        return NextResponse.json(
          { error: "Failed to save meal plan" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        mealPlan,
        message: response.message,
      });
    } catch (error) {
      console.error("Error generating meal plan:", error);
      return NextResponse.json(
        { error: "Failed to generate meal plan" },
        { status: 500 }
      );
    }
  }

  // Manual meal plan creation
  if (!weekStart || !meals) {
    return NextResponse.json(
      { error: "weekStart and meals are required" },
      { status: 400 }
    );
  }

  const { data: mealPlan, error } = await supabase
    .from("meal_plans")
    .insert({
      user_id: user.id,
      week_start: weekStart,
      meals: meals as Json,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating meal plan:", error);
    return NextResponse.json(
      { error: "Failed to create meal plan" },
      { status: 500 }
    );
  }

  return NextResponse.json({ mealPlan }, { status: 201 });
}

// Helper to get next Monday's date
function getNextMonday(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);
  return nextMonday.toISOString().split("T")[0];
}
