import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeGridSkeleton } from "@/components/Skeletons";
import { fetchFavoriteRecipes } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";

export const Route = createFileRoute("/_authenticated/favorites")({
  head: () => ({
    meta: [
      { title: "Favourites — CookBook" },
      { name: "description", content: "Every recipe you have saved to your CookBook favourites." },
      { property: "og:title", content: "Favourites — CookBook" },
      { property: "og:description", content: "Your saved CookBook recipes in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Favorites,
});

function Favorites() {
  const { user } = useAuth();
  const { isFavorite, toggle } = useFavorites();
  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: () => fetchFavoriteRecipes(user!.id),
    enabled: Boolean(user),
  });

  return (
    <AppShell title="Favourites" subtitle="Recipes you saved for later">
      {isLoading ? (
        <RecipeGridSkeleton count={6} />
      ) : recipes.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center">
          <p className="font-semibold">No favourites yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Tap the heart on any recipe to save it.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe, i) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              index={i}
              isFavorite={isFavorite(recipe.id)}
              onToggleFavorite={toggle}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}