import Anthropic from "@anthropic-ai/sdk";
import {
  generateRecipePrompt,
  getRecipeDetailsPrompt,
  generateWeeklyMealPlanPrompt,
  generateShoppingListPrompt,
  updateUserPreferencesPrompt,
  modifyRecipePrompt,
  rerollMealPrompt,
  UserPreferences,
  RecipeSuggestion,
  FullRecipe,
  WeeklyMealPlan,
  ShoppingList,
  MealPlanDay,
  RerollMealContext,
  ShoppingCategories,
  RecipeConstraints,
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
  | "reroll_meal"
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
  | RerollMealContext
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

interface RerolledMealResponse {
  message: string;
  data: MealPlanDay;
  shoppingCategories: ShoppingCategories;
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
  | RerolledMealResponse
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

    case "reroll_meal": {
      const ctx = context as RerollMealContext;
      return rerollMealPrompt(ctx);
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
    case "reroll_meal":
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

function getTemperatureForTask(task: TaskType): number {
  switch (task) {
    // Higher temperature for creative tasks that benefit from variety
    case "create_meal_plan":
    case "reroll_meal":
      return 1.0; // Maximum creativity for meal variety
    case "find_recipes":
      return 0.9; // High creativity for recipe suggestions
    case "general_query":
      return 0.8; // Moderately creative for general responses
    // Lower temperature for tasks requiring precision
    case "get_recipe_details":
    case "modify_recipe":
    case "generate_shopping_list":
      return 0.6; // More consistent for structured outputs
    case "update_preferences":
      return 0.3; // Very consistent for preference extraction
    default:
      return 0.7;
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
  const temperature = getTemperatureForTask(task);

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
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

// ============================================
// Convenience Functions (using Tool Use)
// ============================================

export async function findRecipes(
  ingredients: string[],
  userPreferences?: UserPreferences
): Promise<RecipeSuggestionsResponse> {
  const prompt = generateRecipePrompt(ingredients, userPreferences || {});

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    temperature: 0.9,
    tools: [findRecipesTool],
    tool_choice: { type: "tool", name: "submit_recipe_suggestions" },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new Error("Failed to get structured response from Claude");
  }

  const result = toolUse.input as { recipes: RecipeSuggestion[] };

  return {
    message: `Found ${result.recipes.length} recipe suggestions`,
    data: { recipes: result.recipes },
  };
}

export async function getRecipeDetails(
  recipeName: string,
  ingredients: string[],
  skillLevel?: string,
  constraints?: RecipeConstraints
): Promise<RecipeDetailsResponse> {
  const prompt = getRecipeDetailsPrompt(recipeName, ingredients, skillLevel, constraints);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    temperature: 0.6,
    tools: [recipeDetailsTool],
    tool_choice: { type: "tool", name: "submit_recipe_details" },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new Error("Failed to get structured response from Claude");
  }

  const result = toolUse.input as FullRecipe;

  return {
    message: `Here's the complete recipe for ${result.recipeName}`,
    data: result,
  };
}

export async function createMealPlan(
  userPreferences?: UserPreferences,
  numberOfDays: number = 7,
  recentRecipes: string[] = []
): Promise<MealPlanResponse> {
  const prompt = generateWeeklyMealPlanPrompt(userPreferences || {}, numberOfDays, recentRecipes);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    temperature: 1.0, // Max creativity for meal variety
    tools: [mealPlanTool],
    tool_choice: { type: "tool", name: "submit_meal_plan" },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new Error("Failed to get structured response from Claude");
  }

  const result = toolUse.input as WeeklyMealPlan;

  return {
    message: `Created a ${numberOfDays}-day meal plan`,
    data: result,
  };
}

export async function generateShoppingList(
  mealPlan: WeeklyMealPlan | MealPlanDay[],
  pantryItems?: string[]
): Promise<ShoppingListResponse> {
  const prompt = generateShoppingListPrompt(mealPlan, pantryItems);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    temperature: 0.6,
    tools: [shoppingListTool],
    tool_choice: { type: "tool", name: "submit_shopping_list" },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new Error("Failed to get structured response from Claude");
  }

  const result = toolUse.input as ShoppingList;

  return {
    message: "Generated your shopping list",
    data: result,
  };
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
  modification: string
): Promise<ModifiedRecipeResponse> {
  const prompt = modifyRecipePrompt(recipe, modification);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    temperature: 0.6,
    tools: [modifyRecipeTool],
    tool_choice: { type: "tool", name: "submit_modified_recipe" },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new Error("Failed to get structured response from Claude");
  }

  const result = toolUse.input as ModifiedRecipeResponse["data"];

  return {
    message: `Modified recipe: ${result.recipeName}`,
    data: result,
  };
}

// ============================================
// Tool Definitions for Structured Outputs
// ============================================

// Tool for recipe suggestions
const findRecipesTool: Anthropic.Tool = {
  name: "submit_recipe_suggestions",
  description: "Submit recipe suggestions based on available ingredients",
  input_schema: {
    type: "object" as const,
    properties: {
      recipes: {
        type: "array",
        description: "List of recipe suggestions",
        items: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name of the recipe" },
            description: { type: "string", description: "Brief description of the dish" },
            cookTime: { type: "string", description: "Total cooking time" },
            difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
            usesIngredients: {
              type: "array",
              items: { type: "string" },
              description: "Ingredients from user's list that are used",
            },
            additionalIngredients: {
              type: "array",
              items: { type: "string" },
              description: "Additional ingredients needed",
            },
            cuisineType: { type: "string", description: "Type of cuisine" },
          },
          required: ["name", "description", "cookTime", "difficulty", "usesIngredients", "additionalIngredients", "cuisineType"],
        },
      },
    },
    required: ["recipes"],
  },
};

// Tool for full recipe details
const recipeDetailsTool: Anthropic.Tool = {
  name: "submit_recipe_details",
  description: "Submit complete recipe details with ingredients, instructions, and tips",
  input_schema: {
    type: "object" as const,
    properties: {
      recipeName: { type: "string" },
      servings: { type: "number" },
      prepTime: { type: "string" },
      cookTime: { type: "string" },
      totalTime: { type: "string" },
      difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
      ingredients: {
        type: "array",
        items: {
          type: "object",
          properties: {
            item: { type: "string" },
            amount: { type: "string" },
            notes: { type: "string" },
          },
          required: ["item", "amount"],
        },
      },
      instructions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            step: { type: "number" },
            instruction: { type: "string" },
            time: { type: "string" },
            tip: { type: "string" },
          },
          required: ["step", "instruction"],
        },
      },
      tips: { type: "array", items: { type: "string" } },
      substitutions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            original: { type: "string" },
            alternative: { type: "string" },
            reason: { type: "string" },
          },
          required: ["original", "alternative", "reason"],
        },
      },
      nutrition: {
        type: "object",
        properties: {
          calories: { type: "string" },
          protein: { type: "string" },
          notes: { type: "string" },
        },
        required: ["calories", "protein", "notes"],
      },
      cuisineType: {
        type: "string",
        enum: ["African", "American", "British", "Cajun", "Caribbean", "Chinese", "Eastern European", "French", "German", "Greek", "Indian", "Irish", "Italian", "Japanese", "Jewish", "Korean", "Latin American", "Mediterranean", "Mexican", "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"],
        description: "The cuisine type of this recipe",
      },
      imageSearchTerms: {
        type: "string",
        description: "TWO or THREE words: main protein/ingredient + dish type (e.g., 'chicken pasta', 'beef tacos', 'salmon bowl', 'vegetable curry')",
      },
    },
    required: ["recipeName", "servings", "prepTime", "cookTime", "totalTime", "difficulty", "ingredients", "instructions", "tips", "substitutions", "nutrition", "cuisineType", "imageSearchTerms"],
  },
};

// Tool for weekly meal plan
const mealPlanTool: Anthropic.Tool = {
  name: "submit_meal_plan",
  description: "Submit a weekly meal plan with shopping categories and prep tips",
  input_schema: {
    type: "object" as const,
    properties: {
      weekPlan: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "string" },
            meal: { type: "string" },
            cookTime: { type: "string" },
            difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
            description: { type: "string" },
            mainIngredients: { type: "array", items: { type: "string" } },
            cuisineType: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
          },
          required: ["day", "meal", "cookTime", "difficulty", "description", "mainIngredients", "cuisineType"],
        },
      },
      shoppingCategories: {
        type: "object",
        properties: {
          proteins: { type: "array", items: { type: "string" } },
          produce: { type: "array", items: { type: "string" } },
          pantry: { type: "array", items: { type: "string" } },
          dairy: { type: "array", items: { type: "string" } },
        },
        required: ["proteins", "produce", "pantry", "dairy"],
      },
      prepTips: { type: "array", items: { type: "string" } },
      budgetEstimate: { type: "string" },
    },
    required: ["weekPlan", "shoppingCategories", "prepTips", "budgetEstimate"],
  },
};

// Shopping list item schema (reusable)
const shoppingListItemSchema = {
  type: "object",
  properties: {
    item: { type: "string" },
    quantity: { type: "string" },
    usedIn: { type: "array", items: { type: "string" } },
    priority: { type: "string", enum: ["essential", "optional"] },
    notes: { type: "string" },
  },
  required: ["item", "quantity", "usedIn", "priority"],
};

// Tool for shopping list
const shoppingListTool: Anthropic.Tool = {
  name: "submit_shopping_list",
  description: "Submit a categorized shopping list with estimated totals",
  input_schema: {
    type: "object" as const,
    properties: {
      shoppingList: {
        type: "object",
        properties: {
          Produce: { type: "array", items: shoppingListItemSchema },
          Meat: { type: "array", items: shoppingListItemSchema },
          Dairy: { type: "array", items: shoppingListItemSchema },
          "Pantry/Dry Goods": { type: "array", items: shoppingListItemSchema },
          Frozen: { type: "array", items: shoppingListItemSchema },
          Bakery: { type: "array", items: shoppingListItemSchema },
          "Condiments/Sauces": { type: "array", items: shoppingListItemSchema },
        },
        required: ["Produce", "Meat", "Dairy", "Pantry/Dry Goods", "Frozen", "Bakery", "Condiments/Sauces"],
      },
      estimatedTotal: { type: "string" },
      optionalItems: {
        type: "array",
        items: {
          type: "object",
          properties: {
            item: { type: "string" },
            reason: { type: "string" },
          },
          required: ["item", "reason"],
        },
      },
      moneySavingTips: { type: "array", items: { type: "string" } },
    },
    required: ["shoppingList", "estimatedTotal", "optionalItems", "moneySavingTips"],
  },
};

// Tool for modified recipe
const modifyRecipeTool: Anthropic.Tool = {
  name: "submit_modified_recipe",
  description: "Submit a modified recipe with all changes documented",
  input_schema: {
    type: "object" as const,
    properties: {
      recipeName: { type: "string" },
      servings: { type: "number" },
      prepTime: { type: "string" },
      cookTime: { type: "string" },
      totalTime: { type: "string" },
      difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
      ingredients: {
        type: "array",
        items: {
          type: "object",
          properties: {
            item: { type: "string" },
            amount: { type: "string" },
            notes: { type: "string" },
          },
          required: ["item", "amount"],
        },
      },
      instructions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            step: { type: "number" },
            instruction: { type: "string" },
            time: { type: "string" },
            tip: { type: "string" },
          },
          required: ["step", "instruction"],
        },
      },
      tips: { type: "array", items: { type: "string" } },
      substitutions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            original: { type: "string" },
            alternative: { type: "string" },
            reason: { type: "string" },
          },
          required: ["original", "alternative", "reason"],
        },
      },
      nutrition: {
        type: "object",
        properties: {
          calories: { type: "string" },
          protein: { type: "string" },
          notes: { type: "string" },
        },
        required: ["calories", "protein", "notes"],
      },
      modifications: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: { type: "string" },
            original: { type: "string" },
            replacement: { type: "string" },
            reason: { type: "string" },
            impactOnRecipe: { type: "string" },
          },
          required: ["type", "original", "replacement", "reason", "impactOnRecipe"],
        },
      },
      modificationNotes: { type: "string" },
    },
    required: ["recipeName", "servings", "prepTime", "cookTime", "totalTime", "difficulty", "ingredients", "instructions", "tips", "substitutions", "nutrition", "modifications", "modificationNotes"],
  },
};

// Tool for reroll meal
const rerollMealTool: Anthropic.Tool = {
  name: "submit_rerolled_meal",
  description: "Submit the new replacement meal and updated shopping categories",
  input_schema: {
    type: "object" as const,
    properties: {
      meal: {
        type: "object",
        description: "The new replacement meal",
        properties: {
          day: { type: "string", description: "Day of the week (e.g., Monday)" },
          meal: { type: "string", description: "Name of the meal" },
          cookTime: { type: "string", description: "Cooking time (e.g., 30 minutes)" },
          difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
          description: { type: "string", description: "Brief appetizing description" },
          mainIngredients: {
            type: "array",
            items: { type: "string" },
            description: "List of main ingredients",
          },
          cuisineType: { type: "string", description: "Type of cuisine (e.g., Italian, Mexican)" },
          tags: {
            type: "array",
            items: { type: "string" },
            description: "Tags like quick, healthy, comfort food",
          },
        },
        required: ["day", "meal", "cookTime", "difficulty", "description", "mainIngredients", "cuisineType"],
      },
      shoppingCategories: {
        type: "object",
        description: "All ingredients from all meals categorized for shopping",
        properties: {
          proteins: { type: "array", items: { type: "string" } },
          produce: { type: "array", items: { type: "string" } },
          pantry: { type: "array", items: { type: "string" } },
          dairy: { type: "array", items: { type: "string" } },
        },
        required: ["proteins", "produce", "pantry", "dairy"],
      },
    },
    required: ["meal", "shoppingCategories"],
  },
};

export async function rerollMeal(
  context: RerollMealContext,
  sessionId: string = "default"
): Promise<RerolledMealResponse> {
  // Build the prompt (reuse existing prompt logic)
  const prompt = rerollMealPrompt(context);

  // Use tool_choice to force Claude to use our structured output tool
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    temperature: 1.0,
    tools: [rerollMealTool],
    tool_choice: { type: "tool", name: "submit_rerolled_meal" },
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // Extract the tool use response
  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUse || toolUse.name !== "submit_rerolled_meal") {
    console.error("No tool use in response:", JSON.stringify(response.content, null, 2));
    throw new Error("Failed to get structured response from Claude");
  }

  const result = toolUse.input as {
    meal: MealPlanDay;
    shoppingCategories: ShoppingCategories;
  };

  return {
    message: `Generated new meal: ${result.meal.meal}`,
    data: result.meal,
    shoppingCategories: result.shoppingCategories,
  };
}

// Re-export types for convenience
export type {
  UserPreferences,
  RecipeSuggestion,
  FullRecipe,
  WeeklyMealPlan,
  ShoppingList,
  MealPlanDay,
  RerollMealContext,
  ShoppingCategories,
};
