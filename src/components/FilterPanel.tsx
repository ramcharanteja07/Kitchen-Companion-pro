import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CATEGORIES, CUISINES, DIFFICULTIES } from "@/lib/types";
import { cn } from "@/lib/utils";

export type Filters = {
  cuisine: string;
  category: string;
  difficulty: string;
  maxTime: number;
};

export const EMPTY_FILTERS: Filters = {
  cuisine: "",
  category: "",
  difficulty: "",
  maxTime: 240,
};

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95",
        active
          ? "border-transparent bg-primary text-primary-foreground shadow-soft"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function FilterPanel({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  const dirty =
    filters.cuisine || filters.category || filters.difficulty || filters.maxTime < 240;

  return (
    <aside className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="size-4 text-primary" /> Filters
        </h2>
        {dirty ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onChange(EMPTY_FILTERS)}
          >
            Reset
          </Button>
        ) : null}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              active={filters.category === c}
              onClick={() => set("category", filters.category === c ? "" : c)}
            >
              {c}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Cuisine
        </p>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <Chip
              key={c}
              active={filters.cuisine === c}
              onClick={() => set("cuisine", filters.cuisine === c ? "" : c)}
            >
              {c}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Difficulty
        </p>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((d) => (
            <Chip
              key={d}
              active={filters.difficulty === d}
              onClick={() => set("difficulty", filters.difficulty === d ? "" : d)}
            >
              {d}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Total time
          </p>
          <span className="text-xs font-medium text-foreground">
            {filters.maxTime >= 240 ? "Any" : `≤ ${filters.maxTime} min`}
          </span>
        </div>
        <Slider
          value={[filters.maxTime]}
          min={10}
          max={240}
          step={10}
          onValueChange={(vals) => set("maxTime", vals[0] ?? 240)}
          aria-label="Maximum total time in minutes"
        />
      </div>
    </aside>
  );
}