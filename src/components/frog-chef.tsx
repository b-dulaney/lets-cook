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
      {/* Chef Hat - grouped for animation */}
      <g className={animated ? "animate-frog-bounce" : ""}>
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
      </g>

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

// Cooking frog for loader - with spatula and frying pan
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
      {/* Frying Pan */}
      {/* Pan handle */}
      <rect x="95" y="68" width="22" height="6" rx="2" fill="#78716C" />
      <rect x="95" y="69" width="20" height="2" fill="#8B7355" />
      {/* Pan body - dark outer edge */}
      <ellipse cx="80" cy="72" rx="22" ry="10" fill="#4B5563" />
      {/* Pan body - inner cooking surface */}
      <ellipse cx="80" cy="71" rx="19" ry="8" fill="#374151" />
      {/* Pan rim highlight */}
      <ellipse cx="80" cy="68" rx="19" ry="6" fill="#6B7280" />
      {/* Food in pan - egg */}
      <ellipse cx="80" cy="70" rx="8" ry="4" fill="#FEFCE8" />
      <ellipse cx="80" cy="70" rx="3" ry="2" fill="#FCD34D" />

      {/* Steam rising from pan */}
      <g>
        <path d="M72 58 Q76 48 72 38" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="d" values="M72 58 Q76 48 72 38;M72 58 Q68 48 72 38;M72 58 Q76 48 72 38" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M80 56 Q84 44 80 32" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.3s" repeatCount="indefinite" />
          <animate attributeName="d" values="M80 56 Q84 44 80 32;M80 56 Q76 44 80 32;M80 56 Q84 44 80 32" dur="2.3s" repeatCount="indefinite" />
        </path>
        <path d="M88 58 Q92 48 88 38" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.05;0.3" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="d" values="M88 58 Q92 48 88 38;M88 58 Q84 48 88 38;M88 58 Q92 48 88 38" dur="1.8s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Chef Hat - grouped for bounce animation */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0;0,-2;0,0"
          dur="1s"
          repeatCount="indefinite"
        />
        {/* Chef Hat shadow */}
        <ellipse cx="32" cy="34" rx="18" ry="6" fill="#D1D5DB" opacity="0.4" />

        {/* Chef Hat */}
        <path d="M12 32 C12 32 10 12 30 12 C50 12 48 32 48 32" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1" />
        <circle cx="21" cy="16" r="6" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1" />
        <circle cx="30" cy="13" r="7" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1" />
        <circle cx="39" cy="16" r="6" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1" />

        {/* Hat base */}
        <ellipse cx="30" cy="32" rx="18" ry="6" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1" />

        {/* Pink ribbon band */}
        <ellipse cx="30" cy="32" rx="18" ry="4" fill="#FBCFE8" />
        <ellipse cx="30" cy="31" rx="18" ry="3" fill="#F9A8D4" opacity="0.6" />
      </g>

      {/* Frog body */}
      <ellipse cx="30" cy="78" rx="20" ry="16" fill="#86EFAC" />
      <ellipse cx="30" cy="82" rx="12" ry="9" fill="#BBF7D0" />

      {/* Frog head */}
      <ellipse cx="30" cy="55" rx="22" ry="18" fill="#86EFAC">
        <animate attributeName="cy" values="55;53;55" dur="1s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="30" cy="60" rx="13" ry="9" fill="#BBF7D0">
        <animate attributeName="cy" values="60;58;60" dur="1s" repeatCount="indefinite" />
      </ellipse>

      {/* Eye bumps */}
      <circle cx="20" cy="45" r="8" fill="#86EFAC">
        <animate attributeName="cy" values="45;43;45" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="45" r="8" fill="#86EFAC">
        <animate attributeName="cy" values="45;43;45" dur="1s" repeatCount="indefinite" />
      </circle>

      {/* Eyes */}
      <circle cx="20" cy="45" r="5.5" fill="#FFFFFF">
        <animate attributeName="cy" values="45;43;45" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="45" r="5.5" fill="#FFFFFF">
        <animate attributeName="cy" values="45;43;45" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="22" cy="46" r="3" fill="#1F2937">
        <animate attributeName="cy" values="46;44;46" dur="1s" repeatCount="indefinite" />
        <animate attributeName="cx" values="22;23;22;21;22" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="42" cy="46" r="3" fill="#1F2937">
        <animate attributeName="cy" values="46;44;46" dur="1s" repeatCount="indefinite" />
        <animate attributeName="cx" values="42;43;42;41;42" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="19" cy="43" r="1.5" fill="#FFFFFF">
        <animate attributeName="cy" values="43;41;43" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="39" cy="43" r="1.5" fill="#FFFFFF">
        <animate attributeName="cy" values="43;41;43" dur="1s" repeatCount="indefinite" />
      </circle>

      {/* Blush */}
      <ellipse cx="14" cy="56" rx="3.5" ry="2" fill="#FECACA" opacity="0.6">
        <animate attributeName="cy" values="56;54;56" dur="1s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="46" cy="56" rx="3.5" ry="2" fill="#FECACA" opacity="0.6">
        <animate attributeName="cy" values="56;54;56" dur="1s" repeatCount="indefinite" />
      </ellipse>

      {/* Smile */}
      <path d="M24 64 Q30 71 36 64" stroke="#166534" strokeWidth="2" strokeLinecap="round" fill="none">
        <animate attributeName="d" values="M24 64 Q30 71 36 64;M24 62 Q30 69 36 62;M24 64 Q30 71 36 64" dur="1s" repeatCount="indefinite" />
      </path>

      {/* Arm holding spatula */}
      <ellipse cx="50" cy="70" rx="8" ry="5" fill="#86EFAC" transform="rotate(-15 50 70)">
        <animate attributeName="transform" values="rotate(-15 50 70);rotate(-20 50 68);rotate(-15 50 70)" dur="0.8s" repeatCount="indefinite" />
      </ellipse>

      {/* Spatula */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 58 85;-5 58 85;0 58 85" dur="0.8s" repeatCount="indefinite" />
        {/* Handle */}
        <rect x="54" y="58" width="4" height="24" rx="2" fill="#8B7355" />
        <rect x="55" y="60" width="2" height="20" fill="#A68B5B" />
        {/* Spatula head */}
        <rect x="50" y="48" width="12" height="12" rx="2" fill="#9CA3AF" />
        <rect x="51" y="49" width="10" height="10" rx="1" fill="#D1D5DB" />
        {/* Slots in spatula */}
        <rect x="53" y="52" width="6" height="2" rx="1" fill="#9CA3AF" />
        <rect x="53" y="55" width="6" height="2" rx="1" fill="#9CA3AF" />
      </g>
    </svg>
  );
}
