// Dialogflow CX webhook request/response types

export interface DialogflowRequest {
  detectIntentResponseId: string;
  intentInfo?: {
    lastMatchedIntent: string;
    displayName: string;
    confidence: number;
    parameters?: Record<string, DialogflowParameter>;
  };
  pageInfo?: {
    currentPage: string;
    displayName: string;
  };
  sessionInfo: {
    session: string;
    parameters?: Record<string, unknown>;
  };
  fulfillmentInfo?: {
    tag: string;
  };
  text?: string;
  languageCode: string;
}

export interface DialogflowParameter {
  originalValue: string;
  resolvedValue: unknown;
}

export interface DialogflowResponse {
  fulfillmentResponse: {
    messages: DialogflowMessage[];
  };
  sessionInfo?: {
    parameters?: Record<string, unknown>;
  };
}

export type DialogflowMessage =
  | { text: { text: string[] } }
  | { payload: GoogleAssistantPayload };

export interface GoogleAssistantPayload {
  google?: {
    expectUserResponse: boolean;
    richResponse?: {
      items: RichResponseItem[];
      suggestions?: Array<{ title: string }>;
    };
  };
}

export type RichResponseItem =
  | { simpleResponse: { textToSpeech: string; displayText?: string } }
  | { basicCard: BasicCard }
  | { carouselBrowse: { items: CarouselItem[] } };

export interface BasicCard {
  title: string;
  subtitle?: string;
  formattedText?: string;
  image?: {
    url: string;
    accessibilityText: string;
  };
  buttons?: Array<{
    title: string;
    openUrlAction: { url: string };
  }>;
}

export interface CarouselItem {
  title: string;
  description?: string;
  image?: {
    url: string;
    accessibilityText: string;
  };
  openUrlAction?: { url: string };
}
