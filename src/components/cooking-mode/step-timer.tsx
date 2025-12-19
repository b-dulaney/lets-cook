"use client";

import { useState, useEffect, useCallback } from "react";

interface StepTimerProps {
  timeString: string;
  onComplete?: () => void;
}

type TimerState = "idle" | "running" | "paused" | "complete";

/**
 * Parse time strings like "5 minutes", "2-3 minutes", "30 seconds", "1 hour"
 * Returns seconds, or null if unparseable
 */
function parseTimeString(timeString: string): number | null {
  const lower = timeString.toLowerCase();

  // Extract first number (handles ranges like "2-3 minutes" by using first value)
  const numberMatch = lower.match(/(\d+)/);
  if (!numberMatch) return null;

  const value = parseInt(numberMatch[1], 10);

  // Determine unit
  if (lower.includes("hour")) {
    return value * 3600;
  } else if (lower.includes("minute")) {
    return value * 60;
  } else if (lower.includes("second")) {
    return value;
  }

  // Default to minutes if no unit specified
  return value * 60;
}

/**
 * Format seconds as MM:SS or HH:MM:SS
 */
function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function StepTimer({ timeString, onComplete }: StepTimerProps) {
  const totalSeconds = parseTimeString(timeString);
  const [remaining, setRemaining] = useState(totalSeconds || 0);
  const [state, setState] = useState<TimerState>("idle");

  // Track previous timeString to detect changes during render
  // This is the React-recommended pattern for updating state based on props
  const [prevTimeString, setPrevTimeString] = useState(timeString);
  if (timeString !== prevTimeString) {
    setPrevTimeString(timeString);
    setRemaining(parseTimeString(timeString) || 0);
    setState("idle");
  }

  // Countdown effect
  useEffect(() => {
    if (state !== "running") return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setState("complete");
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state, onComplete]);

  const handleStart = useCallback(() => {
    if (state === "idle" || state === "complete") {
      setRemaining(totalSeconds || 0);
    }
    setState("running");
  }, [state, totalSeconds]);

  const handlePause = useCallback(() => {
    setState("paused");
  }, []);

  const handleReset = useCallback(() => {
    setState("idle");
    setRemaining(totalSeconds || 0);
  }, [totalSeconds]);

  if (!totalSeconds) {
    return null;
  }

  const isComplete = state === "complete";
  const isRunning = state === "running";

  return (
    <div
      className={`flex flex-col items-center gap-4 p-6 rounded-2xl transition-colors ${
        isComplete
          ? "bg-emerald-100 border-2 border-emerald-500"
          : "bg-gray-100"
      }`}
    >
      {/* Timer display */}
      <div
        className={`text-5xl sm:text-6xl font-mono font-bold tabular-nums ${
          isComplete
            ? "text-emerald-600"
            : isRunning
              ? "text-gray-900"
              : "text-gray-600"
        }`}
      >
        {formatTime(remaining)}
      </div>

      {/* Original time reference */}
      <p className="text-sm text-gray-500">{timeString}</p>

      {/* Controls */}
      <div className="flex gap-3">
        {state === "idle" && (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Start Timer
          </button>
        )}

        {state === "running" && (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
            Pause
          </button>
        )}

        {state === "paused" && (
          <>
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Resume
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors cursor-pointer"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
          </>
        )}

        {state === "complete" && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors cursor-pointer"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset Timer
          </button>
        )}
      </div>

      {/* Completion message */}
      {isComplete && (
        <p className="text-emerald-700 font-medium animate-pulse">
          Time&apos;s up!
        </p>
      )}
    </div>
  );
}
