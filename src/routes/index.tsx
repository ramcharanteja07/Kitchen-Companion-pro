import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Flame,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/hero-table.jpg";
import { PublicLayout } from "@/components/PublicLayout";
import { SearchBar } from "@/components/SearchBar";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeGridSkeleton } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { fetchFeatured } from "@/lib/api";
import { CATEGORIES } from "@/lib/types";
import { useFavorites } from "@/hooks/useFavorites";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CookBook — Your Virtual Kitchen Assistant" },
      {
        name: "description",
        content:
          "Find recipes by ingredient, plan your week and generate shopping lists automatically. CookBook is the calm, beautiful way to cook.",
      },
      { property: "og:title", content: "CookBook — Your Virtual Kitchen Assistant" },
      {
        property: "og:description",
        content:
          "Find recipes by ingredient, plan your week and generate shopping lists automatically.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TESTIMONIALS = [
  {
    quote:
      "I stopped ordering takeaway three nights a week. The planner just tells me what to cook.",
    name: "Maya Chen",
    role: "Weeknight cook",
  },
  {
    quote:
      "The auto-generated shopping list is the feature I didn't know I desperately needed.",
    name: "Tom Okafor",
    role: "Dad of three",
  },
  {
    quote:
      "Finally a recipe app that looks like it was designed by someone who actually cooks.",
    name: "Sofia Marchetti",
    role: "Pastry chef",
  },
];

const FAQS = [
  {
    q: "Is CookBook free to use?",
    a: "Yes. Creating an account, saving recipes, planning meals and building shopping lists are all free.",
  },
  {
    q: "Can I add my own recipes?",
    a: "Absolutely. Write your own recipes with photos, ingredients and step-by-step instructions, keep them private as drafts, and publish when you're ready.",
  },
  {
    q: "How does the shopping list work?",
    a: "Pick the recipes you plan to cook and CookBook merges every ingredient into one list you can tick off as you shop.",
  },
  {
    q: "What does the AI assistant do?",
    a: "Tell it what's in your fridge and it suggests what to cook, or ask it any cooking question — techniques, swaps, timings.",
  },
];

function Index() {
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { isFavorite, toggle, signedIn } = useFavorites();

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["featured"],
    queryFn: () => fetchFeatured(9),
  });

  const featured = recipes?.slice(0, 3) ?? [];
  const trending = recipes?.slice(3, 6) ?? [];
  const recommended = recipes?.slice(6, 9) ?? [];

  const search = () => navigate({ to: "/explore", search: { q: query || undefined } });

  const onFavorite = (id: string) => {
    if (!signedIn) {
      navigate({ to: "/auth" });
      return;
    }
    toggle(id);
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-mesh">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
            >
              <Sparkles className="size-3.5 text-primary" />
              Your virtual kitchen assistant
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-6 text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl"
            >
              Cook something<br />
              <span className="text-gradient">worth the table.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-6 max-w-lg text-lg text-muted-foreground"
            >
              Search thousands of recipes by ingredient, plan your whole week in
              minutes and walk into the shop with a list that already knows what you
              need.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-8 max-w-xl"
            >
              <SearchBar
                value={query}
                onChange={setQuery}
                onSubmit={search}
                size="lg"
                placeholder="Try “chicken”, “miso” or “30 minute dinner”…"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <Button size="lg" className="rounded-full" onClick={search}>
                  Find a recipe <ArrowRight className="size-4" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-full bg-card" asChild>
                  <Link to="/auth" search={{ mode: "signup" }}>
                    Create free account
                  </Link>
                </Button>
              </div>
            </motion.div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              {["No ads", "Free forever", "Works offline-friendly"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-accent" /> {item}
                </span>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: -1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[2.5rem] shadow-glow">
              <img
                src={heroImage}
                alt="A wooden table filled with fresh pasta, roasted vegetables, herbs and bread"
                width={1600}
                height={1200}
                className="h-full w-full object-cover"
              />
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="glass absolute -bottom-6 -left-4 hidden rounded-3xl p-4 shadow-lift sm:block"
            >
              <p className="text-xs text-muted-foreground">This week planned</p>
              <p className="mt-1 text-2xl font-bold">14 meals</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="glass absolute -right-4 top-8 hidden rounded-3xl p-4 shadow-lift sm:block"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Loved by 12k cooks</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      <Section
        eyebrow="Featured"
        title="Hand-picked this week"
        description="Dishes our community keeps coming back to."
        icon={<Star className="size-4" />}
      >
        {isLoading ? (
          <RecipeGridSkeleton count={3} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((recipe, i) => (
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
      </Section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-7xl px-5 py-8">
        <h2 className="text-2xl font-bold">Popular categories</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {CATEGORIES.map((category, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to="/explore"
                search={{ category }}
                className="block rounded-2xl border border-border bg-card px-6 py-4 text-sm font-semibold shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
              >
                {category}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending */}
      <Section
        eyebrow="Trending"
        title="What everyone is cooking"
        description="The most saved recipes right now."
        icon={<TrendingUp className="size-4" />}
      >
        {isLoading ? (
          <RecipeGridSkeleton count={3} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((recipe, i) => (
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
      </Section>

      {/* Feature strip */}
      <section className="mx-auto w-full max-w-7xl px-5 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: CalendarDays,
              title: "Plan the whole week",
              body: "Drop recipes onto a calendar and see breakfast, lunch and dinner at a glance.",
            },
            {
              icon: ShoppingCart,
              title: "Shop without thinking",
              body: "Every ingredient from your chosen recipes merges into a single tickable list.",
            },
            {
              icon: Sparkles,
              title: "Ask the assistant",
              body: "Type what's in your fridge and get dinner ideas that actually use it up.",
            },
          ].map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-3xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recommended */}
      <Section
        eyebrow="Recommended"
        title="Because you like bold flavour"
        description="A few more we think you'll enjoy."
        icon={<Flame className="size-4" />}
      >
        {isLoading ? (
          <RecipeGridSkeleton count={3} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((recipe, i) => (
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
      </Section>

      {/* Testimonials */}
      <section className="mx-auto w-full max-w-7xl px-5 py-16">
        <h2 className="text-3xl font-bold">Cooks who stuck with it</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-3xl border border-border bg-card p-7 shadow-soft"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="size-4 fill-secondary text-secondary" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold">{t.name}</span>
                <span className="block text-xs text-muted-foreground">{t.role}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-3xl px-5 py-16">
        <h2 className="text-center text-3xl font-bold">Questions, answered</h2>
        <Accordion type="single" collapsible className="mt-8">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q} className="border-border">
              <AccordionTrigger className="text-left text-base font-semibold">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Newsletter */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-hero-mesh p-10 text-center shadow-lift sm:p-16">
          <h2 className="text-3xl font-bold sm:text-4xl">One good recipe, every Sunday</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            A short weekly note with a seasonal recipe and a technique worth learning.
          </p>
          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.trim()) return;
              setEmail("");
              toast.success("You're on the list. See you Sunday!");
            }}
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@kitchen.com"
              aria-label="Email address"
              className="h-12 rounded-full bg-card px-5"
            />
            <Button type="submit" size="lg" className="rounded-full">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}

function Section({
  eyebrow,
  title,
  description,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {icon}
            {eyebrow}
          </span>
          <h2 className="mt-3 text-3xl font-bold">{title}</h2>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
        <Button variant="ghost" className="rounded-full" asChild>
          <Link to="/explore">
            View all <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      {children}
    </section>
  );
}
