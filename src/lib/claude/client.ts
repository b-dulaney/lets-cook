import Anthropic from "@anthropic-ai/sdk";
import {
  generateRecipePrompt,
  getRecipeDetailsPrompt,
  generateWeeklyMealPlanPrompt,
  generateShoppingListPrompt,
  updateUserPreferencesPrompt,
  modifyRecipePrompt,
  UserPreferences,
  RecipeSuggestion,
  FullRecipe,
  WeeklyMealPlan,
  ShoppingList,
  MealPlanDay,
} from "./prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Task types matching our prompt templates
export type TaskType =
  | "find_recipes"
  | "get_recipe_details"
  | "create_meal_plan"
  | "generate_shopping_list"
  | "update_preferences"
  | "modify_recipe"
  | "start_cooking_mode"
  | "general_query";

// Context types for each task
interface FindRecipesContext {
  ingredients: string[];
  userPreferences?: UserPreferences;
}

interface GetRecipeDetailsContext {
  recipeName: string;
  ingredients: string[];
  skillLevel?: string;
}

interface CreateMealPlanContext {
  userPreferences?: UserPreferences;
  numberOfDays?: number;
}

interface GenerateShoppingListContext {
  mealPlan: WeeklyMealPlan | MealPlanDay[];
  pantryItems?: string[];
}

interface UpdatePreferencesContext {
  userInput: string;
  currentPreferences?: UserPreferences;
}

interface ModifyRecipeContext {
  recipe: FullRecipe;
  modification: string;
}

interface CookingModeContext {
  recipe: FullRecipe;
  currentStep?: number;
}

interface GeneralQueryContext {
  query: string;
  userPreferences?: UserPreferences;
}

type TaskContext =
  | FindRecipesContext
  | GetRecipeDetailsContext
  | CreateMealPlanContext
  | GenerateShoppingListContext
  | UpdatePreferencesContext
  | ModifyRecipeContext
  | CookingModeContext
  | GeneralQueryContext;

interface AskClaudeParams {
  task: TaskType;
  context: TaskContext;
  sessionId: string;
}

// Response types for each task
interface RecipeSuggestionsResponse {
  message: string;
  data: {
    recipes: RecipeSuggestion[];
  };
}

interface RecipeDetailsResponse {
  message: string;
  data: FullRecipe;
}

interface MealPlanResponse {
  message: string;
  data: WeeklyMealPlan;
}

interface ShoppingListResponse {
  message: string;
  data: ShoppingList;
}

interface PreferencesResponse {
  message: string;
  data: UserPreferences;
}

interface ModifiedRecipeResponse {
  message: string;
  data: FullRecipe & {
    modifications: Array<{
      type: string;
      original: string;
      replacement: string;
      reason: string;
      impactOnRecipe: string;
    }>;
    modificationNotes: string;
  };
}

interface GeneralResponse {
  message: string;
  data?: Record<string, unknown>;
}

export type ClaudeResponse =
  | RecipeSuggestionsResponse
  | RecipeDetailsResponse
  | MealPlanResponse
  | ShoppingListResponse
  | PreferencesResponse
  | ModifiedRecipeResponse
  | GeneralResponse;

const SYSTEM_PROMPT = `You are a helpful meal planning assistant. You help users find recipes, plan meals, and create shopping lists.

When responding, always provide:
1. A conversational response for voice output
2. Structured data when applicable (recipes, meal plans, shopping lists)

Format your responses as JSON with this structure:
{
  "message": "The conversational response to speak to the user",
  "data": { /* structured data matching the requested format */ }
}

Keep voice responses concise and natural for Google Assistant. Avoid lists in spoken responses - summarize instead.`;

const COOKING_MODE_PROMPT = `You are guiding a user through cooking a recipe step by step.

Recipe: {recipe}
Current step: {currentStep}

Provide the next instruction in a clear, conversational way suitable for voice output.
If the user asks questions, answer them helpfully while keeping them on track.

Format as JSON:
{
  "message": "The spoken instruction or response",
  "data": {
    "currentStep": 1,
    "totalSteps": 10,
    "instruction": "The current step instruction",
    "tip": "Optional tip for this step",
    "estimatedTime": "5 minutes"
  }
}`;

const GENERAL_QUERY_PROMPT = `Answer the user's question about cooking, recipes, or meal planning.

User preferences: {preferences}
Question: {query}

Provide a helpful, conversational response.

Format as JSON:
{
  "message": "Your conversational response",
  "data": { /* any relevant structured data */ }
}`;

function buildPrompt(task: TaskType, context: TaskContext): string {
  switch (task) {
    case "find_recipes": {
      const ctx = context as FindRecipesContext;
      return generateRecipePrompt(ctx.ingredients, ctx.userPreferences || {});
    }

    case "get_recipe_details": {
      const ctx = context as GetRecipeDetailsContext;
      return getRecipeDetailsPrompt(
        ctx.recipeName,
        ctx.ingredients,
        ctx.skillLevel
      );
    }

    case "create_meal_plan": {
      const ctx = context as CreateMealPlanContext;
      return generateWeeklyMealPlanPrompt(
        ctx.userPreferences || {},
        ctx.numberOfDays || 7
      );
    }

    case "generate_shopping_list": {
      const ctx = context as GenerateShoppingListContext;
      return generateShoppingListPrompt(ctx.mealPlan, ctx.pantryItems || []);
    }

    case "update_preferences": {
      const ctx = context as UpdatePreferencesContext;
      return updateUserPreferencesPrompt(
        ctx.userInput,
        ctx.currentPreferences || {}
      );
    }

    case "modify_recipe": {
      const ctx = context as ModifyRecipeContext;
      return modifyRecipePrompt(ctx.recipe, ctx.modification);
    }

    case "start_cooking_mode": {
      const ctx = context as CookingModeContext;
      return COOKING_MODE_PROMPT.replace(
        "{recipe}",
        JSON.stringify(ctx.recipe, null, 2)
      ).replace("{currentStep}", String(ctx.currentStep || 1));
    }

    case "general_query": {
      const ctx = context as GeneralQueryContext;
      return GENERAL_QUERY_PROMPT.replace(
        "{preferences}",
        JSON.stringify(ctx.userPreferences || {}, null, 2)
      ).replace("{query}", ctx.query);
    }

    default:
      throw new Error(`Unknown task type: ${task}`);
  }
}

function getModelForTask(task: TaskType): string {
  // Use Sonnet for complex reasoning tasks, Haiku for simpler ones
  switch (task) {
    case "create_meal_plan":
    case "modify_recipe":
    case "general_query":
      return "claude-sonnet-4-20250514";
    default:
      return "claude-3-5-haiku-20241022";
  }
}

function getMaxTokensForTask(task: TaskType): number {
  switch (task) {
    case "create_meal_plan":
    case "generate_shopping_list":
      return 2048;
    case "get_recipe_details":
    case "modify_recipe":
      return 1536;
    default:
      return 1024;
  }
}

export async function askClaude({
  task,
  context,
  sessionId,
}: AskClaudeParams): Promise<ClaudeResponse> {
  const prompt = buildPrompt(task, context);
  const model = getModelForTask(task);
  const maxTokens = getMaxTokensForTask(task);

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Strip markdown code blocks if present
    let jsonText = content.text.trim();
    if (jsonText.startsWith("```")) {
      // Remove opening ```json or ``` and closing ```
      jsonText = jsonText
        .replace(/^```(?:json)?\s*\n?/, "")
        .replace(/\n?```\s*$/, "");
    }

    // Parse JSON response from Claude
    const parsed = JSON.parse(jsonText) as ClaudeResponse;
    return parsed;
  } catch (error) {
    console.error("Claude API error:", error);
    return {
      message:
        "I'm having trouble processing that request. Could you try again?",
    };
  }
}

// Convenience functions for common tasks
export async function findRecipes(
  ingredients: string[],
  userPreferences?: UserPreferences,
  sessionId: string = "default"
): Promise<RecipeSuggestionsResponse> {
  return askClaude({
    task: "find_recipes",
    context: { ingredients, userPreferences },
    sessionId,
  }) as Promise<RecipeSuggestionsResponse>;
}

export async function getRecipeDetails(
  recipeName: string,
  ingredients: string[],
  skillLevel?: string,
  sessionId: string = "default"
): Promise<RecipeDetailsResponse> {
  return askClaude({
    task: "get_recipe_details",
    context: { recipeName, ingredients, skillLevel },
    sessionId,
  }) as Promise<RecipeDetailsResponse>;
}

export async function createMealPlan(
  userPreferences?: UserPreferences,
  numberOfDays: number = 7,
  sessionId: string = "default"
): Promise<MealPlanResponse> {
  return askClaude({
    task: "create_meal_plan",
    context: { userPreferences, numberOfDays },
    sessionId,
  }) as Promise<MealPlanResponse>;
}

export async function generateShoppingList(
  mealPlan: WeeklyMealPlan | MealPlanDay[],
  pantryItems?: string[],
  sessionId: string = "default"
): Promise<ShoppingListResponse> {
  return askClaude({
    task: "generate_shopping_list",
    context: { mealPlan, pantryItems },
    sessionId,
  }) as Promise<ShoppingListResponse>;
}

export async function updatePreferences(
  userInput: string,
  currentPreferences?: UserPreferences,
  sessionId: string = "default"
): Promise<PreferencesResponse> {
  return askClaude({
    task: "update_preferences",
    context: { userInput, currentPreferences },
    sessionId,
  }) as Promise<PreferencesResponse>;
}

export async function modifyRecipe(
  recipe: FullRecipe,
  modification: string,
  sessionId: string = "default"
): Promise<ModifiedRecipeResponse> {
  return askClaude({
    task: "modify_recipe",
    context: { recipe, modification },
    sessionId,
  }) as Promise<ModifiedRecipeResponse>;
}

// Re-export types for convenience
export type {
  UserPreferences,
  RecipeSuggestion,
  FullRecipe,
  WeeklyMealPlan,
  ShoppingList,
  MealPlanDay,
};
