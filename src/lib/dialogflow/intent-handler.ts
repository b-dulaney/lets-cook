import type {
  DialogflowParameter,
  DialogflowResponse,
} from "@/types/dialogflow";
import { askClaude } from "@/lib/claude/client";

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
  sessionId,
  userQuery,
  sessionParameters,
}: IntentHandlerParams): Promise<DialogflowResponse> {
  switch (intentName) {
    case "find.recipe.by.ingredients":
      return handleFindRecipeByIngredients(parameters, sessionId);

    case "get.recipe.details":
      return handleGetRecipeDetails(parameters, sessionId);

    case "create.meal.plan":
      return handleCreateMealPlan(parameters, sessionId);

    case "get.shopping.list":
      return handleGetShoppingList(sessionId);

    case "save.favorite.recipe":
      return handleSaveFavorite(parameters, sessionId);

    case "start.cooking.mode":
      return handleStartCookingMode(parameters, sessionId);

    default:
      return handleDefaultFallback(userQuery, sessionId);
  }
}

async function handleFindRecipeByIngredients(
  parameters: Record<string, DialogflowParameter>,
  sessionId: string
): Promise<DialogflowResponse> {
  const ingredients = parameters.ingredients?.resolvedValue as string[] || [];

  const response = await askClaude({
    task: "find_recipes",
    context: { ingredients },
    sessionId,
  });

  return {
    fulfillmentResponse: {
      messages: [{ text: { text: [response.message] } }],
    },
    sessionInfo: {
      parameters: {
        lastRecipes: response.data?.recipes || [],
      },
    },
  };
}

async function handleGetRecipeDetails(
  parameters: Record<string, DialogflowParameter>,
  sessionId: string
): Promise<DialogflowResponse> {
  const recipeName = parameters.recipe_name?.resolvedValue as string || "";

  const response = await askClaude({
    task: "get_recipe_details",
    context: { recipeName },
    sessionId,
  });

  return {
    fulfillmentResponse: {
      messages: [{ text: { text: [response.message] } }],
    },
    sessionInfo: {
      parameters: {
        currentRecipe: response.data?.recipe || null,
      },
    },
  };
}

async function handleCreateMealPlan(
  parameters: Record<string, DialogflowParameter>,
  sessionId: string
): Promise<DialogflowResponse> {
  const days = (parameters.days?.resolvedValue as number) || 7;
  const preferences = parameters.preferences?.resolvedValue as string[] || [];

  const response = await askClaude({
    task: "create_meal_plan",
    context: { days, preferences },
    sessionId,
  });

  return {
    fulfillmentResponse: {
      messages: [{ text: { text: [response.message] } }],
    },
    sessionInfo: {
      parameters: {
        currentMealPlan: response.data?.mealPlan || null,
      },
    },
  };
}

async function handleGetShoppingList(
  sessionId: string
): Promise<DialogflowResponse> {
  const response = await askClaude({
    task: "generate_shopping_list",
    context: {},
    sessionId,
  });

  return {
    fulfillmentResponse: {
      messages: [{ text: { text: [response.message] } }],
    },
  };
}

async function handleSaveFavorite(
  parameters: Record<string, DialogflowParameter>,
  sessionId: string
): Promise<DialogflowResponse> {
  const recipeName = parameters.recipe_name?.resolvedValue as string || "";

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
  parameters: Record<string, DialogflowParameter>,
  sessionId: string
): Promise<DialogflowResponse> {
  const recipeName = parameters.recipe_name?.resolvedValue as string || "";

  const response = await askClaude({
    task: "start_cooking_mode",
    context: { recipeName },
    sessionId,
  });

  return {
    fulfillmentResponse: {
      messages: [{ text: { text: [response.message] } }],
    },
    sessionInfo: {
      parameters: {
        cookingMode: true,
        currentStep: 1,
        currentRecipe: response.data?.recipe || null,
      },
    },
  };
}

async function handleDefaultFallback(
  userQuery: string,
  sessionId: string
): Promise<DialogflowResponse> {
  const response = await askClaude({
    task: "general_query",
    context: { query: userQuery },
    sessionId,
  });

  return {
    fulfillmentResponse: {
      messages: [{ text: { text: [response.message] } }],
    },
  };
}
