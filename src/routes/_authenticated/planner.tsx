import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { MEAL_SLOTS } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/planner")({
  head: () => ({
    meta: [
      { title: "Meal planner — CookBook" },
      { name: "description", content: "Plan breakfast, lunch and dinner across the week." },
      { property: "og:title", content: "Meal planner — CookBook" },
      { property: "og:description", content: "Plan your week of meals with CookBook." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Planner,
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Planner() {
  return (
    <AppShell title="Meal planner" subtitle="Your week at a glance">
      <div className="grid gap-4 md:grid-cols-7">
        {DAYS.map((day) => (
          <div key={day} className="rounded-3xl border border-border bg-card p-4 shadow-soft">
            <p className="text-sm font-semibold">{day}</p>
            <div className="mt-3 space-y-2">
              {MEAL_SLOTS.map((slot) => (
                <div
                  key={slot}
                  className="rounded-2xl border border-dashed border-border p-3 text-xs text-muted-foreground"
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}