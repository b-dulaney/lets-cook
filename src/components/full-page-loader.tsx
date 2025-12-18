"use client";

import { useEffect, useState } from "react";
import { FrogChefCooking } from "./frog-chef";

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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-white to-emerald-50">
      {/* Animated frog chef */}
      <div className="relative mb-8">
        <FrogChefCooking size={140} />

        {/* Pulsing ring */}
        <div className="absolute inset-0 -m-4 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border-4 border-emerald-200 animate-ping opacity-20" />
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
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      )}

      {/* Cooking tip */}
      <div className="mt-4 px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-lg max-w-sm mx-4">
        <p className="text-sm text-emerald-800 text-center">
          <span className="font-medium">Tip:</span>{" "}
          <span className="transition-opacity duration-300">
            {COOKING_TIPS[tipIndex]}
          </span>
        </p>
      </div>
    </div>
  );
}
