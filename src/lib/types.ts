import type { Tables } from "@/integrations/supabase/types";

export type Recipe = Tables<"recipes">;
export type Profile = Tables<"profiles">;
export type Favorite = Tables<"favorites">;
export type Review = Tables<"reviews">;
export type MealPlan = Tables<"meal_plans">;
export type ShoppingItem = Tables<"shopping_lists">;
export type SearchEntry = Tables<"search_history">;

export const CUISINES = [
  "Italian",
  "Japanese",
  "Indian",
  "Mexican",
  "French",
  "Thai",
  "American",
  "Mediterranean",
  "International",
] as const;

export const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Salad",
  "Dessert",
  "Snack",
  "Drink",
] as const;

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export const MEAL_SLOTS = ["Breakfast", "Lunch", "Dinner"] as const;

export function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v));
  return [];
}

export type Nutrition = {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};

export function asNutrition(value: unknown): Nutrition {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Nutrition;
  }
  return {};
}

export function totalTime(recipe: Pick<Recipe, "prep_time" | "cook_time">) {
  return (recipe.prep_time ?? 0) + (recipe.cook_time ?? 0);
}