import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeGridSkeleton } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";
import { fetchFavoriteRecipes, fetchMyRecipes } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CookBook" },
      { name: "description", content: "Your saved recipes, creations and cooking activity." },
      { property: "og:title", content: "Dashboard — CookBook" },
      { property: "og:description", content: "Your saved recipes and creations on CookBook." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: () => fetchFavoriteRecipes(user!.id),
    enabled: Boolean(user),
  });
  const { data: mine = [] } = useQuery({
    queryKey: ["my-recipes", user?.id],
    queryFn: () => fetchMyRecipes(user!.id),
    enabled: Boolean(user),
  });

  return (
    <AppShell
      title="Dashboard"
      subtitle={user?.email ?? ""}
      action={
        <Button asChild className="rounded-full">
          <Link to="/explore">Explore recipes</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "Saved recipes", value: favorites.length },
          { label: "My recipes", value: mine.length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-semibold">Recently saved</h2>
      {isLoading ? (
        <div className="mt-6">
          <RecipeGridSkeleton count={3} />
        </div>
      ) : favorites.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Nothing saved yet — browse the <Link to="/explore" className="text-primary hover:underline">explore page</Link>.
        </p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.slice(0, 6).map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={i} />
          ))}
        </div>
      )}
    </AppShell>
  );
}