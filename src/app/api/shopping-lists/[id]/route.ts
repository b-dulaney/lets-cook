import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { Json } from "@/types/database";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/shopping-lists/[id] - Get a single shopping list
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: shoppingList, error } = await supabase
    .from("shopping_lists")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !shoppingList) {
    return NextResponse.json(
      { error: "Shopping list not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ shoppingList });
}

// PUT /api/shopping-lists/[id] - Update a shopping list (e.g., mark items purchased)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { items } = body;

  if (!items) {
    return NextResponse.json(
      { error: "Items array is required" },
      { status: 400 }
    );
  }

  const { data: shoppingList, error } = await supabase
    .from("shopping_lists")
    .update({ items: items as Json })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating shopping list:", error);
    return NextResponse.json(
      { error: "Failed to update shopping list" },
      { status: 500 }
    );
  }

  if (!shoppingList) {
    return NextResponse.json(
      { error: "Shopping list not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ shoppingList });
}

// DELETE /api/shopping-lists/[id] - Delete a shopping list
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("shopping_lists")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting shopping list:", error);
    return NextResponse.json(
      { error: "Failed to delete shopping list" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
