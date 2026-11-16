import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChefHat, LayoutDashboard, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

const LINKS = [
  { to: "/explore", label: "Explore" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/planner", label: "Meal Planner" },
];

export function Navbar() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-5"
      >
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <ChefHat className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">CookBook</span>
        </Link>

        <div className="ml-4 hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "text-foreground bg-muted" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          {user ? (
            <Button
              onClick={() => navigate({ to: "/dashboard" })}
              className="hidden rounded-full sm:inline-flex"
            >
              <LayoutDashboard className="size-4" /> Dashboard
            </Button>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" className="rounded-full" asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button className="rounded-full" asChild>
                <Link to="/auth" search={{ mode: "signup" }}>
                  Get started
                </Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={user ? "/dashboard" : "/auth"}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              {user ? "Go to dashboard" : "Sign in"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}