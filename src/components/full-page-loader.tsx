"use client";

import { useEffect, useState } from "react";

interface FullPageLoaderProps {
  message?: string;
  submessage?: string;
}

const COOKING_TIPS = [
  "Salt your pasta water like the sea",
  "Let meat rest before slicing",
  "Mise en place makes cooking easier",
  "Taste as you go",
  "Sharp knives are safer knives",
  "Don't crowd the pan",
  "Preheat your oven fully",
  "Room temperature eggs blend better",
];

export function FullPageLoader({
  message = "Preparing your request...",
  submessage,
}: FullPageLoaderProps) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Rotate tips every 3 seconds
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % COOKING_TIPS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Animated cooking pot */}
      <div className="relative mb-8">
        <div className="w-24 h-24 relative">
          {/* Pot body */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Steam lines - animated */}
            <g className="animate-steam">
              <path
                d="M30 35 Q35 25 30 15"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                className="animate-steam-1"
              />
              <path
                d="M50 30 Q55 20 50 10"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                className="animate-steam-2"
              />
              <path
                d="M70 35 Q65 25 70 15"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                className="animate-steam-3"
              />
            </g>

            {/* Pot lid */}
            <ellipse
              cx="50"
              cy="42"
              rx="35"
              ry="8"
              fill="#3B82F6"
              className="animate-lid"
            />
            <circle cx="50" cy="38" r="5" fill="#2563EB" />

            {/* Pot body */}
            <path
              d="M15 50 L20 85 Q20 95 50 95 Q80 95 80 85 L85 50 Z"
              fill="#3B82F6"
            />

            {/* Pot rim */}
            <ellipse cx="50" cy="50" rx="38" ry="10" fill="#2563EB" />

            {/* Handles */}
            <rect x="5" y="55" width="12" height="8" rx="2" fill="#1D4ED8" />
            <rect x="83" y="55" width="12" height="8" rx="2" fill="#1D4ED8" />
          </svg>
        </div>

        {/* Pulsing ring */}
        <div className="absolute inset-0 -m-4">
          <div className="w-32 h-32 rounded-full border-4 border-blue-200 animate-ping opacity-20" />
        </div>
      </div>

      {/* Main message */}
      <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center px-4">
        {message}
      </h2>

      {/* Submessage or loading dots */}
      {submessage ? (
        <p className="text-gray-600 mb-6 text-center px-4">{submessage}</p>
      ) : (
        <div className="flex gap-1 mb-6">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      )}

      {/* Cooking tip */}
      <div className="mt-4 px-6 py-3 bg-amber-50 border border-amber-200 rounded-lg max-w-sm mx-4">
        <p className="text-sm text-amber-800 text-center">
          <span className="font-medium">Tip:</span>{" "}
          <span className="transition-opacity duration-300">
            {COOKING_TIPS[tipIndex]}
          </span>
        </p>
      </div>

      {/* Custom styles for steam animation */}
      <style jsx>{`
        @keyframes steam {
          0%, 100% {
            opacity: 0;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-5px);
          }
        }

        @keyframes lid-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        .animate-steam-1 {
          animation: steam 2s ease-in-out infinite;
        }

        .animate-steam-2 {
          animation: steam 2s ease-in-out infinite 0.3s;
        }

        .animate-steam-3 {
          animation: steam 2s ease-in-out infinite 0.6s;
        }

        .animate-lid {
          animation: lid-bounce 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
