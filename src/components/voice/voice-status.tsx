"use client";

import { CookingCommand } from "@/lib/voice/use-voice-commands";

interface VoiceStatusProps {
  isListening: boolean;
  isSupported: boolean;
  lastCommand: CookingCommand | null;
  error: string | null;
  onToggle: () => void;
}

const commandLabels: Record<CookingCommand, string> = {
  next: "Next Step",
  previous: "Previous Step",
  ingredients: "Show Ingredients",
  exit: "Exit",
};

export function VoiceStatus({
  isListening,
  isSupported,
  lastCommand,
  error,
  onToggle,
}: VoiceStatusProps) {
  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={onToggle}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer
        ${
          error
            ? "bg-red-100 text-red-700"
            : lastCommand
            ? "bg-emerald-100 text-emerald-700"
            : isListening
            ? "bg-red-50 text-red-600"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }
      `}
    >
      {/* Microphone icon */}
      <span className="relative">
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
        {isListening && !error && !lastCommand && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </span>

      {/* Status text */}
      <span className="hidden sm:inline">
        {error
          ? "Mic Error"
          : lastCommand
          ? commandLabels[lastCommand]
          : isListening
          ? "Listening..."
          : "Voice Off"}
      </span>
    </button>
  );
}
