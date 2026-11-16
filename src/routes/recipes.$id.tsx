import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, Heart, Printer, Share2, Users, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/PublicLayout";
import { RecipeCard } from "@/components/RecipeCard";
import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { fetchRecipe, fetchRelated, fetchReviews } from "@/lib/api";
import { asNutrition, asStringArray, totalTime } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recipes/$id")({
  head: () => ({
    meta: [
      { title: "Recipe — CookBook" },
      { name: "description", content: "Ingredients, steps, nutrition and reviews for this recipe on CookBook." },
      { property: "og:title", content: "Recipe — CookBook" },
      { property: "og:description", content: "Ingredients, steps, nutrition and reviews on CookBook." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RecipeDetail,
});

function RecipeDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();
  const { isFavorite, toggle, signedIn } = useFavorites();
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipe(id),
  });
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => fetchReviews(id),
  });
  const { data: related = [] } = useQuery({
    queryKey: ["related", id],
    queryFn: () => fetchRelated(recipe!),
    enabled: Boolean(recipe),
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in to leave a review");
      const { error } = await supabase
        .from("reviews")
        .upsert(
          { user_id: user.id, recipe_id: id, rating, review: text },
          { onConflict: "user_id,recipe_id" },
        );
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Thanks for the review!");
      setText("");
      qc.invalidateQueries({ queryKey: ["reviews", id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="mx-auto w-full max-w-5xl space-y-6 px-5 py-12">
          <Skeleton className="h-[380px] w-full rounded-[2rem]" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      </PublicLayout>
    );
  }

  if (!recipe) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-lg px-5 py-32 text-center">
          <h1 className="text-2xl font-bold">Recipe not found</h1>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/explore">Back to explore</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const ingredients = asStringArray(recipe.ingredients);
  const steps = asStringArray(recipe.steps);
  const nutrition = asNutrition(recipe.nutrition);
  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: recipe.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      /* dismissed */
    }
  };

  return (
    <PublicLayout>
      <article className="mx-auto w-full max-w-5xl px-5 py-10">
        <div className="relative overflow-hidden rounded-[2rem] shadow-lift">
          <img
            src={recipe.image ?? ""}
            alt={recipe.title}
            className="h-[300px] w-full object-cover sm:h-[440px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <Badge className="border-transparent bg-background/85 text-foreground backdrop-blur">
              {recipe.cuisine} · {recipe.category}
            </Badge>
            <h1 className="mt-4 text-3xl font-bold text-background drop-shadow sm:text-5xl dark:text-foreground">
              {recipe.title}
            </h1>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 no-print">
          <Button
            className="rounded-full"
            onClick={() => (signedIn ? toggle(recipe.id) : navigate({ to: "/auth" }))}
          >
            <Heart className={cn("size-4", isFavorite(recipe.id) && "fill-current")} />
            {isFavorite(recipe.id) ? "Saved" : "Save recipe"}
          </Button>
          <Button variant="outline" className="rounded-full bg-card" onClick={share}>
            <Share2 className="size-4" /> Share
          </Button>
          <Button
            variant="outline"
            className="rounded-full bg-card"
            onClick={() => window.print()}
          >
            <Printer className="size-4" /> Print
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <RatingStars value={average} />
            <span className="text-sm text-muted-foreground">
              {average ? average.toFixed(1) : "New"} ({reviews.length})
            </span>
          </div>
        </div>

        <p className="mt-6 text-lg text-muted-foreground">{recipe.description}</p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Prep", value: `${recipe.prep_time} min`, icon: Clock },
            { label: "Cook", value: `${recipe.cook_time} min`, icon: Clock },
            { label: "Total", value: `${totalTime(recipe)} min`, icon: Clock },
            { label: "Serves", value: `${recipe.servings}`, icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-3xl border border-border bg-card p-5 shadow-soft">
              <Icon className="size-4 text-primary" />
              <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
                {label}
              </p>
              <p className="text-lg font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[340px_1fr]">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-semibold">Ingredients</h2>
            <ul className="mt-4 space-y-3">
              {ingredients.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Checkbox
                    id={`ing-${i}`}
                    checked={Boolean(checked[i])}
                    onCheckedChange={(v) =>
                      setChecked((prev) => ({ ...prev, [i]: Boolean(v) }))
                    }
                    className="mt-0.5"
                  />
                  <label
                    htmlFor={`ing-${i}`}
                    className={cn(
                      "text-sm leading-relaxed",
                      checked[i] && "text-muted-foreground line-through",
                    )}
                  >
                    {item}
                  </label>
                </li>
              ))}
            </ul>

            <h2 className="mt-8 text-lg font-semibold">Nutrition</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {[
                ["Calories", nutrition.calories, "kcal"],
                ["Protein", nutrition.protein, "g"],
                ["Carbs", nutrition.carbs, "g"],
                ["Fat", nutrition.fat, "g"],
              ].map(([label, value, unit]) => (
                <div key={String(label)} className="rounded-2xl bg-muted p-3">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="font-semibold">
                    {value != null ? `${value} ${unit}` : "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold">
              <UtensilsCrossed className="size-4 text-primary" /> Method
            </h2>
            <ol className="mt-5 space-y-5">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/12 text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="pt-1 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section className="mt-16 no-print">
          <h2 className="text-2xl font-bold">Reviews</h2>

          {user ? (
            <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
              <RatingStars value={rating} onChange={setRating} size={22} />
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="How did it turn out?"
                className="mt-4 rounded-2xl"
                rows={3}
              />
              <Button
                className="mt-4 rounded-full"
                disabled={submitReview.isPending}
                onClick={() => submitReview.mutate()}
              >
                Post review
              </Button>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-border p-6 text-sm">
              <Link to="/auth" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>{" "}
              to leave a review.
            </div>
          )}

          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-3xl border border-border bg-card p-5">
                <RatingStars value={review.rating} />
                <p className="mt-3 text-sm">{review.review || "No comment left."}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No reviews yet — be the first.
              </p>
            )}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-16 no-print">
            <h2 className="text-2xl font-bold">More {recipe.cuisine} recipes</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <RecipeCard key={r.id} recipe={r} index={i} />
              ))}
            </div>
          </section>
        )}
      </article>
    </PublicLayout>
  );
}
