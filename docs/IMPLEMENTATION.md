# Implementation Checklist

High-level progress tracker for the Meal Planning AI Assistant project.

**Last Updated:** 2025-12-18

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
- [x] Apply migrations to Supabase project
- [x] Test database operations

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
  - [x] `rerollMealPrompt` - Re-roll individual meals in a plan
- [x] Integrate prompts into Claude client
- [x] Add typed context interfaces for each task
- [x] Add typed response interfaces
- [x] Add convenience functions (`findRecipes`, `createMealPlan`, etc.)
- [x] **Tool Use for Structured Outputs** - All API calls use Claude's tool use feature for guaranteed JSON schema compliance
- [x] Task-specific temperature settings (high for creativity, low for precision)
- [x] Model selection (Sonnet for all tasks)

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
- [x] Set up Supabase Auth middleware (`src/middleware.ts`)
- [x] Create auth callback route (`/auth/callback`)
- [x] Create auth context/provider (`src/lib/auth/context.tsx`)
- [x] Implement sign-in flow (Google OAuth + email/password)
- [x] Implement sign-out flow
- [x] Create login page (`/login`)
- [x] Create dashboard page (`/dashboard`)
- [x] Protected route handling in middleware
- [x] Configure Google OAuth in Supabase dashboard
- [x] Test full authentication flow

### User Preferences
- [x] Create preferences API route
- [x] Save preferences to database
- [x] Load preferences on session start
- [ ] Update preferences from natural language
- [x] Settings page UI

### Recipe Storage
- [x] Save generated recipes to database
- [x] Implement favorites functionality
- [x] Load user's saved recipes
- [x] Recipe search/filtering

### Meal Plan Persistence
- [x] Save meal plans to database
- [x] Load existing meal plans
- [x] Update/modify meal plans
- [x] Historical meal plan access
- [x] **Re-roll individual meals** - Replace single meals without regenerating entire plan
- [x] Shopping categories auto-update on re-roll

### Shopping Lists
- [x] Save shopping lists to database
- [x] Mark items as purchased
- [x] Shopping list history
- [x] **Stale list detection** - Track when meal plan changes after list creation
- [x] **Regenerate stale lists** - One-click regeneration with warning banner
- [x] Link shopping lists to meal plans (`meal_plan_id` foreign key)

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
- [x] Create app layout with navigation
- [x] Responsive design for mobile/desktop
- [x] Loading states and skeletons
- [x] **Playful branding** - Fredoka font for "Let's Cook" title
- [x] Frog chef mascot theme with emerald colors

### Pages
- [x] Home/landing page
- [x] Login page (`/login`)
- [x] Dashboard page (`/dashboard`)
- [ ] Recipe discovery page
- [ ] Recipe detail page
- [x] Meal planning page
- [x] Shopping list page
- [x] User preferences/settings page
- [ ] Saved recipes page

### Components
- [ ] Recipe card component
- [ ] Ingredient list component
- [ ] Step-by-step instructions component
- [x] Meal plan calendar view
- [x] Shopping list with checkboxes
- [x] **Re-roll button** on meal cards with skeleton loading state
- [x] **Stale banner** on shopping lists with regenerate option
- [x] Full-page loaders for AI operations
- [x] Skeleton loaders for page navigation
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
- [x] Configure Vercel project
- [x] Set environment variables
- [x] Deploy to production
- [x] Custom domain setup (`letscook.dev`)

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
| Database Schema | ✅ Complete |
| Claude Integration | ✅ Complete (with Tool Use) |
| API Routes | ✅ Core routes working |
| Intent Handling | ✅ Basic implementation |
| Authentication | ✅ Complete |
| Data Persistence | ✅ Complete |
| Meal Plan Features | ✅ Re-roll, variety settings |
| Shopping Lists | ✅ Stale detection, regeneration |
| Google Assistant | ⏳ Intents designed only |
| Web UI | 🟡 Core pages done |
| Cooking Mode | ⏳ Not started |
| Testing | ⏳ Not started |
| Deployment | ✅ Live at letscook.dev |

**Current Phase:** Phase 4 (Web Application UI) - polishing and feature enhancements

**Next Steps:**
1. Build recipe discovery and detail pages
2. Create saved recipes page
3. Optional: Build chat interface for text-based interaction
4. Optional: Cooking mode with step-by-step navigation

---

## Changelog

### 2025-12-18

**Claude API - Tool Use for Structured Outputs**
- Converted all Claude API calls to use tool use (`tool_choice`) for guaranteed JSON schema compliance
- Created tool definitions for: recipe suggestions, recipe details, meal plans, shopping lists, modified recipes, re-rolled meals
- Eliminated JSON parsing errors from free-form text responses

**Re-roll Meal Feature**
- Added ability to re-roll individual meals without regenerating entire plan
- New `rerollMealPrompt` with context about other meals to avoid duplicates
- PATCH endpoint at `/api/meal-plans/[id]` for meal replacement
- Shopping categories auto-regenerate when meal is re-rolled
- Skeleton loading state on meal card during re-roll

**Shopping List Stale Tracking**
- Added `stale` boolean column to `shopping_lists` table
- Shopping list marked stale when associated meal plan changes (via re-roll)
- "View Shopping List" button replaces "Create" when list exists
- Amber warning dot on button when list is stale
- Stale banner on shopping list page with "Regenerate" option

**Database Migrations**
- Created migration `20251217232422_add_shopping_list_stale.sql`
- Documented migration workflow in `docs/specs/database-schema.md`
- Added migration instructions to `CLAUDE.md`

**UI/UX Improvements**
- Added Fredoka font for playful "Let's Cook" branding
- Applied font to app shell, home page, and login page
- Accessibility: Added `cursor-pointer` to interactive buttons
