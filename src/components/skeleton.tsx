interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
    />
  );
}

export function SkeletonText({ className = "" }: SkeletonProps) {
  return <Skeleton className={`h-4 ${className}`} />;
}

export function SkeletonHeading({ className = "" }: SkeletonProps) {
  return <Skeleton className={`h-6 ${className}`} />;
}

export function SkeletonButton({ className = "" }: SkeletonProps) {
  return <Skeleton className={`h-10 w-32 ${className}`} />;
}

// Single meal day card skeleton (for re-roll loading state)
export function SkeletonMealDayCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-5 w-14 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-3" />
          <div>
            <Skeleton className="h-3 w-24 mb-2" />
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-6 w-16 rounded" />
              <Skeleton className="h-6 w-20 rounded" />
              <Skeleton className="h-6 w-14 rounded" />
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Skeleton className="h-4 w-16 hidden sm:block" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

// Card skeleton for meal plans and shopping lists
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <SkeletonHeading className="w-48 mb-2" />
          <SkeletonText className="w-32" />
        </div>
        <Skeleton className="h-6 w-20 rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-3 w-8 mx-auto mb-1" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <Skeleton className="h-4 w-4 mr-2 rounded-full" />
        <SkeletonText className="w-28" />
      </div>
    </div>
  );
}

// Shopping list card skeleton
export function SkeletonShoppingCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <SkeletonHeading className="w-36 mb-2" />
          <SkeletonText className="w-44" />
        </div>
        <div className="text-right">
          <Skeleton className="h-5 w-12 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-2 w-full rounded-full mb-4" />
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded" />
        ))}
      </div>
    </div>
  );
}

// Meal plan detail skeleton
export function SkeletonMealPlanDetail() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-2">
          <div>
            <SkeletonHeading className="w-64 mb-2" />
            <SkeletonText className="w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-36 rounded-lg" />
            <Skeleton className="h-10 w-20 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Days */}
      <div className="grid gap-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-6 w-16 rounded" />
              <Skeleton className="h-5 w-12 rounded" />
              <Skeleton className="h-4 w-16" />
            </div>
            <SkeletonHeading className="w-48 mb-2" />
            <SkeletonText className="w-full max-w-md mb-3" />
            <div className="flex gap-1">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-6 w-16 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Shopping list detail skeleton
export function SkeletonShoppingListDetail() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="h-4 w-36 mb-4" />
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-2">
          <div>
            <SkeletonHeading className="w-40 mb-2" />
            <SkeletonText className="w-48" />
          </div>
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <SkeletonText className="w-16" />
          <SkeletonText className="w-20" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <SkeletonHeading className="w-24 mb-1" />
              <SkeletonText className="w-16" />
            </div>
            <div className="divide-y divide-gray-100">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="px-4 py-3 flex items-center gap-3">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <SkeletonText className="flex-1 max-w-xs" />
                  <SkeletonText className="w-12" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// List page skeleton (meal plans or shopping lists)
export function SkeletonListPage({ cardCount = 3, type = "meal-plan" }: { cardCount?: number; type?: "meal-plan" | "shopping" }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SkeletonHeading className="w-36" />
        <SkeletonButton />
      </div>
      <div className="grid gap-4">
        {[...Array(cardCount)].map((_, i) => (
          type === "meal-plan" ? <SkeletonCard key={i} /> : <SkeletonShoppingCard key={i} />
        ))}
      </div>
    </div>
  );
}

// Recipe card skeleton
export function SkeletonRecipeCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <SkeletonHeading className="w-3/4 mb-2" />
          <SkeletonText className="w-full mb-1" />
          <SkeletonText className="w-2/3" />
        </div>
        <Skeleton className="h-6 w-16 rounded ml-3" />
      </div>
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-5 w-20 rounded" />
        <Skeleton className="h-5 w-16 rounded" />
      </div>
      <div className="border-t border-gray-100 pt-3">
        <SkeletonText className="w-24 mb-2" />
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Recipe discovery results skeleton
export function SkeletonRecipeResults({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[...Array(count)].map((_, i) => (
        <SkeletonRecipeCard key={i} />
      ))}
    </div>
  );
}

// Recipe detail page skeleton
export function SkeletonRecipeDetail() {
  return (
    <div>
      {/* Back link */}
      <Skeleton className="h-4 w-24 mb-4" />

      {/* Header */}
      <div className="mb-6">
        <SkeletonHeading className="w-3/4 h-8 mb-3" />
        <div className="flex flex-wrap gap-3 mb-4">
          <Skeleton className="h-6 w-20 rounded" />
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-6 w-28 rounded" />
          <Skeleton className="h-6 w-20 rounded" />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ingredients (sidebar on desktop) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <SkeletonHeading className="w-28 mb-4" />
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex gap-2">
                  <Skeleton className="h-4 w-16 shrink-0" />
                  <SkeletonText className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <SkeletonHeading className="w-32 mb-4" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1">
                    <SkeletonText className="w-full mb-2" />
                    <SkeletonText className="w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips section */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 mt-6">
            <SkeletonHeading className="w-24 mb-4" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <SkeletonText key={i} className="w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings page skeleton
export function SkeletonSettings() {
  return (
    <div className="max-w-3xl">
      <SkeletonHeading className="w-24 mb-6" />

      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <SkeletonHeading className="w-40 mb-4" />
          {i === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, j) => (
                <div key={j}>
                  <SkeletonText className="w-24 mb-2" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, j) => (
                <Skeleton key={j} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
