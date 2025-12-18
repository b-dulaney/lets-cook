"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SkeletonShoppingListDetail } from "@/components/skeleton";

interface ShoppingListItem {
  item: string;
  quantity: string;
  category?: string;
  purchased: boolean;
}

interface ShoppingList {
  id: string;
  meal_plan_id: string | null;
  items: ShoppingListItem[];
  created_at: string;
  updated_at: string;
}

export default function ShoppingListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchShoppingList();
  }, [id]);

  const fetchShoppingList = async () => {
    try {
      const res = await fetch(`/api/shopping-lists/${id}`);
      if (res.ok) {
        const data = await res.json();
        setShoppingList(data.shoppingList);
      } else {
        setError("Shopping list not found");
      }
    } catch (err) {
      console.error("Error fetching shopping list:", err);
      setError("Failed to load shopping list");
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (index: number) => {
    if (!shoppingList) return;

    const newItems = [...shoppingList.items];
    newItems[index] = { ...newItems[index], purchased: !newItems[index].purchased };

    // Optimistic update
    setShoppingList({ ...shoppingList, items: newItems });

    setSaving(true);
    try {
      const res = await fetch(`/api/shopping-lists/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: newItems }),
      });

      if (!res.ok) {
        // Revert on error
        setShoppingList(shoppingList);
        setError("Failed to update item");
      }
    } catch (err) {
      console.error("Error updating item:", err);
      setShoppingList(shoppingList);
      setError("Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  const deleteShoppingList = async () => {
    if (!confirm("Are you sure you want to delete this shopping list?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/shopping-lists/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/shopping");
      } else {
        setError("Failed to delete shopping list");
      }
    } catch (err) {
      console.error("Error deleting shopping list:", err);
      setError("Failed to delete shopping list");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStats = () => {
    if (!shoppingList) return { total: 0, purchased: 0, percentage: 0 };
    const total = shoppingList.items.length;
    const purchased = shoppingList.items.filter((i) => i.purchased).length;
    return { total, purchased, percentage: total > 0 ? Math.round((purchased / total) * 100) : 0 };
  };

  const getItemsByCategory = () => {
    if (!shoppingList) return {};
    const grouped: Record<string, { item: ShoppingListItem; index: number }[]> = {};

    shoppingList.items.forEach((item, index) => {
      const category = item.category || "Other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push({ item, index });
    });

    return grouped;
  };

  if (loading) {
    return <SkeletonShoppingListDetail />;
  }

  if (error || !shoppingList) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || "Shopping list not found"}</p>
        <Link href="/shopping" className="text-blue-600 hover:text-blue-500">
          Back to Shopping Lists
        </Link>
      </div>
    );
  }

  const stats = getStats();
  const itemsByCategory = getItemsByCategory();

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/shopping"
          className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Shopping Lists
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Shopping List
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Created {formatDate(shoppingList.created_at)}
            </p>
          </div>

          <button
            onClick={deleteShoppingList}
            disabled={deleting}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-red-300 text-red-700 font-medium rounded-lg hover:bg-red-50 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className={`text-sm font-medium ${stats.percentage === 100 ? "text-green-700" : "text-gray-700"}`}>
            {stats.purchased} of {stats.total} items
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${stats.percentage === 100 ? "bg-green-500" : "bg-blue-500"}`}
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
        {stats.percentage === 100 && (
          <p className="mt-2 text-sm text-green-700 font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            All done! Great job!
          </p>
        )}
      </div>

      {/* Saving indicator */}
      {saving && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Saving...
        </div>
      )}

      {/* Items by category */}
      <div className="space-y-6">
        {Object.entries(itemsByCategory).map(([category, items]) => (
          <div key={category} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900 capitalize">{category}</h2>
              <p className="text-sm text-gray-500">
                {items.filter((i) => i.item.purchased).length} of {items.length} items
              </p>
            </div>
            <ul className="divide-y divide-gray-100">
              {items.map(({ item, index }) => (
                <li key={index}>
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        item.purchased
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {item.purchased && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium ${
                          item.purchased ? "text-gray-400 line-through" : "text-gray-900"
                        }`}
                      >
                        {item.item}
                      </p>
                    </div>
                    <span
                      className={`text-sm flex-shrink-0 ${
                        item.purchased ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {item.quantity}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
