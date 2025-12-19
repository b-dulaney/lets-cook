// Types for prompt parameters

export interface UserPreferences {
  dietary?: string | string[];
  allergies?: string[];
  dislikes?: string[];
  cuisines?: string[];
  favoriteCuisines?: string[];
  skillLevel?: "beginner" | "intermediate" | "advanced";
  mealComplexity?: "minimal" | "simple" | "standard" | "complex";
  maxCookTime?: string;
  budget?: string;
  householdSize?: number;
  pantryItems?: string[];
  additionalNotes?: string;
  store?: string; // e.g., "trader-joes"
  appliances?: string[]; // e.g., ["air-fryer", "slow-cooker", "instant-pot", "grill"]
}

export interface RecipeSuggestion {
  name: string;
  description: string;
  cookTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  usesIngredients: string[];
  additionalIngredients: string[];
  cuisineType: string;
}

export interface RecipeIngredient {
  item: string;
  amount: string;
  notes?: string;
}

export interface RecipeInstruction {
  step: number;
  instruction: string;
  time?: string;
  tip?: string;
}

export interface RecipeSubstitution {
  original: string;
  alternative: string;
  reason: string;
}

// Supported Spoonacular cuisines for image search
export type CuisineType =
  | "African" | "American" | "British" | "Cajun" | "Caribbean"
  | "Chinese" | "Eastern European" | "French" | "German" | "Greek"
  | "Indian" | "Irish" | "Italian" | "Japanese" | "Jewish"
  | "Korean" | "Latin American" | "Mediterranean" | "Mexican"
  | "Middle Eastern" | "Nordic" | "Southern" | "Spanish" | "Thai" | "Vietnamese";

// Color options for recipe card gradients - based on dish characteristics
export type RecipeCardColor =
  | "red"      // tomato-based, spicy dishes
  | "orange"   // citrus, carrots, sweet potatoes
  | "amber"    // curry, turmeric, golden dishes
  | "yellow"   // lemon, corn, bright dishes
  | "lime"     // fresh, zesty, herb-forward
  | "green"    // salads, vegetables, pesto
  | "emerald"  // herbs, mediterranean
  | "teal"     // seafood, asian-inspired
  | "cyan"     // light seafood, refreshing
  | "sky"      // light, airy dishes
  | "blue"     // blueberries, rare proteins
  | "indigo"   // eggplant, purple cabbage
  | "violet"   // lavender, unique dishes
  | "purple"   // beets, acai, exotic
  | "fuchsia"  // dragon fruit, vibrant
  | "pink"     // salmon, strawberry, light
  | "rose"     // delicate, floral dishes
  | "slate";   // neutral, earthy, mushrooms

export interface FullRecipe {
  recipeName: string;
  servings: number;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  tips: string[];
  substitutions: RecipeSubstitution[];
  nutrition: {
    calories: string;
    protein: string;
    notes: string;
  };
  cuisineType?: CuisineType;
  imageSearchTerms?: string;
  cardColor?: RecipeCardColor; // Color theme for recipe card based on dish characteristics
}

export interface MealPlanDay {
  day: string;
  meal: string;
  cookTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  mainIngredients: string[];
  cuisineType: string;
  tags: string[];
}

export interface WeeklyMealPlan {
  weekPlan: MealPlanDay[];
  shoppingCategories: {
    proteins: string[];
    produce: string[];
    pantry: string[];
    dairy: string[];
  };
  prepTips: string[];
  budgetEstimate: string;
}

export interface ShoppingListItem {
  item: string;
  quantity: string;
  usedIn: string[];
  priority: "essential" | "optional";
  notes?: string;
}

export interface ShoppingList {
  shoppingList: {
    Produce: ShoppingListItem[];
    Meat: ShoppingListItem[];
    Dairy: ShoppingListItem[];
    "Pantry/Dry Goods": ShoppingListItem[];
    Frozen: ShoppingListItem[];
    Bakery: ShoppingListItem[];
    "Condiments/Sauces": ShoppingListItem[];
  };
  estimatedTotal: string;
  optionalItems: { item: string; reason: string }[];
  moneySavingTips: string[];
}

export interface RecipeModification {
  type: string;
  original: string;
  replacement: string;
  reason: string;
  impactOnRecipe: string;
}

// Cooking method labels for prompts
const COOKING_METHOD_PROMPTS: Record<string, string> = {
  "air-fryer": "COOKING METHOD: Air Fryer - All recipes MUST be cooked using an air fryer. Focus on recipes that benefit from air frying: crispy proteins, vegetables, appetizers. Air fryer cooking is fast and uses less oil.",
  "slow-cooker": "COOKING METHOD: Slow Cooker/Crockpot - All recipes MUST be slow cooker recipes. Focus on dishes that benefit from slow cooking: stews, braised meats, soups, chilis, pulled meats. These are hands-off meals that cook for hours.",
  "instant-pot": "COOKING METHOD: Instant Pot/Pressure Cooker - All recipes MUST use a pressure cooker. Focus on dishes that benefit from pressure cooking: beans, tough cuts of meat, risotto, stock-based dishes. These cook quickly under pressure.",
  "grill": "COOKING METHOD: Grill - All recipes MUST be grilled. Focus on proteins and vegetables that are excellent when grilled. Consider marinades and smoky flavors.",
};

// 1. Generate Recipe Suggestions from Ingredients
export function generateRecipePrompt(
  ingredients: string[],
  userPreferences: UserPreferences,
  cookingMethod?: string
): string {
  const dietary = Array.isArray(userPreferences.dietary)
    ? userPreferences.dietary.join(", ")
    : userPreferences.dietary || "none";

  const cookingMethodInstruction = cookingMethod && COOKING_METHOD_PROMPTS[cookingMethod]
    ? `\n${COOKING_METHOD_PROMPTS[cookingMethod]}\n`
    : "";

  return `You are a helpful cooking assistant. A user has these ingredients: ${ingredients.join(
    ", "
  )}.
${cookingMethodInstruction}
User preferences:
- Dietary restrictions: ${dietary}
- Skill level: ${userPreferences.skillLevel || "any"}
- Cuisine preferences: ${userPreferences.cuisines?.join(", ") || "any"}

Generate 3 recipe suggestions that:
1. Primarily use the provided ingredients
2. Are practical and achievable
3. Include variety (different cuisines/styles)
4. Respect dietary restrictions${cookingMethod ? "\n5. MUST use the specified cooking method" : ""}

For each recipe, provide:
- Recipe name
- Brief description (one sentence)
- Cook time
- Difficulty level (Easy/Medium/Hard)
- Main ingredients used from their list
- Key additional ingredients needed (if any, max 3-4 common items)

Format as JSON:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Brief description",
      "cookTime": "30 minutes",
      "difficulty": "Easy",
      "usesIngredients": ["chicken", "rice"],
      "additionalIngredients": ["soy sauce", "garlic"],
      "cuisineType": "Asian"
    }
  ]
}

Only return valid JSON, no other text.`;
}

// Constraints passed from meal plan context
export interface RecipeConstraints {
  cookTime?: string; // e.g., "25 minutes"
  difficulty?: string; // e.g., "Easy", "Medium", "Hard"
  servings?: number; // e.g., 2
}

// 2. Get Full Recipe Details
export function getRecipeDetailsPrompt(
  recipeName: string,
  ingredients: string[],
  userSkillLevel?: string,
  constraints?: RecipeConstraints
): string {
  // Build constraints section if we have any
  let constraintsSection = "";
  if (constraints) {
    const parts: string[] = [];
    if (constraints.servings) {
      parts.push(
        `- Servings: MUST be exactly ${constraints.servings} servings (scale ingredients accordingly)`
      );
    }
    if (constraints.cookTime) {
      parts.push(
        `- Total time: MUST be approximately ${constraints.cookTime} or less`
      );
    }
    if (constraints.difficulty) {
      parts.push(`- Difficulty: ${constraints.difficulty}`);
    }
    if (parts.length > 0) {
      constraintsSection = `
IMPORTANT CONSTRAINTS (from meal plan - you MUST follow these):
${parts.join("\n")}

`;
    }
  }

  return `Generate a complete, detailed recipe for: ${recipeName}

Primary ingredients to use: ${ingredients.join(", ")}
User skill level: ${userSkillLevel || "intermediate"}
${constraintsSection}
Provide a comprehensive recipe with:

1. Full ingredient list with precise measurements
2. Step-by-step instructions (numbered, clear, concise)
3. Prep time and cook time
4. Servings
5. Pro tips (2-3 helpful hints)
6. Substitution suggestions (if applicable)
7. Cuisine type - one of: African, American, British, Cajun, Caribbean, Chinese, Eastern European, French, German, Greek, Indian, Irish, Italian, Japanese, Jewish, Korean, Latin American, Mediterranean, Mexican, Middle Eastern, Nordic, Southern, Spanish, Thai, Vietnamese
8. Image search term - ONE or TWO simple words for the main dish (e.g., "salmon", "pasta", "tacos", "stir fry", "curry"). Use the most basic, common food term.

Tailor the complexity and detail to the user's skill level.
For beginners: more detailed steps, basic techniques explained
For advanced: can be more concise, assume technique knowledge

Format as JSON:
{
  "recipeName": "Recipe Name",
  "servings": 4,
  "prepTime": "10 minutes",
  "cookTime": "25 minutes",
  "totalTime": "35 minutes",
  "difficulty": "Easy",
  "cuisineType": "Italian",
  "imageSearchTerms": "chicken pasta",
  "ingredients": [
    {
      "item": "chicken breast",
      "amount": "1 lb",
      "notes": "cut into bite-sized pieces"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "instruction": "Detailed step here",
      "time": "5 minutes",
      "tip": "Optional tip for this step"
    }
  ],
  "tips": [
    "Pro tip 1",
    "Pro tip 2"
  ],
  "substitutions": [
    {
      "original": "soy sauce",
      "alternative": "tamari or coconut aminos",
      "reason": "gluten-free option"
    }
  ],
  "nutrition": {
    "calories": "approx 350 per serving",
    "protein": "high",
    "notes": "High protein, moderate carbs"
  }
}

Only return valid JSON, no other text.`;
}

// 3. Generate Weekly Meal Plan
export function generateWeeklyMealPlanPrompt(
  userPreferences: UserPreferences,
  numberOfMeals: number = 7,
  recentRecipes: string[] = [],
  slowCookerMeals?: number
): string {
  const dietary = Array.isArray(userPreferences.dietary)
    ? userPreferences.dietary.join(", ")
    : userPreferences.dietary || "none";

  const dislikedFoods = userPreferences.dislikes?.join(", ") || "none";

  // Combine recent recipes with overused patterns for exclusion
  const recipesToAvoid = [...new Set([...recentRecipes])];
  const exclusionSection =
    recipesToAvoid.length > 0
      ? `\nRECIPES TO AVOID (already made recently or overused - suggest something different):
${recipesToAvoid.map((r) => `- ${r}`).join("\n")}
`
      : "";

  // Build complexity instruction based on preference
  const complexityDescriptions: Record<string, string> = {
    minimal: "MINIMAL - MAXIMUM 5 main ingredients per recipe. Only the essentials, no extras.",
    simple: "SIMPLE - MAXIMUM 7 main ingredients per recipe. Keep it approachable and quick.",
    standard: "STANDARD - 8-12 main ingredients allowed. Good balance of simplicity and depth.",
    complex: "COMPLEX - 12+ ingredients welcome. Elaborate, restaurant-quality dishes.",
  };
  const complexityInstruction = userPreferences.mealComplexity
    ? `\n- **RECIPE COMPLEXITY (MUST FOLLOW)**: ${complexityDescriptions[userPreferences.mealComplexity]}`
    : "";

  // Build appliance-based cooking instructions
  const applianceInstructions: string[] = [];
  const appliances = userPreferences.appliances || [];

  if (appliances.includes("air-fryer")) {
    applianceInstructions.push(
      "- **AIR FRYER**: User has an air fryer. Suggest air fryer cooking methods where appropriate for crispy textures (proteins, vegetables, appetizers). Air fryer recipes are faster and use less oil."
    );
  }

  if (appliances.includes("slow-cooker") && slowCookerMeals && slowCookerMeals > 0) {
    applianceInstructions.push(
      `- **SLOW COOKER**: Include exactly ${slowCookerMeals} slow cooker/crockpot meal(s) this week. These are ideal for busy weekdays - set in the morning, ready by dinner. Great for stews, braised meats, soups, and chilis. Mark these clearly with "Slow Cooker" in the meal name or description.`
    );
  }

  if (appliances.includes("instant-pot")) {
    applianceInstructions.push(
      "- **INSTANT POT**: User has an Instant Pot. Consider pressure cooker recipes for dishes that would normally take hours (beans, tough meats, risotto, stock-based dishes). These can be ready in 30-45 minutes instead of hours."
    );
  }

  if (appliances.includes("grill")) {
    applianceInstructions.push(
      "- **GRILL**: User has a grill. Include grilled recipes for proteins and vegetables when appropriate. Great for quick weeknight meals and adds smoky flavor."
    );
  }

  const applianceSection = applianceInstructions.length > 0
    ? `\nKITCHEN APPLIANCES (incorporate these cooking methods):\n${applianceInstructions.join("\n")}\n`
    : "";

  // Store-specific instructions
  const storeInstructions: Record<string, string> = {
    "trader-joes": `
**TRADER JOE'S MEAL PLAN**
Create recipes that specifically feature Trader Joe's signature products and ingredients. This is a Trader Joe's-focused meal plan - embrace their unique offerings!

TRADER JOE'S SIGNATURE ITEMS TO INCORPORATE:
- Frozen: Mandarin Orange Chicken, Cauliflower Gnocchi, Chicken Tikka Masala, Korean Beef Short Ribs, Hashbrowns, Riced Cauliflower, Gyoza/Potstickers, Butter Chicken, Palak Paneer, Kung Pao Chicken, Beef Bulgogi, Tempura Shrimp, Chicken Shawarma
- Sauces & Seasonings: Everything But The Bagel Seasoning, Green Dragon Hot Sauce, Chili Onion Crunch, Ajika Georgian Seasoning, Bomba Sauce, Sriracha Ranch, Cowboy Caviar Salsa, Chimichurri, Romesco Sauce, Thai Yellow Curry Sauce, Tikka Masala Sauce, Soyaki Sauce
- Pasta & Grains: Lemon Pepper Pappardelle, Cacio e Pepe Pasta, Truffle Pasta, Gnocchi alla Sorrentina, Harvest Grains Blend
- Proteins: Unexpected Cheddar, Toscano Cheese, Halloumi, Shawarma Chicken Thighs, Chile Lime Chicken Burgers, Italian Chicken Sausages, Smoked Salmon
- Produce & Prepared: Cruciferous Crunch, Power Greens, Shredded Cabbage, Fresh Bruschetta, Cowboy Caviar, Elote Corn Chip Dip
- Snacks that work in meals: Elote Seasoned Tortilla Chips (crushed as topping), Everything But The Bagel Seasoned Crackers

RECIPE STYLE FOR TRADER JOE'S:
- Feature 1-2 TJ's signature items per meal
- Combine TJ's prepared items with fresh ingredients for quick but impressive meals
- Use TJ's unique seasonings and sauces to add distinctive flavors
- Take advantage of their quality frozen options for weeknight convenience
- Pair TJ's proteins with their fresh produce and specialty items

`,
  };

  const storeSection = userPreferences.store ? storeInstructions[userPreferences.store] || "" : "";

  return `Create a ${numberOfMeals}-day meal plan for dinner.
${storeSection}${applianceSection}
User preferences:
- Dietary restrictions: ${dietary}
- Allergies: ${userPreferences.allergies?.join(", ") || "none"}
- FOODS TO AVOID (user dislikes these - NEVER include): ${dislikedFoods}
- Favorite cuisines: ${
    userPreferences.favoriteCuisines?.join(", ") ||
    userPreferences.cuisines?.join(", ") ||
    "varied"
  }
- Skill level: ${userPreferences.skillLevel || "intermediate"}
- Cooking time preference: ${userPreferences.maxCookTime || "45 minutes max"}
- Budget: ${userPreferences.budget || "moderate"}
- Household size: ${userPreferences.householdSize || "2-4 people"}${complexityInstruction}
${exclusionSection}
CRITICAL REQUIREMENTS:
1. NEVER suggest recipes containing foods from the "FOODS TO AVOID" list - not as main ingredients, side ingredients, garnishes, or in sauces. If the user dislikes mushrooms, do not include ANY mushroom variety in ANY meal.
2. Respect all dietary restrictions and allergies strictly.
3. MAXIMIZE VARIETY: Each meal MUST be distinctly different. Even with dietary restrictions, explore the full range of global cuisines and cooking techniques available. Never repeat similar dishes (e.g., don't have multiple stir-fries, multiple pasta dishes, or multiple curries in the same week).
4. DO NOT suggest any recipes from the "RECIPES TO AVOID" list or close variations of them. Be creative and explore less common dishes.
5. STRICTLY FOLLOW the recipe complexity preference. If set to "minimal" or "simple", each recipe MUST use only 5-7 main ingredients maximum. Do NOT add extra ingredients. Count the mainIngredients array - it must not exceed the complexity limit.

VARIETY GUIDELINES (especially important for restrictive diets):
- Use at least 4-5 different cuisines across the week (e.g., Italian, Mexican, Indian, Thai, Mediterranean, Japanese, Middle Eastern, American, Ethiopian, Greek, Korean, Vietnamese, Moroccan, Caribbean, Peruvian)
- Vary cooking methods: baking, sautéing, grilling, roasting, simmering, raw/salads, braising, steaming
- Vary protein sources: legumes, tofu, tempeh, eggs, dairy, nuts, seitan (if not wheat-allergic), different beans, edamame, paneer
- Vary carb bases: rice, potatoes, quinoa, corn tortillas, rice noodles, polenta, couscous, farro, bread (adjust for allergies)
- Each meal should have a unique flavor profile - don't repeat similar spice combinations
- Explore lesser-known dishes: Korean bibimbap, Moroccan tagine, Ethiopian injera dishes, Japanese okonomiyaki, Vietnamese banh mi, Peruvian causa, Greek spanakopita, Lebanese mujadara, etc.

Additional requirements:
1. Balance - include vegetables, proteins, and carbs in each meal
2. Practical - use common ingredients, minimize waste
3. Progressive complexity - mix of quick/easy and more involved meals
4. Some ingredient overlap for efficiency, but NOT at the cost of variety

Generate a weekly meal plan with:
- Distinctly different meals each day - no two meals should feel similar
- Global cuisine exploration within dietary constraints
- One "leftover-friendly" meal that can provide lunch
- One quick meal (under 30 min) for busy nights
- Weekend meal can be more involved/special

Format as JSON:
{
  "weekPlan": [
    {
      "day": "Monday",
      "meal": "Chicken Stir Fry",
      "cookTime": "25 minutes",
      "difficulty": "Easy",
      "description": "Quick weeknight dinner",
      "mainIngredients": ["chicken", "vegetables", "rice"],
      "cuisineType": "Asian",
      "tags": ["quick", "healthy"]
    }
  ],
  "shoppingCategories": {
    "proteins": ["chicken breast 2 lbs", "ground beef 1 lb"],
    "produce": ["broccoli", "bell peppers", "onions"],
    "pantry": ["rice", "pasta", "soy sauce"],
    "dairy": ["cheese", "milk"]
  },
  "prepTips": [
    "Marinate Monday's chicken on Sunday night",
    "Chop all vegetables on Sunday for the week"
  ],
  "budgetEstimate": "$60-80 for the week"
}

Only return valid JSON, no other text.`;
}

// 4. Generate Shopping List from Meal Plan
export function generateShoppingListPrompt(
  mealPlan: WeeklyMealPlan | MealPlanDay[],
  pantryItems: string[] = []
): string {
  // Extract just the meals data to keep prompt focused
  const meals = Array.isArray(mealPlan) ? mealPlan : mealPlan.weekPlan;

  // Format meals concisely
  const mealsFormatted = meals.map(meal => ({
    day: meal.day,
    meal: meal.meal,
    ingredients: meal.mainIngredients,
  }));

  return `Generate a shopping list for these meals:

${JSON.stringify(mealsFormatted, null, 2)}

Pantry items to exclude: ${pantryItems.length > 0 ? pantryItems.join(", ") : "none"}

Create a consolidated shopping list organized by store section. For each item include:
- item: ingredient name
- quantity: specific amount needed (e.g., "2 lbs", "1 bunch")
- usedIn: array of which meals use it (e.g., ["Monday: Sea Bass", "Thursday: Causa"])
- priority: "essential" or "optional"
- notes: optional tips (e.g., "can substitute with...")

Use the submit_shopping_list tool with these exact category keys:
- Produce (vegetables, fruits, fresh herbs)
- Meat (all proteins including seafood)
- Dairy (milk, cheese, butter, eggs, yogurt)
- Pantry/Dry Goods (rice, pasta, spices, oils, canned goods)
- Frozen (frozen items)
- Bakery (bread, tortillas)
- Condiments/Sauces (sauces, vinegars, dressings)

Include all 7 categories. Use empty arrays [] for categories with no items.`;
}

// 5. Update User Preferences from Natural Language
export function updateUserPreferencesPrompt(
  userInput: string,
  currentPreferences: UserPreferences
): string {
  return `A user has stated their dietary preferences or restrictions. Extract and structure this information.

User said: "${userInput}"

Current preferences: ${JSON.stringify(currentPreferences, null, 2)}

Extract:
1. Dietary restrictions (vegetarian, vegan, gluten-free, dairy-free, etc.)
2. Allergies (specific ingredients to avoid)
3. Dislikes (foods they don't enjoy)
4. Cuisine preferences (favorite types of food)
5. Skill level indicators (mentions of being beginner/experienced)
6. Time constraints (how long they want to spend cooking)

Update the existing preferences with new information. If something contradicts existing preferences, use the new information.

Format as JSON:
{
  "dietary": ["vegetarian"],
  "allergies": ["tree nuts"],
  "dislikes": ["mushrooms", "olives"],
  "favoriteCuisines": ["Italian", "Mexican"],
  "skillLevel": "beginner",
  "maxCookTime": "30 minutes",
  "householdSize": 2,
  "additionalNotes": "Prefers one-pot meals"
}

Only return valid JSON, no other text.`;
}

// 6. Modify/Substitute Recipe
export function modifyRecipePrompt(
  originalRecipe: FullRecipe,
  modification: string
): string {
  return `Modify this recipe based on the user's request.

Original recipe: ${JSON.stringify(originalRecipe, null, 2)}

User request: "${modification}"

Common modifications:
- Make it vegetarian/vegan
- Make it gluten-free
- Make it faster/easier
- Substitute an ingredient
- Scale servings up/down
- Reduce calories/make healthier
- Make it spicier/milder

Provide the modified recipe with:
1. Updated ingredient list with substitutions clearly marked
2. Modified instructions (if cooking method changes)
3. Explanation of what changed and why
4. Any tips for making the substitution work well

Format as JSON with the same structure as original recipe, plus:
{
  "recipeName": "Modified Recipe Name",
  "servings": 4,
  "prepTime": "10 minutes",
  "cookTime": "25 minutes",
  "totalTime": "35 minutes",
  "difficulty": "Easy",
  "ingredients": [...],
  "instructions": [...],
  "tips": [...],
  "substitutions": [...],
  "nutrition": {...},
  "modifications": [
    {
      "type": "ingredient substitution",
      "original": "chicken breast",
      "replacement": "tofu",
      "reason": "vegetarian request",
      "impactOnRecipe": "Reduce cooking time by 5 minutes"
    }
  ],
  "modificationNotes": "This vegetarian version maintains the same flavor profile using..."
}

Only return valid JSON, no other text.`;
}

// 7. Re-roll a Single Meal in a Meal Plan
export interface ShoppingCategories {
  proteins: string[];
  produce: string[];
  pantry: string[];
  dairy: string[];
}

export interface RerollMealContext {
  dayIndex: number;
  currentMeal: MealPlanDay;
  otherMeals: MealPlanDay[];
  userPreferences: UserPreferences;
}

export function rerollMealPrompt(context: RerollMealContext): string {
  const { currentMeal, otherMeals, userPreferences } = context;

  const dietary = Array.isArray(userPreferences.dietary)
    ? userPreferences.dietary.join(", ")
    : userPreferences.dietary || "none";

  const dislikedFoods = userPreferences.dislikes?.join(", ") || "none";
  const otherMealNames = otherMeals.map((m) => m.meal).join(", ");
  const otherCuisines = [
    ...new Set(otherMeals.map((m) => m.cuisineType).filter(Boolean)),
  ].join(", ");

  // Collect all ingredients from other meals for shopping categories
  const otherMealsIngredients = otherMeals
    .flatMap((m) => m.mainIngredients || [])
    .filter(Boolean);

  return `Generate a SINGLE replacement meal to substitute for "${
    currentMeal.meal
  }" in a weekly meal plan.

Current meal being replaced:
- Name: ${currentMeal.meal}
- Cuisine: ${currentMeal.cuisineType || "unspecified"}
- Day: ${currentMeal.day}

Other meals already in this week's plan (DO NOT duplicate these or suggest similar dishes):
${otherMealNames}

Cuisines already used this week: ${otherCuisines}

Ingredients from other meals in this plan (for shopping categories):
${otherMealsIngredients.join(", ")}

User preferences:
- Dietary restrictions: ${dietary}
- Allergies: ${userPreferences.allergies?.join(", ") || "none"}
- FOODS TO AVOID (NEVER include): ${dislikedFoods}
- Favorite cuisines: ${
    userPreferences.favoriteCuisines?.join(", ") ||
    userPreferences.cuisines?.join(", ") ||
    "varied"
  }
- Skill level: ${userPreferences.skillLevel || "intermediate"}
- Cooking time preference: ${userPreferences.maxCookTime || "45 minutes max"}

REQUIREMENTS:
1. Generate a COMPLETELY DIFFERENT meal - different cuisine, different cooking style, different primary ingredients
2. NEVER suggest something similar to the meal being replaced or any other meal in the plan
3. Respect all dietary restrictions, allergies, and dislikes strictly
4. Try a cuisine NOT already heavily represented in the plan
5. The replacement should fit the same day/position in the weekly plan
6. Update the shopping categories to include all ingredients from all meals (the new one plus the existing ones)

Format as JSON with the new meal AND updated shopping categories:
{
  "meal": {
    "day": "${currentMeal.day}",
    "meal": "New Recipe Name",
    "cookTime": "30 minutes",
    "difficulty": "Easy",
    "description": "Brief appetizing description",
    "mainIngredients": ["ingredient1", "ingredient2", "ingredient3"],
    "cuisineType": "Cuisine Type",
    "tags": ["tag1", "tag2"]
  },
  "shoppingCategories": {
    "proteins": ["chicken breast", "eggs"],
    "produce": ["broccoli", "onions", "garlic"],
    "pantry": ["rice", "olive oil", "soy sauce"],
    "dairy": ["cheese", "butter"]
  }
}

The shoppingCategories should include ALL ingredients from ALL meals (the new meal + the existing meals listed above).

Only return valid JSON, no other text.`;
}
