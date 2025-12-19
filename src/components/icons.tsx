// Cute themed icons for the frog chef app

interface IconProps {
  className?: string;
  size?: number;
}

// Home/Dashboard - cute house with heart chimney smoke
export function HomeIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* House body */}
      <path
        d="M4 10L12 4L20 10V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V10Z"
        fill="#BBF7D0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Roof */}
      <path
        d="M2 11L12 3L22 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Door */}
      <rect
        x="10"
        y="14"
        width="4"
        height="6"
        rx="0.5"
        fill="#86EFAC"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Window */}
      <rect
        x="6"
        y="12"
        width="3"
        height="3"
        rx="0.5"
        fill="#FEF3C7"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Heart smoke */}
      <path
        d="M16 6C16.5 5.5 17.5 5.5 18 6C18.5 6.5 18.5 7.5 17 9C15.5 7.5 15.5 6.5 16 6Z"
        fill="#FECACA"
        stroke="#FECACA"
        strokeWidth="0.5"
      />
    </svg>
  );
}

// Recipe book with cute bookmark
export function RecipeBookIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Book body */}
      <path
        d="M4 4C4 3.44772 4.44772 3 5 3H17C18.1046 3 19 3.89543 19 5V19C19 20.1046 18.1046 21 17 21H5C4.44772 21 4 20.5523 4 20V4Z"
        fill="#FEF3C7"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Book spine */}
      <path d="M7 3V21" stroke="currentColor" strokeWidth="1.5" />
      {/* Cute bookmark */}
      <path
        d="M14 3V8L15.5 7L17 8V3"
        fill="#F9A8D4"
        stroke="#F472B6"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Page lines */}
      <line
        x1="10"
        y1="10"
        x2="16"
        y2="10"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="13"
        x2="15"
        y2="13"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="16"
        x2="14"
        y2="16"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Calendar with fork and spoon
export function MealPlanIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Calendar body */}
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
        fill="#BBF7D0"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Calendar top */}
      <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" />
      {/* Calendar hooks */}
      <path
        d="M8 3V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 3V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Fork */}
      <path
        d="M9 12V17M8 12V14M10 12V14"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Spoon */}
      <ellipse
        cx="15"
        cy="13"
        rx="1.5"
        ry="2"
        fill="#FEF3C7"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M15 15V17"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Cute shopping basket
export function ShoppingIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Basket body */}
      <path
        d="M4 10H20L18 20H6L4 10Z"
        fill="#BBF7D0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Basket handle */}
      <path
        d="M8 10C8 6 10 4 12 4C14 4 16 6 16 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Cute items peeking out */}
      <circle cx="9" cy="9" r="1.5" fill="#FCA5A5" /> {/* Tomato */}
      <circle cx="12" cy="8" r="1.5" fill="#FCD34D" /> {/* Lemon */}
      <circle cx="15" cy="9" r="1.5" fill="#86EFAC" /> {/* Lettuce */}
      {/* Basket lines */}
      <path
        d="M8 14H16"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M7 17H17"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Heart with plate - saved recipes
export function SavedRecipesIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Plate */}
      <ellipse
        cx="12"
        cy="14"
        rx="8"
        ry="4"
        fill="#FEF3C7"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse
        cx="12"
        cy="14"
        rx="5"
        ry="2.5"
        fill="#FFFBEB"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Heart on plate */}
      <path
        d="M12 11C11 9.5 9 9.5 9 11C9 12.5 12 15 12 15C12 15 15 12.5 15 11C15 9.5 13 9.5 12 11Z"
        fill="#F9A8D4"
        stroke="#EC4899"
        strokeWidth="1"
      />
    </svg>
  );
}

// Cute settings with sparkle
export function SettingsIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Main gear */}
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="#BBF7D0"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Gear teeth */}
      <path
        d="M12 2V4M12 20V22M2 12H4M20 12H22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Outer ring */}
      <circle
        cx="12"
        cy="12"
        r="6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      {/* Sparkle */}
      <path
        d="M18 4L18.5 5L19.5 5.5L18.5 6L18 7L17.5 6L16.5 5.5L17.5 5L18 4Z"
        fill="#FCD34D"
        stroke="#FBBF24"
        strokeWidth="0.5"
      />
    </svg>
  );
}

// Search with sparkle - find recipes
export function SearchIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Magnifying glass circle */}
      <circle
        cx="10"
        cy="10"
        r="6"
        fill="#BBF7D0"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Glass shine */}
      <path
        d="M7 8C7.5 7 8.5 6.5 10 6.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Handle */}
      <path
        d="M14.5 14.5L20 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Sparkles */}
      <circle cx="17" cy="5" r="1" fill="#FCD34D" />
      <circle cx="19" cy="7" r="0.5" fill="#FCD34D" />
    </svg>
  );
}

// Cute pot for cooking/recipes
export function CookingPotIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Steam */}
      <path
        d="M8 5C8 4 9 3 9 2"
        stroke="#9CA3AF"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M12 4C12 3 13 2 13 1"
        stroke="#9CA3AF"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M16 5C16 4 17 3 17 2"
        stroke="#9CA3AF"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Pot lid */}
      <ellipse
        cx="12"
        cy="8"
        rx="7"
        ry="2"
        fill="#86EFAC"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="6" r="1" fill="currentColor" />
      {/* Pot body */}
      <path
        d="M5 10H19V17C19 19.2091 17.2091 21 15 21H9C6.79086 21 5 19.2091 5 17V10Z"
        fill="#BBF7D0"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Handles */}
      <path
        d="M5 12H3C2.5 12 2 12.5 2 13V14C2 14.5 2.5 15 3 15H5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M19 12H21C21.5 12 22 12.5 22 13V14C22 14.5 21.5 15 21 15H19"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// Cute chef hat icon
export function ChefHatIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Hat puffs */}
      <circle
        cx="8"
        cy="8"
        r="3"
        fill="#FFFBEB"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="6"
        r="3.5"
        fill="#FFFBEB"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="16"
        cy="8"
        r="3"
        fill="#FFFBEB"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Hat base */}
      <path
        d="M6 10C6 10 5 12 5 14H19C19 12 18 10 18 10"
        fill="#FFFBEB"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Pink band */}
      <rect
        x="5"
        y="14"
        width="14"
        height="3"
        rx="1"
        fill="#FBCFE8"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Hat body */}
      <rect
        x="6"
        y="17"
        width="12"
        height="4"
        rx="1"
        fill="#FFFBEB"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// Cute sparkle/star
export function SparkleIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill="#FCD34D"
        stroke="#FBBF24"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="5" r="1.5" fill="#FCD34D" />
      <circle cx="6" cy="18" r="1" fill="#FCD34D" />
    </svg>
  );
}
