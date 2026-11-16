import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/assistant")({
  head: () => ({
    meta: [
      { title: "AI assistant — CookBook" },
      { name: "description", content: "Get recipe ideas from the ingredients you already have." },
      { property: "og:title", content: "AI assistant — CookBook" },
      { property: "og:description", content: "Ask cooking questions and get ingredient-based ideas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Assistant,
});

function Assistant() {
  const [input, setInput] = useState("");

  return (
    <AppShell title="AI assistant" subtitle="Cook with what you have">
      <div className="max-w-2xl space-y-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <p className="inline-flex items-center gap-2 text-sm font-medium">
          <Sparkles className="size-4 text-primary" /> List your ingredients
        </p>
        <Textarea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="eggs, spinach, feta, sourdough…"
          className="rounded-2xl"
        />
        <Button className="rounded-full" disabled>
          Suggest recipes (coming soon)
        </Button>
      </div>
    </AppShell>
  );
}