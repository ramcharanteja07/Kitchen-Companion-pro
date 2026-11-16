import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/PublicLayout";
import { SearchBar } from "@/components/SearchBar";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeGridSkeleton } from "@/components/Skeletons";
import { EMPTY_FILTERS, FilterPanel, type Filters } from "@/components/FilterPanel";
import { RECIPE_PAGE_SIZE, fetchRecipes, recordSearch } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  cuisine: z.string().optional(),
});

export const Route = createFileRoute("/explore")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Explore recipes — CookBook" },
      {
        name: "description",
        content:
          "Search recipes by name, ingredient, cuisine, category, cooking time and difficulty.",
      },
      { property: "og:title", content: "Explore recipes — CookBook" },
      {
        property: "og:description",
        content: "Search recipes by ingredient, cuisine, time and difficulty.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explore,
});

function Explore() {
  const initial = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggle, signedIn } = useFavorites();

  const [term, setTerm] = useState(initial.q ?? "");
  const [debounced, setDebounced] = useState(initial.q ?? "");
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    ...EMPTY_FILTERS,
    category: initial.category ?? "",
    cuisine: initial.cuisine ?? "",
  });

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(term);
      setPage(0);
    }, 300);
    return () => clearTimeout(id);
  }, [term]);

  const params = useMemo(
    () => ({
      q: debounced,
      cuisine: filters.cuisine,
      category: filters.category,
      difficulty: filters.difficulty,
      maxTime: filters.maxTime < 240 ? filters.maxTime : undefined,
    }),
    [debounced, filters],
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["recipes", params, page],
    queryFn: () => fetchRecipes(params, page),
    placeholderData: keepPreviousData,
  });

  const rows = data?.rows ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.count ?? 0) / RECIPE_PAGE_SIZE));

  const onFavorite = (id: string) => {
    if (!signedIn) {
      void navigate({ to: "/auth" });
      return;
    }
    toggle(id);
  };

  return (
    <PublicLayout>
      <div className="mx-auto w-full max-w-7xl px-5 py-12">
        <h1 className="text-4xl font-bold">Explore recipes</h1>
        <p className="mt-2 text-muted-foreground">
          Filter by ingredient, cuisine, time or difficulty — results update as you type.
        </p>

        <div className="mt-8 max-w-2xl">
          <SearchBar
            value={term}
            onChange={setTerm}
            size="lg"
            onSubmit={() => user && recordSearch(user.id, term)}
          />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <FilterPanel
            filters={filters}
            onChange={(f) => {
              setFilters(f);
              setPage(0);
            }}
          />

          <div>
            <p className="mb-5 text-sm text-muted-foreground">
              {isLoading ? "Searching…" : `${data?.count ?? 0} recipes found`}
            </p>

            {isLoading ? (
              <RecipeGridSkeleton count={6} />
            ) : rows.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-16 text-center">
                <p className="font-semibold">Nothing matched that</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a broader search or reset your filters.
                </p>
              </div>
            ) : (
              <div
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                style={{ opacity: isFetching ? 0.7 : 1 }}
              >
                {rows.map((recipe, i) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    index={i}
                    isFavorite={isFavorite(recipe.id)}
                    onToggleFavorite={onFavorite}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-full"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  className="rounded-full"
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
