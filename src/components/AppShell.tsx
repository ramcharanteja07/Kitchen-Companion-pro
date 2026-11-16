import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  ChefHat,
  Compass,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Plus,
  Settings,
  ShoppingCart,
  Sparkles,
  Sun,
  User as UserIcon,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { PageTransition } from "./PageTransition";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/favorites", label: "Favourites", icon: Heart },
  { to: "/my-recipes", label: "My recipes", icon: UtensilsCrossed },
  { to: "/planner", label: "Meal planner", icon: CalendarDays },
  { to: "/shopping", label: "Shopping list", icon: ShoppingCart },
  { to: "/assistant", label: "AI assistant", icon: Sparkles },
] as const;

const ACCOUNT = [
  { to: "/profile", label: "Profile", icon: UserIcon },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Sections" className="flex flex-1 flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-foreground"
          activeProps={{
            className: "bg-primary/12 text-primary shadow-soft",
          }}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}

      <p className="mt-6 px-3.5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Account
      </p>
      {ACCOUNT.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-foreground"
          activeProps={{ className: "bg-primary/12 text-primary" }}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const initials = (user?.email ?? "C").slice(0, 2).toUpperCase();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5 lg:flex">
        <Link to="/" className="mb-8 flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <ChefHat className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">CookBook</span>
        </Link>

        <NavList />

        <Button asChild className="mt-4 w-full rounded-2xl">
          <Link to="/create">
            <Plus className="size-4" /> New recipe
          </Link>
        </Button>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-sidebar-border bg-card p-3">
          <Avatar className="size-9">
            <AvatarImage
              src={user?.user_metadata?.["avatar_url"] as string | undefined}
            />
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            aria-label="Sign out"
            className="size-8 rounded-xl"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-5 backdrop-blur-xl">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold">{title}</h1>
            {subtitle && (
              <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {action}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label="Toggle theme"
              className="rounded-full"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
        </header>

        <main className="flex-1 px-5 py-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-sidebar-border bg-sidebar p-5">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-lg font-bold">CookBook</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X className="size-5" />
              </Button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
            <Button variant="outline" className="mt-4 rounded-2xl" onClick={signOut}>
              <LogOut className="size-4" /> Sign out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}