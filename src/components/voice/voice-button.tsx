"use client";

interface VoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onClick: () => void;
  error?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const iconSizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function VoiceButton({
  isListening,
  isSupported,
  onClick,
  error,
  size = "md",
  className = "",
}: VoiceButtonProps) {
  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex items-center justify-center rounded-full transition-all cursor-pointer
        ${sizeClasses[size]}
        ${
          isListening
            ? "bg-red-500 text-white hover:bg-red-600"
            : error
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }
        ${className}
      `}
      title={
        error ? error : isListening ? "Stop listening" : "Start voice input"
      }
    >
      {/* Microphone icon */}
      <svg
        className={iconSizes[size]}
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

      {/* Listening animation */}
      {isListening && (
        <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75" />
      )}
    </button>
  );
}
