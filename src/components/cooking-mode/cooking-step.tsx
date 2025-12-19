"use client";

import { RecipeInstruction } from "@/lib/claude/prompts";
import { StepTimer } from "./step-timer";

interface CookingStepProps {
  instruction: RecipeInstruction;
  nextInstruction?: RecipeInstruction;
  currentStep: number;
  totalSteps: number;
}

export function CookingStep({
  instruction,
  nextInstruction,
  currentStep,
  totalSteps,
}: CookingStepProps) {
  return (
    <div className="flex flex-col items-center text-center px-4 sm:px-8">
      {/* Step indicator */}
      <div className="mb-6 sm:mb-8">
        <span className="text-lg sm:text-xl text-gray-500">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Main instruction */}
      <div className="max-w-3xl mb-8 sm:mb-10">
        <p className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-relaxed font-medium">
          {instruction.instruction}
        </p>
      </div>

      {/* Timer (if step has time) */}
      {instruction.time && (
        <div className="mb-8 sm:mb-10 w-full max-w-md">
          <StepTimer timeString={instruction.time} />
        </div>
      )}

      {/* Tip (if present) */}
      {instruction.tip && (
        <div className="max-w-2xl bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <p className="text-base sm:text-lg text-emerald-800">
              <span className="font-semibold">Tip:</span> {instruction.tip}
            </p>
          </div>
        </div>
      )}

      {/* Next step preview */}
      {nextInstruction && (
        <div className="mt-8 sm:mt-10 max-w-2xl w-full">
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-2">
              Up Next
            </p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {nextInstruction.instruction}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
