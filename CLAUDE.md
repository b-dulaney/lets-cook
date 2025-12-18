# Meal Planning Assistant

Quick start for Claude Code:

1. Read `docs/project-context.md` for overview
2. Read `docs/IMPLEMENTATION.md` for progress checklist
3. Check `docs/specs/` for detailed specifications
4. Environment variables needed:
   - ANTHROPIC_API_KEY
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SPOONACULAR_API_KEY (optional)

## Development Commands

- `npm run dev` - Start Next.js dev server
- `npx tsc --noEmit` - TypeScript checking

## Key Files

- `src/app/api/dialogflow/route.ts` - Dialogflow webhook
- `src/app/api/chat/route.ts` - Test chat endpoint
- `src/lib/claude/client.ts` - Claude API wrapper
- `src/lib/claude/prompts.ts` - All AI prompt templates
- `src/lib/dialogflow/intent-handler.ts` - Intent routing
- `src/lib/supabase/` - Database clients

## Testing the API

```bash
# Start dev server
npm run dev

# Test recipe discovery
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I have chicken, rice, and broccoli"}'
```
