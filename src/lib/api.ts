import { supabase } from "@/integrations/supabase/client";
import type { Recipe } from "./types";

export type RecipeFilters = {
  q?: string | undefined;
  cuisine?: string | undefined;
  category?: string | undefined;
  difficulty?: string | undefined;
  maxTime?: number | undefined;
};

export const RECIPE_PAGE_SIZE = 9;

export async function fetchRecipes(filters: RecipeFilters, page = 0) {
  let query = supabase
    .from("recipes")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (filters.cuisine) query = query.eq("cuisine", filters.cuisine);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.difficulty) query = query.eq("difficulty", filters.difficulty);

  const term = filters.q?.trim();
  if (term) {
    const like = `%${term}%`;
    query = query.or(
      `title.ilike.${like},description.ilike.${like},cuisine.ilike.${like},category.ilike.${like},ingredients.cs.["${term}"]`,
    );
  }

  const { data, error, count } = await query.range(
    page * RECIPE_PAGE_SIZE,
    page * RECIPE_PAGE_SIZE + RECIPE_PAGE_SIZE - 1,
  );
  if (error) throw error;

  let rows = (data ?? []) as Recipe[];
  if (filters.maxTime && filters.maxTime > 0) {
    rows = rows.filter((r) => r.prep_time + r.cook_time <= filters.maxTime!);
  }
  return { rows, count: count ?? 0 };
}

export async function fetchFeatured(limit = 6) {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Recipe[];
}

export async function fetchRecipe(id: string) {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Recipe | null;
}

export async function fetchRelated(recipe: Recipe) {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("published", true)
    .eq("cuisine", recipe.cuisine)
    .neq("id", recipe.id)
    .limit(3);
  if (error) throw error;
  return (data ?? []) as Recipe[];
}

export async function fetchReviews(recipeId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchFavoriteIds(userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select("recipe_id")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((r) => r.recipe_id);
}

export async function fetchFavoriteRecipes(userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select("recipe_id, created_at, recipes(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? [])
    .map((row) => row.recipes as Recipe | null)
    .filter((r): r is Recipe => Boolean(r));
}

export async function toggleFavorite(
  userId: string,
  recipeId: string,
  isFavorite: boolean,
) {
  if (isFavorite) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("recipe_id", recipeId);
    if (error) throw error;
    return false;
  }
  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, recipe_id: recipeId });
  if (error) throw error;
  return true;
}

export async function recordSearch(userId: string, query: string) {
  const term = query.trim();
  if (!term) return;
  await supabase.from("search_history").insert({ user_id: userId, query: term });
}

export async function fetchSearchHistory(userId: string) {
  const { data, error } = await supabase
    .from("search_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(8);
  if (error) throw error;
  return data ?? [];
}

export async function fetchMyRecipes(userId: string) {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("created_by", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Recipe[];
}

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function uploadRecipeImage(userId: string, file: File) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("recipe-images")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  const { data, error: signError } = await supabase.storage
    .from("recipe-images")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
  if (signError) throw signError;
  return data.signedUrl;
}