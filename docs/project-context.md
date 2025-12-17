# Meal Planning AI Assistant - Project Context

## Project Overview

Building a voice-activated meal planning assistant for Google Assistant with smart display support.
Primary user: My girlfriend

## Core Features (MVP)

1. Recipe discovery by ingredients
2. Full recipe details with step-by-step instructions
3. Weekly meal planning
4. Shopping list generation from meal plans
5. Save favorite recipes
6. Dietary preferences management
7. Hands-free cooking mode

## Tech Stack

- **Frontend**: Next.js (React) + Tailwind CSS
- **Deployment**: Vercel
- **Database**: Supabase (PostgreSQL)
- **Voice Interface**:
  - Dialogflow CX for Google Assistant integration
  - Web Speech API for web app
- **AI**:
  - Claude API (Anthropic) - Haiku 4.5 for speed, Sonnet 4.5 for complex reasoning
  - OpenAI Whisper for speech-to-text (if needed)
- **Recipe APIs**: Spoonacular or Edamam (for images/supplementary data)

## Key Architecture Decisions

- Google Assistant as primary interface (Nest Hub displays)
- Dialogflow webhook calls Next.js API routes
- Claude API handles all conversational logic and meal planning
- No localStorage in artifacts (not supported in claude.ai)
- Budget: $20-30/month for AI APIs

## Google Assistant Integration

- Use Dialogflow CX for intent matching
- Visual responses for smart displays (recipe cards, meal plan carousels)
- Account linking for user identification
- Rich responses with images, buttons, suggestions

## Development Priority

Phase 1: Core recipe discovery + meal planning (current)
Phase 2: Google Assistant integration with Dialogflow
Phase 3: Polish UX and add cooking mode

## Important Notes

- User is experienced TypeScript developer
- Prefers concise explanations
- Dialogflow intents are already designed (see below)
- Claude prompts are structured for JSON responses
