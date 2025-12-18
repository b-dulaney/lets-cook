interface FrogChefProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function FrogChef({ size = 48, className = "", animated = false }: FrogChefProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Chef Hat shadow */}
      <ellipse cx="52" cy="34" rx="22" ry="8" fill="#D1D5DB" opacity="0.4" />

      {/* Chef Hat */}
      <path
        d="M28 32 C28 32 26 8 50 8 C74 8 72 32 72 32"
        fill="#FFFBEB"
        stroke="#D1D5DB"
        strokeWidth="1"
      />
      {/* Hat puff top */}
      <circle cx="38" cy="12" r="8" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1" />
      <circle cx="50" cy="8" r="9" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1" />
      <circle cx="62" cy="12" r="8" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1" />

      {/* Hat base */}
      <ellipse cx="50" cy="32" rx="22" ry="8" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1" />

      {/* Pink ribbon band */}
      <ellipse cx="50" cy="32" rx="22" ry="5" fill="#FBCFE8" />
      <ellipse cx="50" cy="31" rx="22" ry="3.5" fill="#F9A8D4" opacity="0.6" />

      {/* Frog Head */}
      <ellipse
        cx="50"
        cy="62"
        rx="32"
        ry="28"
        fill="#86EFAC"
        className={animated ? "animate-frog-bounce" : ""}
      />

      {/* Lighter belly/face area */}
      <ellipse cx="50" cy="68" rx="20" ry="16" fill="#BBF7D0" />

      {/* Eye bumps */}
      <circle cx="35" cy="48" r="12" fill="#86EFAC" />
      <circle cx="65" cy="48" r="12" fill="#86EFAC" />

      {/* Eyes - white */}
      <circle cx="35" cy="48" r="9" fill="#FFFFFF" />
      <circle cx="65" cy="48" r="9" fill="#FFFFFF" />

      {/* Eyes - pupils */}
      <circle cx="37" cy="49" r="5" fill="#1F2937">
        {animated && (
          <animate
            attributeName="cx"
            values="37;35;37;39;37"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      <circle cx="67" cy="49" r="5" fill="#1F2937">
        {animated && (
          <animate
            attributeName="cx"
            values="67;65;67;69;67"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* Eye shine */}
      <circle cx="34" cy="46" r="2" fill="#FFFFFF" />
      <circle cx="64" cy="46" r="2" fill="#FFFFFF" />

      {/* Blush marks */}
      <ellipse cx="28" cy="62" rx="5" ry="3" fill="#FECACA" opacity="0.6" />
      <ellipse cx="72" cy="62" rx="5" ry="3" fill="#FECACA" opacity="0.6" />

      {/* Smile */}
      <path
        d="M38 72 Q50 82 62 72"
        stroke="#166534"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Nostrils */}
      <circle cx="44" cy="64" r="1.5" fill="#166534" />
      <circle cx="56" cy="64" r="1.5" fill="#166534" />

      {animated && (
        <style>{`
          @keyframes frog-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          .animate-frog-bounce {
            animation: frog-bounce 1s ease-in-out infinite;
          }
        `}</style>
      )}
    </svg>
  );
}

// Smaller icon version for navigation
export function FrogChefIcon({ size = 32, className = "" }: Omit<FrogChefProps, "animated">) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hat shadow for depth */}
      <ellipse cx="52" cy="30" rx="20" ry="6" fill="#D1D5DB" opacity="0.5" />

      {/* Chef hat body */}
      <path d="M30 28 C30 28 28 10 50 10 C72 10 70 28 70 28" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1.5" />

      {/* Hat base/rim */}
      <ellipse cx="50" cy="28" rx="20" ry="6" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1.5" />

      {/* Pink ribbon band */}
      <ellipse cx="50" cy="28" rx="20" ry="4" fill="#FBCFE8" />
      <ellipse cx="50" cy="27" rx="20" ry="3" fill="#F9A8D4" opacity="0.6" />

      {/* Frog head */}
      <ellipse cx="50" cy="60" rx="30" ry="26" fill="#86EFAC" />
      <ellipse cx="50" cy="66" rx="18" ry="14" fill="#BBF7D0" />

      {/* Eye bumps */}
      <circle cx="36" cy="46" r="10" fill="#86EFAC" />
      <circle cx="64" cy="46" r="10" fill="#86EFAC" />

      {/* Eyes */}
      <circle cx="36" cy="46" r="7" fill="#FFFFFF" />
      <circle cx="64" cy="46" r="7" fill="#FFFFFF" />
      <circle cx="38" cy="47" r="4" fill="#1F2937" />
      <circle cx="66" cy="47" r="4" fill="#1F2937" />
      <circle cx="36" cy="44" r="1.5" fill="#FFFFFF" />
      <circle cx="64" cy="44" r="1.5" fill="#FFFFFF" />

      {/* Blush */}
      <ellipse cx="26" cy="58" rx="4" ry="2.5" fill="#FECACA" opacity="0.6" />
      <ellipse cx="74" cy="58" rx="4" ry="2.5" fill="#FECACA" opacity="0.6" />

      {/* Smile */}
      <path d="M40 70 Q50 78 60 70" stroke="#166534" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// Cooking frog for loader - with spatula
export function FrogChefCooking({ size = 120, className = "" }: FrogChefProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Steam */}
      <g className="animate-steam">
        <path d="M75 55 Q80 45 75 35" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
          <animate attributeName="d" values="M75 55 Q80 45 75 35;M75 55 Q70 45 75 35;M75 55 Q80 45 75 35" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M85 50 Q90 40 85 30" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="d" values="M85 50 Q90 40 85 30;M85 50 Q80 40 85 30;M85 50 Q90 40 85 30" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path d="M95 55 Q100 45 95 35" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.15;0.5" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="d" values="M95 55 Q100 45 95 35;M95 55 Q90 45 95 35;M95 55 Q100 45 95 35" dur="1.8s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Pan */}
      <ellipse cx="85" cy="75" rx="25" ry="8" fill="#6B7280" />
      <ellipse cx="85" cy="72" rx="22" ry="6" fill="#9CA3AF" />
      <rect x="55" y="70" width="8" height="20" rx="2" fill="#78716C" transform="rotate(-30 55 70)" />

      {/* Chef Hat shadow */}
      <ellipse cx="37" cy="34" rx="18" ry="6" fill="#D1D5DB" opacity="0.4" />

      {/* Chef Hat */}
      <path d="M17 32 C17 32 15 12 35 12 C55 12 53 32 53 32" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1" />
      <circle cx="26" cy="16" r="6" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1" />
      <circle cx="35" cy="13" r="7" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1" />
      <circle cx="44" cy="16" r="6" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1" />

      {/* Hat base */}
      <ellipse cx="35" cy="32" rx="18" ry="6" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1" />

      {/* Pink ribbon band */}
      <ellipse cx="35" cy="32" rx="18" ry="4" fill="#FBCFE8" />
      <ellipse cx="35" cy="31" rx="18" ry="3" fill="#F9A8D4" opacity="0.6" />

      {/* Frog body */}
      <ellipse cx="35" cy="75" rx="22" ry="18" fill="#86EFAC" />
      <ellipse cx="35" cy="80" rx="14" ry="10" fill="#BBF7D0" />

      {/* Frog head */}
      <ellipse cx="35" cy="55" rx="24" ry="20" fill="#86EFAC">
        <animate attributeName="cy" values="55;53;55" dur="1s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="35" cy="60" rx="14" ry="10" fill="#BBF7D0">
        <animate attributeName="cy" values="60;58;60" dur="1s" repeatCount="indefinite" />
      </ellipse>

      {/* Eye bumps */}
      <circle cx="24" cy="45" r="9" fill="#86EFAC">
        <animate attributeName="cy" values="45;43;45" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="46" cy="45" r="9" fill="#86EFAC">
        <animate attributeName="cy" values="45;43;45" dur="1s" repeatCount="indefinite" />
      </circle>

      {/* Eyes */}
      <circle cx="24" cy="45" r="6" fill="#FFFFFF">
        <animate attributeName="cy" values="45;43;45" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="46" cy="45" r="6" fill="#FFFFFF">
        <animate attributeName="cy" values="45;43;45" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="26" cy="46" r="3.5" fill="#1F2937">
        <animate attributeName="cy" values="46;44;46" dur="1s" repeatCount="indefinite" />
        <animate attributeName="cx" values="26;27;26;25;26" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="48" cy="46" r="3.5" fill="#1F2937">
        <animate attributeName="cy" values="46;44;46" dur="1s" repeatCount="indefinite" />
        <animate attributeName="cx" values="48;49;48;47;48" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="23" cy="43" r="1.5" fill="#FFFFFF">
        <animate attributeName="cy" values="43;41;43" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="45" cy="43" r="1.5" fill="#FFFFFF">
        <animate attributeName="cy" values="43;41;43" dur="1s" repeatCount="indefinite" />
      </circle>

      {/* Blush */}
      <ellipse cx="18" cy="56" rx="4" ry="2.5" fill="#FECACA" opacity="0.6">
        <animate attributeName="cy" values="56;54;56" dur="1s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="52" cy="56" rx="4" ry="2.5" fill="#FECACA" opacity="0.6">
        <animate attributeName="cy" values="56;54;56" dur="1s" repeatCount="indefinite" />
      </ellipse>

      {/* Smile */}
      <path d="M28 64 Q35 72 42 64" stroke="#166534" strokeWidth="2" strokeLinecap="round" fill="none">
        <animate attributeName="d" values="M28 64 Q35 72 42 64;M28 62 Q35 70 42 62;M28 64 Q35 72 42 64" dur="1s" repeatCount="indefinite" />
      </path>

      {/* Arm holding spatula */}
      <ellipse cx="55" cy="68" rx="6" ry="4" fill="#86EFAC" transform="rotate(-20 55 68)" />

      {/* Spatula */}
      <rect x="58" y="58" width="4" height="20" rx="1" fill="#78716C" transform="rotate(15 58 58)" />
      <ellipse cx="68" cy="56" rx="6" ry="4" fill="#9CA3AF" transform="rotate(15 68 56)" />
    </svg>
  );
}
