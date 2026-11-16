import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeGridSkeleton } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";
import { fetchMyRecipes } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/my-recipes")({
  head: () => ({
    meta: [
      { title: "My recipes — CookBook" },
      { name: "description", content: "Recipes you have created and published on CookBook." },
      { property: "og:title", content: "My recipes — CookBook" },
      { property: "og:description", content: "Manage the recipes you created on CookBook." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MyRecipes,
});

function MyRecipes() {
  const { user } = useAuth();
  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ["my-recipes", user?.id],
    queryFn: () => fetchMyRecipes(user!.id),
    enabled: Boolean(user),
  });

  return (
    <AppShell
      title="My recipes"
      subtitle="Everything you've created"
      action={
        <Button asChild className="rounded-full">
          <Link to="/create">
            <Plus className="size-4" /> New recipe
          </Link>
        </Button>
      }
    >
      {isLoading ? (
        <RecipeGridSkeleton count={3} />
      ) : recipes.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center">
          <p className="font-semibold">No recipes yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Create your first recipe to see it here.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={i} />
          ))}
        </div>
      )}
    </AppShell>
  );
}