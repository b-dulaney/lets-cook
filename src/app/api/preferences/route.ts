import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/preferences - Get user's preferences
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: preferences, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }

  return NextResponse.json({ preferences });
}

// PUT /api/preferences - Update user's preferences
export async function PUT(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Extract only allowed fields
  const {
    skillLevel,
    maxCookTime,
    budget,
    householdSize,
    dietary,
    allergies,
    dislikes,
    favoriteCuisines,
    pantryItems,
    additionalNotes,
  } = body;

  // Build update object with snake_case keys
  const updates: Record<string, unknown> = {};
  if (skillLevel !== undefined) updates.skill_level = skillLevel;
  if (maxCookTime !== undefined) updates.max_cook_time = maxCookTime;
  if (budget !== undefined) updates.budget = budget;
  if (householdSize !== undefined) updates.household_size = householdSize;
  if (dietary !== undefined) updates.dietary = dietary;
  if (allergies !== undefined) updates.allergies = allergies;
  if (dislikes !== undefined) updates.dislikes = dislikes;
  if (favoriteCuisines !== undefined) updates.favorite_cuisines = favoriteCuisines;
  if (pantryItems !== undefined) updates.pantry_items = pantryItems;
  if (additionalNotes !== undefined) updates.additional_notes = additionalNotes;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  const { data: preferences, error } = await supabase
    .from("user_preferences")
    .update(updates)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }

  return NextResponse.json({ preferences });
}
