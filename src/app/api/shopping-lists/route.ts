import { createClient } from "@/lib/supabase/server";
import {
  generateShoppingList,
  type WeeklyMealPlan,
  type ShoppingList as ClaudeShoppingList,
} from "@/lib/claude/client";
import { NextRequest, NextResponse } from "next/server";
import type { Json } from "@/types/database";

interface ShoppingListItem {
  item: string;
  quantity: string;
  category?: string;
  purchased: boolean;
}

// Flatten Claude's categorized shopping list into a flat array
function flattenShoppingList(data: ClaudeShoppingList): ShoppingListItem[] {
  const items: ShoppingListItem[] = [];
  const categories = data.shoppingList;

  for (const [category, categoryItems] of Object.entries(categories)) {
    if (Array.isArray(categoryItems)) {
      for (const item of categoryItems) {
        items.push({
          item: item.item,
          quantity: item.quantity,
          category,
          purchased: false,
        });
      }
    }
  }

  return items;
}

// GET /api/shopping-lists - List user's shopping lists
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const mealPlanId = searchParams.get("mealPlanId");

  // If mealPlanId provided, return single shopping list for that meal plan
  if (mealPlanId) {
    const { data: shoppingList, error } = await supabase
      .from("shopping_lists")
      .select("id, stale")
      .eq("user_id", user.id)
      .eq("meal_plan_id", mealPlanId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error fetching shopping list:", error);
      return NextResponse.json(
        { error: "Failed to fetch shopping list" },
        { status: 500 }
      );
    }

    return NextResponse.json({ shoppingList: shoppingList || null });
  }

  // Otherwise, return paginated list
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");

  const { data: shoppingLists, error } = await supabase
    .from("shopping_lists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching shopping lists:", error);
    return NextResponse.json(
      { error: "Failed to fetch shopping lists" },
      { status: 500 }
    );
  }

  return NextResponse.json({ shoppingLists });
}

// POST /api/shopping-lists - Create a new shopping list
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { mealPlanId, items, generate, pantryItems } = body;

  // If generate flag is set and mealPlanId provided, generate from meal plan
  if (generate && mealPlanId) {
    // Fetch the meal plan
    const { data: mealPlan, error: mealPlanError } = await supabase
      .from("meal_plans")
      .select("meals")
      .eq("id", mealPlanId)
      .eq("user_id", user.id)
      .single();

    if (mealPlanError || !mealPlan) {
      return NextResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    try {
      const response = await generateShoppingList(
        mealPlan.meals as unknown as WeeklyMealPlan,
        pantryItems || []
      );

      // Flatten the categorized shopping list into a flat array with purchased status
      const itemsWithStatus = flattenShoppingList(response.data);

      const { data: shoppingList, error } = await supabase
        .from("shopping_lists")
        .insert({
          user_id: user.id,
          meal_plan_id: mealPlanId,
          items: itemsWithStatus as unknown as Json,
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving shopping list:", error);
        return NextResponse.json(
          { error: "Failed to save shopping list" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        shoppingList,
        message: response.message,
      });
    } catch (error) {
      console.error("Error generating shopping list:", error);
      return NextResponse.json(
        { error: "Failed to generate shopping list" },
        { status: 500 }
      );
    }
  }

  // Manual shopping list creation
  if (!items || !Array.isArray(items)) {
    return NextResponse.json(
      { error: "Items array is required" },
      { status: 400 }
    );
  }

  // Ensure all items have purchased status
  const itemsWithStatus: ShoppingListItem[] = items.map((item: Partial<ShoppingListItem>) => ({
    item: item.item || "",
    quantity: item.quantity || "",
    category: item.category,
    purchased: item.purchased ?? false,
  }));

  const { data: shoppingList, error } = await supabase
    .from("shopping_lists")
    .insert({
      user_id: user.id,
      meal_plan_id: mealPlanId || null,
      items: itemsWithStatus as unknown as Json,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating shopping list:", error);
    return NextResponse.json(
      { error: "Failed to create shopping list" },
      { status: 500 }
    );
  }

  return NextResponse.json({ shoppingList }, { status: 201 });
}
