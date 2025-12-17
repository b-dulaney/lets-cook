# Dialogflow Intent Structure

## Core MVP Intents

### 1. welcome

- Training: "talk to [app]", "open [app]"
- Response: Greeting + capabilities overview

### 2. recipe.find_by_ingredients

- Training: "I have chicken and broccoli", "What can I make with X"
- Parameters: ingredients (@sys.any list)
- Webhook: Yes
- Returns: 3 recipe suggestions

### 3. recipe.get_details

- Training: "Tell me more", "Show full recipe"
- Context: After recipe suggestion
- Webhook: Yes
- Returns: Full recipe with steps

... (rest of intent structure from earlier)
