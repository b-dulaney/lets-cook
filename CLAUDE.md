# Meal Planning Assistant

Quick start for Claude Code:

1. Read `docs/project-context.md` for overview
2. Check `docs/specs/` for detailed specifications
3. Environment variables needed:
   - ANTHROPIC_API_KEY
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SPOONACULAR_API_KEY (optional)

## Development Commands

- `npm run dev` - Start Next.js dev server
- `npm run test` - Run tests
- `npm run type-check` - TypeScript checking

## Key Files

- `pages/api/dialogflow-webhook.ts` - Main webhook
- `lib/claude-client.ts` - Claude API wrapper
- `lib/prompts.ts` - All AI prompts
- `lib/supabase.ts` - Database client
