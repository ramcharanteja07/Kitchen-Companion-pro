import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search recipes, ingredients or cuisines…",
  size = "md",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className={cn(
        "glass group flex items-center gap-3 rounded-full shadow-soft transition-shadow focus-within:shadow-lift",
        size === "lg" ? "px-5 py-3.5" : "px-4 py-2.5",
        className,
      )}
    >
      <Search
        className={cn(
          "shrink-0 text-muted-foreground transition-colors group-focus-within:text-primary",
          size === "lg" ? "size-5" : "size-4",
        )}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search recipes"
        className={cn(
          "w-full bg-transparent outline-none placeholder:text-muted-foreground",
          size === "lg" ? "text-base" : "text-sm",
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </form>
  );
}