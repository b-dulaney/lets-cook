import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { findRecipes } from "@/lib/claude/client";
import { UserPreferences } from "@/lib/claude/prompts";

// POST /api/recipes/discover - Discover recipes based on ingredients
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { ingredients, preferences, cookingMethod } = body;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return NextResponse.json(
      { error: "At least one ingredient is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch user preferences if not provided
    let userPreferences: UserPreferences | undefined = preferences;

    if (!userPreferences) {
      const { data: prefsData } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (prefsData) {
        // Map skill level to valid type
        const skillLevelMap: Record<string, "beginner" | "intermediate" | "advanced"> = {
          beginner: "beginner",
          intermediate: "intermediate",
          advanced: "advanced",
        };

        userPreferences = {
          dietary: prefsData.dietary || [],
          allergies: prefsData.allergies || [],
          dislikes: prefsData.dislikes || [],
          skillLevel: skillLevelMap[prefsData.skill_level || ""] || "intermediate",
          householdSize: prefsData.household_size || undefined,
          maxCookTime: prefsData.max_cook_time || undefined,
          budget: prefsData.budget || undefined,
          favoriteCuisines: prefsData.favorite_cuisines || [],
        };
      }
    }

    const result = await findRecipes(ingredients, userPreferences, cookingMethod);

    return NextResponse.json({
      recipes: result.data.recipes,
      message: result.message,
    });
  } catch (error) {
    console.error("Error discovering recipes:", error);
    return NextResponse.json(
      { error: "Failed to discover recipes" },
      { status: 500 }
    );
  }
}
