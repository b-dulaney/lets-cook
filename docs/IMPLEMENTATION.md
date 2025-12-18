# Implementation Checklist

High-level progress tracker for the Meal Planning AI Assistant project.

**Last Updated:** 2024-12-17

---

## Phase 1: Foundation & Core Logic

### Project Setup
- [x] Initialize Next.js project with TypeScript
- [x] Configure Tailwind CSS
- [x] Set up ESLint
- [x] Create project documentation structure (`docs/`)
- [x] Configure environment variables (`.env.example`, `.env.local`)

### Database (Supabase)
- [x] Design database schema (`docs/specs/database-schema.md`)
- [x] Create initial migration (`supabase/migrations/`)
- [x] Set up RLS policies
- [x] Create Supabase client helpers (`src/lib/supabase/`)
- [ ] Apply migrations to Supabase project
- [ ] Test database operations

### Claude AI Integration
- [x] Set up Anthropic SDK client (`src/lib/claude/client.ts`)
- [x] Design prompt templates (`docs/specs/claude-prompts.md`)
- [x] Implement all prompt generators (`src/lib/claude/prompts.ts`)
  - [x] `generateRecipePrompt` - Recipe suggestions from ingredients
  - [x] `getRecipeDetailsPrompt` - Full recipe with steps
  - [x] `generateWeeklyMealPlanPrompt` - Weekly meal planning
  - [x] `generateShoppingListPrompt` - Shopping list from meal plan
  - [x] `updateUserPreferencesPrompt` - Extract preferences from text
  - [x] `modifyRecipePrompt` - Recipe modifications/substitutions
- [x] Integrate prompts into Claude client
- [x] Add typed context interfaces for each task
- [x] Add typed response interfaces
- [x] Add convenience functions (`findRecipes`, `createMealPlan`, etc.)
- [x] Handle markdown code block stripping in JSON responses
- [x] Model selection (Haiku for speed, Sonnet for complex tasks)

### API Routes
- [x] Create Dialogflow webhook route (`/api/dialogflow`)
- [x] Create test chat endpoint (`/api/chat`)
- [x] Implement intent handler (`src/lib/dialogflow/intent-handler.ts`)
  - [x] `find.recipe.by.ingredients`
  - [x] `get.recipe.details`
  - [x] `create.meal.plan`
  - [x] `get.shopping.list`
  - [x] `start.cooking.mode`
  - [x] `save.favorite.recipe` (stub)
  - [x] Default fallback (general query)
- [x] Simple intent detection for testing
- [x] In-memory session storage for testing

### Type Definitions
- [x] Dialogflow request/response types (`src/types/dialogflow.ts`)
- [x] Database types (`src/types/database.ts`)
- [x] Recipe and meal plan types (in `prompts.ts`)

---

## Phase 2: Data Persistence & User Management

### User Authentication
- [ ] Set up Supabase Auth
- [ ] Create auth context/provider
- [ ] Implement sign-in flow
- [ ] Implement sign-out flow
- [ ] Protected API routes

### User Preferences
- [ ] Create preferences API route
- [ ] Save preferences to database
- [ ] Load preferences on session start
- [ ] Update preferences from natural language

### Recipe Storage
- [ ] Save generated recipes to database
- [ ] Implement favorites functionality
- [ ] Load user's saved recipes
- [ ] Recipe search/filtering

### Meal Plan Persistence
- [ ] Save meal plans to database
- [ ] Load existing meal plans
- [ ] Update/modify meal plans
- [ ] Historical meal plan access

### Shopping Lists
- [ ] Save shopping lists to database
- [ ] Mark items as purchased
- [ ] Shopping list history

---

## Phase 3: Google Assistant Integration

### Dialogflow CX Setup
- [x] Design intent structure (`docs/specs/dialogflow-intents.md`)
- [ ] Create Dialogflow CX agent
- [ ] Configure intents and training phrases
- [ ] Set up webhook fulfillment
- [ ] Configure entity types (ingredients, recipe names, etc.)

### Google Assistant Actions
- [ ] Create Actions on Google project
- [ ] Link Dialogflow agent
- [ ] Configure invocation phrases
- [ ] Set up account linking (Google Sign-In)
- [ ] Test on Google Assistant simulator

### Rich Responses
- [ ] Recipe card responses for displays
- [ ] Meal plan carousel for smart displays
- [ ] Shopping list with checkboxes
- [ ] Suggestion chips for follow-up actions

---

## Phase 4: Web Application UI

### Layout & Navigation
- [ ] Create app layout with navigation
- [ ] Responsive design for mobile/desktop
- [ ] Loading states and skeletons

### Pages
- [ ] Home/landing page
- [ ] Recipe discovery page
- [ ] Recipe detail page
- [ ] Meal planning page
- [ ] Shopping list page
- [ ] User preferences/settings page
- [ ] Saved recipes page

### Components
- [ ] Recipe card component
- [ ] Ingredient list component
- [ ] Step-by-step instructions component
- [ ] Meal plan calendar view
- [ ] Shopping list with checkboxes
- [ ] Voice input button (Web Speech API)

### Chat Interface (Optional)
- [ ] Chat UI for text-based interaction
- [ ] Message history display
- [ ] Typing indicators

---

## Phase 5: Cooking Mode

### Hands-Free Experience
- [ ] Step-by-step navigation (next/previous/repeat)
- [ ] Timer integration
- [ ] Voice commands during cooking
- [ ] Large, readable text for kitchen viewing

### Web Speech API
- [ ] Speech recognition setup
- [ ] Text-to-speech for reading instructions
- [ ] Wake word or push-to-talk

---

## Phase 6: External APIs & Enhancements

### Spoonacular/Edamam Integration
- [ ] Set up API client
- [ ] Fetch recipe images
- [ ] Supplement recipe data
- [ ] Ingredient autocomplete

### Recipe Images
- [ ] Display images in recipe cards
- [ ] Image placeholders/fallbacks
- [ ] Image optimization

---

## Phase 7: Testing & Quality

### Unit Tests
- [ ] Prompt generation tests
- [ ] Intent detection tests
- [ ] API route tests

### Integration Tests
- [ ] Full conversation flow tests
- [ ] Database operation tests
- [ ] Authentication flow tests

### End-to-End Tests
- [ ] Web app user journeys
- [ ] Google Assistant conversation tests

---

## Phase 8: Deployment & Operations

### Vercel Deployment
- [ ] Configure Vercel project
- [ ] Set environment variables
- [ ] Deploy to production
- [ ] Custom domain setup

### Monitoring
- [ ] Error tracking (Sentry or similar)
- [ ] API usage monitoring
- [ ] Claude API cost tracking

### Documentation
- [x] Project context (`docs/project-context.md`)
- [x] Database schema (`docs/specs/database-schema.md`)
- [x] Claude prompts spec (`docs/specs/claude-prompts.md`)
- [x] Dialogflow intents (`docs/specs/dialogflow-intents.md`)
- [x] Implementation checklist (this document)
- [ ] User guide
- [ ] API documentation

---

## Quick Status Summary

| Area | Status |
|------|--------|
| Project Setup | ✅ Complete |
| Database Schema | ✅ Designed, needs deployment |
| Claude Integration | ✅ Complete |
| API Routes | ✅ Core routes working |
| Intent Handling | ✅ Basic implementation |
| Authentication | ⏳ Not started |
| Data Persistence | ⏳ Not started |
| Google Assistant | ⏳ Intents designed only |
| Web UI | ⏳ Not started |
| Cooking Mode | ⏳ Not started |
| Testing | ⏳ Not started |
| Deployment | ⏳ Not started |

**Current Phase:** Phase 1 (Foundation) ~80% complete

**Next Steps:**
1. Apply database migrations to Supabase
2. Implement user authentication
3. Connect intent handlers to database for persistence
