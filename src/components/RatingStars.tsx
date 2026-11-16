import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  value,
  onChange,
  size = 16,
  className,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        const Wrapper = onChange ? "button" : "span";
        return (
          <Wrapper
            key={star}
            {...(onChange
              ? {
                  type: "button" as const,
                  onClick: () => onChange(star),
                  "aria-label": `Rate ${star} out of 5`,
                  className:
                    "transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
                }
              : {})}
          >
            <Star
              width={size}
              height={size}
              className={cn(
                "transition-colors",
                filled
                  ? "fill-secondary text-secondary"
                  : "text-muted-foreground/40",
              )}
            />
          </Wrapper>
        );
      })}
    </div>
  );
}