"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Check for speech recognition support once at module level (client-side only)
function getSpeechRecognitionAPI() {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

export interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  language?: string;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

export interface UseSpeechRecognitionReturn {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  start: () => void;
  stop: () => void;
  toggle: () => void;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {},
): UseSpeechRecognitionReturn {
  const { continuous = false, language = "en-US", onResult, onError } = options;

  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const isStoppingRef = useRef(false);

  // Get the API once - this is stable across renders
  const SpeechRecognitionAPI = getSpeechRecognitionAPI();
  const isSupported = SpeechRecognitionAPI !== null;

  // Initialize speech recognition
  useEffect(() => {
    if (!SpeechRecognitionAPI) {
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = continuous;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      setTranscript(text);
      onResult?.(text);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      // Don't treat "no-speech" as an error in continuous mode
      if (event.error === "no-speech" && continuous) {
        return;
      }

      let errorMessage = "Speech recognition error";
      switch (event.error) {
        case "not-allowed":
          errorMessage = "Microphone access denied";
          break;
        case "no-speech":
          errorMessage = "No speech detected";
          break;
        case "network":
          errorMessage = "Network error";
          break;
        case "audio-capture":
          errorMessage = "No microphone found";
          break;
      }
      setError(errorMessage);
      setIsListening(false);
      onError?.(errorMessage);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart in continuous mode unless explicitly stopped
      if (continuous && !isStoppingRef.current && recognitionRef.current) {
        try {
          recognition.start();
        } catch {
          // Ignore errors from rapid start/stop
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        isStoppingRef.current = true;
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, [continuous, language, onResult, onError, SpeechRecognitionAPI]);

  const start = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      isStoppingRef.current = false;
      setTranscript("");
      setError(null);
      try {
        recognitionRef.current.start();
      } catch {
        // Ignore if already started
      }
    }
  }, [isListening]);

  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      isStoppingRef.current = true;
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  return {
    transcript,
    isListening,
    isSupported,
    error,
    start,
    stop,
    toggle,
  };
}
