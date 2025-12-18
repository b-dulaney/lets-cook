```typescript
const generateRecipePrompt = (ingredients, userPreferences) => {
  return `You are a helpful cooking assistant. A user has these ingredients: ${ingredients.join(
    ", "
  )}.

User preferences:
- Dietary restrictions: ${userPreferences.dietary || "none"}
- Skill level: ${userPreferences.skillLevel || "any"}
- Cuisine preferences: ${userPreferences.cuisines?.join(", ") || "any"}

Generate 3 recipe suggestions that:
1. Primarily use the provided ingredients
2. Are practical and achievable
3. Include variety (different cuisines/styles)
4. Respect dietary restrictions

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
};
```

Example Usage

```typescript
// User says: "I have chicken, broccoli, and rice"
const prompt = generateRecipePrompt(
  ['chicken', 'broccoli', 'rice'],
  {
    dietary: 'none',
    skillLevel: 'beginner',
    cuisines: ['Asian', 'American']
  }
);

// Claude returns:
{
  "recipes": [
    {
      "name": "Chicken and Broccoli Stir Fry",
      "description": "Quick weeknight stir fry with tender chicken and crisp broccoli",
      "cookTime": "25 minutes",
      "difficulty": "Easy",
      "usesIngredients": ["chicken", "broccoli", "rice"],
      "additionalIngredients": ["soy sauce", "garlic", "ginger"],
      "cuisineType": "Asian"
    },
    {
      "name": "One-Pan Chicken and Rice",
      "description": "Comforting baked dish with juicy chicken and fluffy rice",
      "cookTime": "45 minutes",
      "difficulty": "Easy",
      "usesIngredients": ["chicken", "broccoli", "rice"],
      "additionalIngredients": ["chicken broth", "onion"],
      "cuisineType": "American"
    },
    {
      "name": "Chicken Fried Rice",
      "description": "Restaurant-style fried rice with vegetables",
      "cookTime": "20 minutes",
      "difficulty": "Easy",
      "usesIngredients": ["chicken", "broccoli", "rice"],
      "additionalIngredients": ["eggs", "soy sauce", "sesame oil"],
      "cuisineType": "Asian"
    }
  ]
}
```

2. Full Recipe Details
   Intent: recipe.get_details
   Claude Prompt Template:
   javascriptconst getRecipeDetailsPrompt = (recipeName, ingredients, userSkillLevel) => {
   return `Generate a complete, detailed recipe for: ${recipeName}

Primary ingredients to use: ${ingredients.join(', ')}
User skill level: ${userSkillLevel || 'intermediate'}

Provide a comprehensive recipe with:

1. Full ingredient list with precise measurements
2. Step-by-step instructions (numbered, clear, concise)
3. Prep time and cook time
4. Servings
5. Pro tips (2-3 helpful hints)
6. Substitution suggestions (if applicable)

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
};
Example Usage:
javascript// User selects "Chicken and Broccoli Stir Fry"
const prompt = getRecipeDetailsPrompt(
'Chicken and Broccoli Stir Fry',
['chicken', 'broccoli', 'rice'],
'beginner'
);

// Claude returns full recipe with step-by-step instructions

3. Weekly Meal Planning
   Intent: meal_plan.create_weekly
   Claude Prompt Template:
   javascriptconst generateWeeklyMealPlanPrompt = (userPreferences, numberOfMeals = 7) => {
   return `Create a ${numberOfMeals}-day meal plan for dinner.

User preferences:

- Dietary restrictions: ${userPreferences.dietary || 'none'}
- Dislikes: ${userPreferences.dislikes?.join(', ') || 'none'}
- Favorite cuisines: ${userPreferences.cuisines?.join(', ') || 'varied'}
- Skill level: ${userPreferences.skillLevel || 'intermediate'}
- Cooking time preference: ${userPreferences.maxCookTime || '45 minutes max'}
- Budget: ${userPreferences.budget || 'moderate'}

Requirements:

1. Variety - different proteins, cuisines, and cooking methods
2. Balance - include vegetables, proteins, and carbs
3. Practical - use common ingredients, minimize waste
4. Progressive complexity - mix of quick/easy and more involved meals
5. Ingredient overlap - some ingredients used across multiple meals to reduce waste

Generate a weekly meal plan with:

- Balanced nutrition across the week
- Strategic ingredient reuse (e.g., if buying chicken, use it 2-3 times in different ways)
- Mix of cuisines and flavors
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
};
Example Usage:
javascriptconst prompt = generateWeeklyMealPlanPrompt({
dietary: 'none',
dislikes: ['mushrooms', 'seafood'],
cuisines: ['Italian', 'Mexican', 'Asian'],
skillLevel: 'beginner',
maxCookTime: '45 minutes',
budget: 'moderate'
});

// Claude returns 7-day meal plan with strategic ingredient usage

4. Shopping List Generation
   Intent: shopping.generate_list
   Claude Prompt Template:
   javascriptconst generateShoppingListPrompt = (mealPlan, pantryItems = []) => {
   return `Generate a comprehensive shopping list for this meal plan:

${JSON.stringify(mealPlan, null, 2)}

Items already in pantry: ${pantryItems.join(', ') || 'none specified'}

Create a shopping list that:

1. Consolidates duplicate ingredients across meals
2. Provides specific quantities needed
3. Organizes by store section for efficient shopping
4. Indicates which meals use each ingredient
5. Excludes pantry items already owned
6. Notes optional/substitutable items

Store sections: Produce, Meat/Seafood, Dairy, Pantry/Dry Goods, Frozen, Bakery, Condiments/Sauces

Format as JSON:
{
"shoppingList": {
"Produce": [
{
"item": "broccoli",
"quantity": "2 heads",
"usedIn": ["Monday: Stir Fry", "Wednesday: Pasta"],
"priority": "essential"
}
],
"Meat": [
{
"item": "chicken breast",
"quantity": "2 lbs",
"usedIn": ["Monday: Stir Fry", "Thursday: Chicken Tacos"],
"priority": "essential",
"notes": "Can buy in bulk and freeze half"
}
]
},
"estimatedTotal": "$65-75",
"optionalItems": [
{
"item": "fresh herbs",
"reason": "Enhances flavor but dried herbs work too"
}
],
"moneySavingTips": [
"Buy whole chicken and break it down yourself to save $5-10",
"Use frozen vegetables for stir fry - just as nutritious and cheaper"
]
}

Only return valid JSON, no other text.`;
};

5. Dietary Preference & User Profile
   Intent: preferences.set_dietary
   Claude Prompt Template:
   javascriptconst updateUserPreferencesPrompt = (userInput, currentPreferences) => {
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
};
Example Usage:
javascript// User says: "I'm vegetarian and allergic to nuts. I love Italian food but don't like mushrooms."
const prompt = updateUserPreferencesPrompt(
"I'm vegetarian and allergic to nuts. I love Italian food but don't like mushrooms.",
{} // empty current preferences
);

// Claude extracts structured data and returns profile

6. Recipe Modification/Substitution
   Bonus Intent: recipe.modify
   Claude Prompt Template:
   javascriptconst modifyRecipePrompt = (originalRecipe, modification) => {
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
...recipeFields,
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
};

Conversation Flow Examples with Prompts
Flow 1: Ingredient-Based Discovery
javascript// User: "I have chicken, bell peppers, and onions"

// Step 1: Get recipe suggestions
const suggestionsPrompt = generateRecipePrompt(
['chicken', 'bell peppers', 'onions'],
userProfile
);
// Returns 3 recipes

// User: "Tell me more about the chicken fajitas"

// Step 2: Get full recipe
const detailsPrompt = getRecipeDetailsPrompt(
'Chicken Fajitas',
['chicken', 'bell peppers', 'onions'],
userProfile.skillLevel
);
// Returns complete recipe with steps

// User: "Can you make it spicier?"

// Step 3: Modify recipe
const modifiedPrompt = modifyRecipePrompt(
currentRecipe,
"make it spicier"
);
// Returns modified version with extra peppers/spices
Flow 2: Weekly Planning
javascript// User: "Plan my meals for the week"

// Step 1: Generate meal plan
const mealPlanPrompt = generateWeeklyMealPlanPrompt(userProfile);
// Returns 7-day plan

// User: "Make me a shopping list"

// Step 2: Generate shopping list
const shoppingPrompt = generateShoppingListPrompt(
mealPlan,
userProfile.pantryItems
);
// Returns organized shopping list

// User: "I don't like Tuesday's meal, give me something else"

// Step 3: Regenerate single day
const replacementPrompt = `Replace Tuesday's meal in this meal plan:
${JSON.stringify(mealPlan)}

Requirements:

- Different from other meals this week
- Uses similar ingredients to minimize shopping list changes
- Fits user preferences: ${JSON.stringify(userProfile)}

Return just the replacement meal in the same JSON format.`;
