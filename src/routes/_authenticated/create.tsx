import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/create")({
  head: () => ({
    meta: [
      { title: "New recipe — CookBook" },
      { name: "description", content: "Write up a new recipe with ingredients, steps and timings." },
      { property: "og:title", content: "New recipe — CookBook" },
      { property: "og:description", content: "Publish your own recipe on CookBook." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreateRecipe,
});

function CreateRecipe() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    cuisine: "International",
    category: "Dinner",
    difficulty: "Easy",
    prep_time: 10,
    cook_time: 20,
    servings: 2,
    image: "",
    ingredients: "",
    steps: "",
  });

  const save = async () => {
    if (!user || !form.title.trim()) {
      toast.error("A title is required");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("recipes").insert({
      created_by: user.id,
      title: form.title,
      description: form.description,
      cuisine: form.cuisine,
      category: form.category,
      difficulty: form.difficulty,
      prep_time: Number(form.prep_time),
      cook_time: Number(form.cook_time),
      servings: Number(form.servings),
      image: form.image || null,
      ingredients: form.ingredients.split("\n").filter(Boolean),
      steps: form.steps.split("\n").filter(Boolean),
      published: true,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Recipe published");
    void navigate({ to: "/my-recipes" });
  };

  const field = (key: keyof typeof form, label: string, type = "text") => (
    <div className="space-y-2">
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        type={type}
        value={String(form[key])}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="rounded-2xl"
      />
    </div>
  );

  return (
    <AppShell title="New recipe" subtitle="Share what you're cooking">
      <div className="max-w-3xl space-y-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
        {field("title", "Title")}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-2xl"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {field("cuisine", "Cuisine")}
          {field("category", "Category")}
          {field("difficulty", "Difficulty")}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {field("prep_time", "Prep (min)", "number")}
          {field("cook_time", "Cook (min)", "number")}
          {field("servings", "Servings", "number")}
        </div>
        {field("image", "Image URL")}
        <div className="space-y-2">
          <Label htmlFor="ingredients">Ingredients (one per line)</Label>
          <Textarea
            id="ingredients"
            rows={6}
            value={form.ingredients}
            onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
            className="rounded-2xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="steps">Steps (one per line)</Label>
          <Textarea
            id="steps"
            rows={6}
            value={form.steps}
            onChange={(e) => setForm({ ...form, steps: e.target.value })}
            className="rounded-2xl"
          />
        </div>
        <Button className="rounded-full" disabled={saving} onClick={save}>
          {saving ? "Publishing…" : "Publish recipe"}
        </Button>
      </div>
    </AppShell>
  );
}