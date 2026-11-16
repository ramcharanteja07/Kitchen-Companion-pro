import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, Heart, Users } from "lucide-react";
import type { Recipe } from "@/lib/types";
import { totalTime } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const FALLBACK =
  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&q=80";

export function RecipeCard({
  recipe,
  index = 0,
  isFavorite,
  onToggleFavorite,
}: {
  recipe: Recipe;
  index?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.06 }}
      className="group relative"
    >
      <Link
        to="/recipes/$id"
        params={{ id: recipe.id }}
        className="block overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={recipe.image || FALLBACK}
            alt={recipe.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-foreground/60 to-transparent opacity-70" />
          <Badge className="absolute left-3 top-3 border-transparent bg-background/85 text-foreground backdrop-blur-md">
            {recipe.category}
          </Badge>
          {!recipe.published && (
            <Badge className="absolute right-3 top-3 border-transparent bg-secondary text-secondary-foreground">
              Draft
            </Badge>
          )}
        </div>

        <div className="space-y-2 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {recipe.cuisine}
          </p>
          <h3 className="line-clamp-1 text-lg font-semibold">{recipe.title}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {recipe.description}
          </p>
          <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" /> {totalTime(recipe)} min
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" /> {recipe.servings}
            </span>
            <span className="ml-auto rounded-full bg-muted px-2.5 py-1 font-medium text-foreground">
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </Link>

      {onToggleFavorite && (
        <button
          type="button"
          aria-label={isFavorite ? "Remove from favourites" : "Save to favourites"}
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(recipe.id);
          }}
          className="glass absolute right-3 top-3 grid size-9 place-items-center rounded-full transition-transform hover:scale-110 active:scale-95"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              isFavorite ? "fill-primary text-primary" : "text-foreground",
            )}
          />
        </button>
      )}
    </motion.article>
  );
}