"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { FullRecipe } from "@/lib/claude/prompts";
import { CookingStep } from "@/components/cooking-mode/cooking-step";
import { IngredientsPanel } from "@/components/cooking-mode/ingredients-panel";
import { useVoiceCommands } from "@/lib/voice/use-voice-commands";
import { VoiceStatus } from "@/components/voice/voice-status";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CookingModePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [recipe, setRecipe] = useState<FullRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);

  // Voice is always enabled in cooking mode - can add toggle UI later if needed
  const voiceEnabled = true;

  useEffect(() => {
    fetchRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRecipe = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/recipes/${id}`);

      if (res.ok) {
        const data = await res.json();
        setRecipe(data.recipe);
      } else if (res.status === 404) {
        setError("Recipe not found");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to load recipe");
      }
    } catch (err) {
      console.error("Error fetching recipe:", err);
      setError("Failed to load recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExit = useCallback(() => {
    router.push(`/recipes/${id}`);
  }, [router, id]);

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    if (!recipe) return;
    if (currentStep >= recipe.instructions.length - 1) {
      // Last step - go to completion
      handleExit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [recipe, currentStep, handleExit]);

  const handleToggleIngredients = useCallback(() => {
    setShowIngredients((prev) => !prev);
  }, []);

  // Voice commands for hands-free control
  const {
    isListening,
    isSupported: voiceSupported,
    lastCommand,
    error: voiceError,
    toggle: toggleVoice,
  } = useVoiceCommands({
    onNext: handleNext,
    onPrevious: handlePrevious,
    onIngredients: handleToggleIngredients,
    onExit: handleExit,
    enabled: voiceEnabled && !loading && !error,
  });

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-600">Loading recipe...</p>
      </div>
    );
  }

  // Error state
  if (error || !recipe) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-4">
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          {error || "Recipe not found"}
        </h2>
        <button
          onClick={handleExit}
          className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const totalSteps = recipe.instructions.length;
  const instruction = recipe.instructions[currentStep];
  const nextInstruction =
    currentStep < totalSteps - 1
      ? recipe.instructions[currentStep + 1]
      : undefined;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
        <button
          onClick={handleExit}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="hidden sm:inline font-medium">Exit</span>
        </button>

        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 text-center truncate max-w-[40%]">
          {recipe.recipeName}
        </h1>

        <div className="flex items-center gap-3">
          <VoiceStatus
            isListening={isListening}
            isSupported={voiceSupported}
            lastCommand={lastCommand}
            error={voiceError}
            onToggle={toggleVoice}
          />
          <div className="text-gray-500 font-medium">
            {currentStep + 1} / {totalSteps}
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto py-8 sm:py-12">
        <div className="min-h-full flex items-center justify-center">
          <CookingStep
            instruction={instruction}
            nextInstruction={nextInstruction}
            currentStep={currentStep + 1}
            totalSteps={totalSteps}
          />
        </div>
      </main>

      {/* Navigation footer */}
      <footer className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between max-w-2xl mx-auto gap-4">
          {/* Previous button */}
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-colors cursor-pointer ${
              isFirstStep
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Ingredients button */}
          <button
            onClick={() => setShowIngredients(true)}
            className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="hidden sm:inline">Ingredients</span>
          </button>

          {/* Next/Finish button */}
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline">
              {isLastStep ? "Finish" : "Next"}
            </span>
            {isLastStep ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </div>
      </footer>

      {/* Ingredients panel */}
      <IngredientsPanel
        ingredients={recipe.ingredients}
        isOpen={showIngredients}
        onClose={() => setShowIngredients(false)}
      />
    </div>
  );
}
