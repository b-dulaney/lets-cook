import type {
  DialogflowParameter,
  DialogflowResponse,
} from "@/types/dialogflow";
import {
  askClaude,
  findRecipes,
  getRecipeDetails,
  createMealPlan,
  generateShoppingList,
  type UserPreferences,
  type FullRecipe,
  type WeeklyMealPlan,
} from "@/lib/claude/client";

interface IntentHandlerParams {
  intentName: string;
  parameters: Record<string, DialogflowParameter>;
  sessionId: string;
  userQuery: string;
  sessionParameters?: Record<string, unknown>;
}

export async function handleIntent({
  intentName,
  parameters,
  userQuery,
  sessionParameters,
}: IntentHandlerParams): Promise<DialogflowResponse> {
  switch (intentName) {
    case "find.recipe.by.ingredients":
      return handleFindRecipeByIngredients(parameters, sessionParameters);

    case "get.recipe.details":
      return handleGetRecipeDetails(parameters, sessionParameters);

    case "create.meal.plan":
      return handleCreateMealPlan(parameters, sessionParameters);

    case "get.shopping.list":
      return handleGetShoppingList(sessionParameters);

    case "save.favorite.recipe":
      return handleSaveFavorite(parameters);

    case "start.cooking.mode":
      return handleStartCookingMode(parameters, sessionParameters);

    default:
      return handleDefaultFallback(userQuery, sessionParameters);
  }
}

async function handleFindRecipeByIngredients(
  parameters: Record<string, DialogflowParameter>,
  sessionParameters?: Record<string, unknown>,
): Promise<DialogflowResponse> {
  const ingredients = (parameters.ingredients?.resolvedValue as string[]) || [];
  const userPreferences =
    (sessionParameters?.userPreferences as UserPreferences) || {};

  const response = await findRecipes(ingredients, userPreferences);

  return {
    fulfillmentResponse: {
      messages: [{ text: { text: [response.message] } }],
    },
    sessionInfo: {
      parameters: {
        lastRecipes: response.data?.recipes || [],
        lastIngredients: ingredients,
      },
    },
  };
}

async function handleGetRecipeDetails(
  parameters: Record<string, DialogflowParameter>,
  sessionParameters?: Record<string, unknown>,
): Promise<DialogflowResponse> {
  const recipeName = (parameters.recipe_name?.resolvedValue as string) || "";
  const ingredients =
    (sessionParameters?.lastIngredients as string[]) ||
    (parameters.ingredients?.resolvedValue as string[]) ||
    [];
  const userPreferences =
    (sessionParameters?.userPreferences as UserPreferences) || {};
  const skillLevel = userPreferences.skillLevel || "intermediate";

  const response = await getRecipeDetails(recipeName, ingredients, skillLevel);

  return {
    fulfillmentResponse: {
      messages: [{ text: { text: [response.message] } }],
    },
    sessionInfo: {
      parameters: {
        currentRecipe: response.data || null,
      },
    },
  };
}

async function handleCreateMealPlan(
  parameters: Record<string, DialogflowParameter>,
  sessionParameters?: Record<string, unknown>,
): Promise<DialogflowResponse> {
  const numberOfDays = (parameters.days?.resolvedValue as number) || 7;
  const userPreferences =
    (sessionParameters?.userPreferences as UserPreferences) || {};

  // Merge any preferences from parameters
  const dietaryFromParams = parameters.preferences?.resolvedValue as
    | string[]
    | undefined;
  if (dietaryFromParams && dietaryFromParams.length > 0) {
    userPreferences.dietary = dietaryFromParams;
  }

  const response = await createMealPlan(userPreferences, numberOfDays);

  return {
    fulfillmentResponse: {
      messages: [{ text: { text: [response.message] } }],
    },
    sessionInfo: {
      parameters: {
        currentMealPlan: response.data || null,
      },
    },
  };
}

async function handleGetShoppingList(
  sessionParameters?: Record<string, unknown>,
): Promise<DialogflowResponse> {
  const mealPlan = sessionParameters?.currentMealPlan as
    | WeeklyMealPlan
    | undefined;
  const pantryItems = (sessionParameters?.pantryItems as string[]) || [];

  if (!mealPlan) {
    return {
      fulfillmentResponse: {
        messages: [
          {
            text: {
              text: [
                "I don't have a meal plan to create a shopping list from. Would you like me to create a meal plan first?",
              ],
            },
          },
        ],
      },
    };
  }

  const response = await generateShoppingList(mealPlan, pantryItems);

  return {
    fulfillmentResponse: {
      messages: [{ text: { text: [response.message] } }],
    },
    sessionInfo: {
      parameters: {
        currentShoppingList: response.data || null,
      },
    },
  };
}

async function handleSaveFavorite(
  parameters: Record<string, DialogflowParameter>,
): Promise<DialogflowResponse> {
  const recipeName = (parameters.recipe_name?.resolvedValue as string) || "";

  // TODO: Save to Supabase

  return {
    fulfillmentResponse: {
      messages: [
        {
          text: {
            text: [`I've saved ${recipeName} to your favorites!`],
          },
        },
      ],
    },
  };
}

async function handleStartCookingMode(
  _parameters: Record<string, DialogflowParameter>,
  sessionParameters?: Record<string, unknown>,
): Promise<DialogflowResponse> {
  const recipe = sessionParameters?.currentRecipe as FullRecipe | undefined;

  if (!recipe) {
    return {
      fulfillmentResponse: {
        messages: [
          {
            text: {
              text: [
                "I don't have a recipe loaded. Please select a recipe first by asking me for recipe details.",
              ],
            },
          },
        ],
      },
    };
  }

  const response = await askClaude({
    task: "start_cooking_mode",
    context: { recipe, currentStep: 1 },
  });

  return {
    fulfillmentResponse: {
      messages: [{ text: { text: [response.message] } }],
    },
    sessionInfo: {
      parameters: {
        cookingMode: true,
        currentStep: 1,
        currentRecipe: recipe,
      },
    },
  };
}

async function handleDefaultFallback(
  userQuery: string,
  sessionParameters?: Record<string, unknown>,
): Promise<DialogflowResponse> {
  const userPreferences =
    (sessionParameters?.userPreferences as UserPreferences) || {};

  const response = await askClaude({
    task: "general_query",
    context: { query: userQuery, userPreferences },
  });

  return {
    fulfillmentResponse: {
      messages: [{ text: { text: [response.message] } }],
    },
  };
}
