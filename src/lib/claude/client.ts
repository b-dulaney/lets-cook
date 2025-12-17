import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type TaskType =
  | "find_recipes"
  | "get_recipe_details"
  | "create_meal_plan"
  | "generate_shopping_list"
  | "start_cooking_mode"
  | "general_query";

interface AskClaudeParams {
  task: TaskType;
  context: Record<string, unknown>;
  sessionId: string;
}

interface ClaudeResponse {
  message: string;
  data?: Record<string, unknown>;
}

const SYSTEM_PROMPT = `You are a helpful meal planning assistant. You help users find recipes, plan meals, and create shopping lists.

When responding, always provide:
1. A conversational response for voice output
2. Structured data when applicable (recipes, meal plans, shopping lists)

Format your responses as JSON with this structure:
{
  "message": "The conversational response to speak to the user",
  "data": { /* structured data if applicable */ }
}

Keep voice responses concise and natural for Google Assistant. Avoid lists in spoken responses - summarize instead.`;

const TASK_PROMPTS: Record<TaskType, string> = {
  find_recipes: `Find recipes that can be made with the given ingredients. Return up to 3 recipe suggestions with brief descriptions.`,
  get_recipe_details: `Provide detailed information about the requested recipe including ingredients, cook time, and a brief overview of steps.`,
  create_meal_plan: `Create a meal plan for the specified number of days, considering any dietary preferences mentioned.`,
  generate_shopping_list: `Generate a consolidated shopping list based on the current meal plan.`,
  start_cooking_mode: `Provide step-by-step cooking instructions for the recipe. Start with the first step.`,
  general_query: `Answer the user's question about cooking, recipes, or meal planning.`,
};

export async function askClaude({
  task,
  context,
  sessionId,
}: AskClaudeParams): Promise<ClaudeResponse> {
  const taskPrompt = TASK_PROMPTS[task];
  const contextStr = JSON.stringify(context);

  // Use Haiku for speed on simple tasks, Sonnet for complex reasoning
  const model =
    task === "create_meal_plan" || task === "general_query"
      ? "claude-sonnet-4-20250514"
      : "claude-haiku-4-5-20250514";

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `${taskPrompt}\n\nContext: ${contextStr}\nSession: ${sessionId}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Parse JSON response from Claude
    const parsed = JSON.parse(content.text) as ClaudeResponse;
    return parsed;
  } catch (error) {
    console.error("Claude API error:", error);
    return {
      message:
        "I'm having trouble processing that request. Could you try again?",
    };
  }
}
