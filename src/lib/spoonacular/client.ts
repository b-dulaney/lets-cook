/**
 * Spoonacular API client for fetching recipe images
 *
 * API Docs: https://spoonacular.com/food-api/docs
 */

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com";

interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
}

interface SearchResponse {
  results: SpoonacularRecipe[];
  offset: number;
  number: number;
  totalResults: number;
}

/**
 * Search for a recipe by name/terms and return the image URL
 * Uses the complexSearch endpoint with a simple query
 *
 * @param searchTerms - Simple 1-2 word food term (e.g., "salmon", "pasta", "tacos")
 */
export async function searchRecipeImage(
  searchTerms: string,
): Promise<string | null> {
  if (!SPOONACULAR_API_KEY) {
    console.warn("SPOONACULAR_API_KEY not configured - skipping image fetch");
    return null;
  }

  try {
    const params = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      query: searchTerms,
      number: "1", // Only need the top result
      addRecipeInformation: "false",
    });

    const response = await fetch(`${BASE_URL}/recipes/complexSearch?${params}`);

    if (!response.ok) {
      console.error(
        `Spoonacular API error: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const data: SearchResponse = await response.json();

    if (data.results.length === 0) {
      console.log(`No Spoonacular results for: ${searchTerms}`);
      return null;
    }

    const recipe = data.results[0];

    // Spoonacular provides images in multiple sizes:
    // - 90x90 (tiny)
    // - 240x150, 312x150, 312x231 (small/medium)
    // - 480x360, 556x370 (large)
    // - 636x393 (extra large - largest available)
    // Always construct URL with largest size for best quality
    return `https://img.spoonacular.com/recipes/${recipe.id}-636x393.${recipe.imageType}`;
  } catch (error) {
    console.error("Error fetching recipe image from Spoonacular:", error);
    return null;
  }
}
