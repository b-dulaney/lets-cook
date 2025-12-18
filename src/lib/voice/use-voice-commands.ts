"use client";

import { useCallback, useEffect, useState } from "react";
import { useSpeechRecognition } from "./use-speech-recognition";

export type CookingCommand = "next" | "previous" | "ingredients" | "exit";

interface UseVoiceCommandsOptions {
  onNext: () => void;
  onPrevious: () => void;
  onIngredients: () => void;
  onExit: () => void;
  enabled?: boolean;
}

interface UseVoiceCommandsReturn {
  isListening: boolean;
  isSupported: boolean;
  lastCommand: CookingCommand | null;
  lastTranscript: string;
  error: string | null;
  start: () => void;
  stop: () => void;
  toggle: () => void;
}

const COMMANDS: Record<CookingCommand, string[]> = {
  next: ["next", "continue", "next step", "go on", "forward"],
  previous: ["previous", "back", "go back", "last step", "before"],
  ingredients: ["ingredients", "show ingredients", "what do i need", "ingredient list"],
  exit: ["exit", "done", "finish", "stop cooking", "close", "quit"],
};

function parseCommand(transcript: string): CookingCommand | null {
  const lower = transcript.toLowerCase().trim();

  for (const [command, phrases] of Object.entries(COMMANDS)) {
    if (phrases.some((phrase) => lower.includes(phrase))) {
      return command as CookingCommand;
    }
  }
  return null;
}

export function useVoiceCommands(
  options: UseVoiceCommandsOptions
): UseVoiceCommandsReturn {
  const { onNext, onPrevious, onIngredients, onExit, enabled = true } = options;

  const [lastCommand, setLastCommand] = useState<CookingCommand | null>(null);
  const [lastTranscript, setLastTranscript] = useState("");

  const handleResult = useCallback(
    (transcript: string) => {
      setLastTranscript(transcript);
      const command = parseCommand(transcript);

      if (command) {
        setLastCommand(command);

        switch (command) {
          case "next":
            onNext();
            break;
          case "previous":
            onPrevious();
            break;
          case "ingredients":
            onIngredients();
            break;
          case "exit":
            onExit();
            break;
        }

        // Clear the command after a short delay
        setTimeout(() => setLastCommand(null), 1500);
      }
    },
    [onNext, onPrevious, onIngredients, onExit]
  );

  const {
    isListening,
    isSupported,
    error,
    start,
    stop,
    toggle,
  } = useSpeechRecognition({
    continuous: true,
    onResult: handleResult,
  });

  // Auto-start if enabled and supported
  useEffect(() => {
    if (enabled && isSupported && !isListening) {
      // Small delay to let component mount
      const timer = setTimeout(() => {
        start();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [enabled, isSupported]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stop when disabled
  useEffect(() => {
    if (!enabled && isListening) {
      stop();
    }
  }, [enabled, isListening, stop]);

  return {
    isListening,
    isSupported,
    lastCommand,
    lastTranscript,
    error,
    start,
    stop,
    toggle,
  };
}
