import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { ShoppingItem } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/shopping")({
  head: () => ({
    meta: [
      { title: "Shopping list — CookBook" },
      { name: "description", content: "Your consolidated grocery list built from planned recipes." },
      { property: "og:title", content: "Shopping list — CookBook" },
      { property: "og:description", content: "Track groceries for the recipes you plan to cook." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shopping,
});

function Shopping() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: ["shopping", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shopping_lists")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ShoppingItem[];
    },
    enabled: Boolean(user),
  });

  const toggle = async (item: ShoppingItem) => {
    await supabase
      .from("shopping_lists")
      .update({ completed: !item.completed })
      .eq("id", item.id);
    void qc.invalidateQueries({ queryKey: ["shopping"] });
  };

  return (
    <AppShell title="Shopping list" subtitle="Everything you need to buy">
      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center">
          <p className="font-semibold">Your list is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add recipes to your planner to build a list.
          </p>
        </div>
      ) : (
        <ul className="max-w-2xl space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <Checkbox checked={Boolean(item.completed)} onCheckedChange={() => toggle(item)} />
              <span className={item.completed ? "text-muted-foreground line-through" : ""}>
                {item.item}
              </span>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}