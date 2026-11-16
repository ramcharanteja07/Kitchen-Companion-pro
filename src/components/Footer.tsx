import { Link } from "@tanstack/react-router";
import { ChefHat } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <ChefHat className="size-5" />
            </span>
            <span className="text-lg font-bold">CookBook</span>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            Your virtual kitchen assistant — plan, cook and shop without the chaos.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Cook</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/explore" className="hover:text-foreground">
                Explore recipes
              </Link>
            </li>
            <li>
              <Link to="/planner" className="hover:text-foreground">
                Meal planner
              </Link>
            </li>
            <li>
              <Link to="/shopping" className="hover:text-foreground">
                Shopping list
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Account</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/favorites" className="hover:text-foreground">
                Favourites
              </Link>
            </li>
            <li>
              <Link to="/my-recipes" className="hover:text-foreground">
                My recipes
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">More</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/assistant" className="hover:text-foreground">
                AI assistant
              </Link>
            </li>
            <li>
              <Link to="/settings" className="hover:text-foreground">
                Settings
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-foreground">
                Sign in
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CookBook. Cooked with care.
      </div>
    </footer>
  );
}