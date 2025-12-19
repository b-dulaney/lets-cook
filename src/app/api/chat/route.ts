import { NextRequest, NextResponse } from "next/server";
import { handleIntent } from "@/lib/dialogflow/intent-handler";
import type { DialogflowParameter } from "@/types/dialogflow";

interface ChatRequest {
  message: string;
  sessionId?: string;
}

interface ChatResponse {
  message: string;
  data?: unknown;
  intent?: string;
}

// Simple intent detection for testing
function detectIntent(message: string): {
  intentName: string;
  parameters: Record<string, DialogflowParameter>;
} {
  const lowerMessage = message.toLowerCase();

  // Check for recipe by ingredients
  const ingredientPatterns = [
    /i have (.+)/i,
    /what can i make with (.+)/i,
    /recipes? (?:with|using|for) (.+)/i,
    /cook (?:with|using) (.+)/i,
  ];

  for (const pattern of ingredientPatterns) {
    const match = message.match(pattern);
    if (match) {
      const ingredientStr = match[1];
      const ingredients = ingredientStr
        .split(/,|and/)
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      return {
        intentName: "find.recipe.by.ingredients",
        parameters: {
          ingredients: {
            originalValue: ingredientStr,
            resolvedValue: ingredients,
          },
        },
      };
    }
  }

  // Check for recipe details
  const detailPatterns = [
    /(?:tell me (?:more )?about|how (?:do i|to) make|recipe for|details (?:for|about)) (.+)/i,
    /^make (.+)$/i,
  ];

  for (const pattern of detailPatterns) {
    const match = message.match(pattern);
    if (match) {
      return {
        intentName: "get.recipe.details",
        parameters: {
          recipe_name: {
            originalValue: match[1].trim(),
            resolvedValue: match[1].trim(),
          },
        },
      };
    }
  }

  // Check for meal plan
  if (
    lowerMessage.includes("meal plan") ||
    lowerMessage.includes("plan my meals") ||
    lowerMessage.includes("weekly plan") ||
    lowerMessage.includes("plan for the week")
  ) {
    const daysMatch = message.match(/(\d+)\s*days?/i);
    const days = daysMatch ? parseInt(daysMatch[1], 10) : 7;

    return {
      intentName: "create.meal.plan",
      parameters: {
        days: {
          originalValue: String(days),
          resolvedValue: days,
        },
      },
    };
  }

  // Check for shopping list
  if (
    lowerMessage.includes("shopping list") ||
    lowerMessage.includes("grocery list") ||
    lowerMessage.includes("what do i need to buy")
  ) {
    return {
      intentName: "get.shopping.list",
      parameters: {},
    };
  }

  // Check for cooking mode
  if (
    lowerMessage.includes("start cooking") ||
    lowerMessage.includes("let's cook") ||
    lowerMessage.includes("walk me through") ||
    lowerMessage.includes("guide me")
  ) {
    return {
      intentName: "start.cooking.mode",
      parameters: {},
    };
  }

  // Default fallback - general query
  return {
    intentName: "general_query",
    parameters: {},
  };
}

// In-memory session store for testing
const sessions = new Map<string, Record<string, unknown>>();

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, sessionId = "test-session" } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Detect intent from message
    const { intentName, parameters } = detectIntent(message);

    // Get or create session
    const sessionParameters = sessions.get(sessionId) || {};

    // Handle the intent
    const response = await handleIntent({
      intentName,
      parameters,
      sessionId,
      userQuery: message,
      sessionParameters,
    });

    // Update session with any new parameters
    if (response.sessionInfo?.parameters) {
      sessions.set(sessionId, {
        ...sessionParameters,
        ...response.sessionInfo.parameters,
      });
    }

    // Extract the message text from the response
    const firstMessage = response.fulfillmentResponse.messages[0];
    const responseText =
      "text" in firstMessage ? firstMessage.text.text[0] : "No response";

    // Build simplified response
    const chatResponse: ChatResponse = {
      message: responseText,
      intent: intentName,
    };

    // Include data if present in session
    const updatedSession = sessions.get(sessionId);
    if (updatedSession) {
      const dataKeys = [
        "lastRecipes",
        "currentRecipe",
        "currentMealPlan",
        "currentShoppingList",
      ];
      for (const key of dataKeys) {
        if (updatedSession[key]) {
          chatResponse.data = updatedSession[key];
          break;
        }
      }
    }

    return NextResponse.json(chatResponse);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}

// GET endpoint to check session state
export async function GET(request: NextRequest) {
  const sessionId =
    request.nextUrl.searchParams.get("sessionId") || "test-session";
  const sessionData = sessions.get(sessionId) || {};

  return NextResponse.json({
    sessionId,
    data: sessionData,
  });
}
