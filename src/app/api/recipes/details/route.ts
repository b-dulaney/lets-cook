import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getRecipeDetails } from "@/lib/claude/client";
import type { Json } from "@/types/database";

// Parse time string like "30 minutes" to number
function parseTimeToMinutes(timeStr: string): number | null {
  const match = timeStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

// POST /api/recipes/details - Generate a new recipe with Claude and save to DB
// Returns the recipe data along with its database ID for linking
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { recipeName, ingredients, skillLevel, cookTime, difficulty, servings } = body;

  if (!recipeName) {
    return NextResponse.json(
      { error: "Recipe name is required" },
      { status: 400 }
    );
  }

  // Build constraints from meal plan context
  const constraints: { cookTime?: string; difficulty?: string; servings?: number } = {};
  if (cookTime) constraints.cookTime = cookTime;
  if (difficulty) constraints.difficulty = difficulty;
  if (servings) constraints.servings = servings;
  const hasConstraints = Object.keys(constraints).length > 0;

  try {
    // Get user preferences for skill level and household size fallback
    let userSkillLevel = skillLevel;

    if (!userSkillLevel || !constraints.servings) {
      const { data: prefsData } = await supabase
        .from("user_preferences")
        .select("skill_level, household_size")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!userSkillLevel) {
        userSkillLevel = prefsData?.skill_level || "intermediate";
      }
      // Use household size as default servings if not specified
      if (!constraints.servings && prefsData?.household_size) {
        constraints.servings = prefsData.household_size;
      }
    }

    // Generate recipe with Claude
    const result = await getRecipeDetails(
      recipeName,
      ingredients || [],
      userSkillLevel,
      hasConstraints || constraints.servings ? constraints : undefined
    );

    const generatedRecipe = result.data;

    // Save the generated recipe to the database
    const { data: savedRecipe, error: insertError } = await supabase
      .from("recipes")
      .insert({
        title: recipeName,
        description: `${generatedRecipe.difficulty} recipe - ${generatedRecipe.totalTime}`,
        ingredients: generatedRecipe.ingredients as unknown as Json,
        instructions: generatedRecipe.instructions as unknown as Json,
        prep_time: parseTimeToMinutes(generatedRecipe.prepTime),
        cook_time: parseTimeToMinutes(generatedRecipe.cookTime),
        total_time: generatedRecipe.totalTime,
        servings: generatedRecipe.servings,
        difficulty: generatedRecipe.difficulty,
        source: "claude",
        metadata: {
          tips: generatedRecipe.tips,
          substitutions: generatedRecipe.substitutions,
          nutrition: generatedRecipe.nutrition,
          generatedName: generatedRecipe.recipeName,
          constraints: hasConstraints ? constraints : undefined,
        } as unknown as Json,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Error saving recipe to database:", insertError);
      // Still return the recipe even if save failed
      return NextResponse.json({
        recipe: generatedRecipe,
        recipeId: null,
        message: result.message,
        saved: false,
      });
    }

    return NextResponse.json({
      recipe: generatedRecipe,
      recipeId: savedRecipe.id,
      message: result.message,
      saved: true,
    });
  } catch (error) {
    console.error("Error generating recipe details:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe details" },
      { status: 500 }
    );
  }
}
