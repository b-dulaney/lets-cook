import { NextRequest, NextResponse } from "next/server";
import type { DialogflowRequest, DialogflowResponse } from "@/types/dialogflow";
import { handleIntent } from "@/lib/dialogflow/intent-handler";

export async function POST(request: NextRequest) {
  try {
    const body: DialogflowRequest = await request.json();

    const intentName = body.intentInfo?.displayName || "Default";
    const parameters = body.intentInfo?.parameters || {};
    const sessionId = body.sessionInfo.session;
    const userQuery = body.text || "";

    const response = await handleIntent({
      intentName,
      parameters,
      sessionId,
      userQuery,
      sessionParameters: body.sessionInfo.parameters,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Dialogflow webhook error:", error);

    const errorResponse: DialogflowResponse = {
      fulfillmentResponse: {
        messages: [
          {
            text: {
              text: ["Sorry, something went wrong. Please try again."],
            },
          },
        ],
      },
    };

    return NextResponse.json(errorResponse, { status: 200 });
  }
}
