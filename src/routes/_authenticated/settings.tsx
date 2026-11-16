import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/hooks/useTheme";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CookBook" },
      { name: "description", content: "Appearance and account settings for your CookBook profile." },
      { property: "og:title", content: "Settings — CookBook" },
      { property: "og:description", content: "Manage appearance and account settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <AppShell title="Settings" subtitle="Appearance and account">
      <div className="max-w-xl space-y-4">
        <div className="flex items-center justify-between rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div>
            <p className="font-semibold">Theme</p>
            <p className="text-sm text-muted-foreground">Currently {theme}</p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={toggle}>
            Switch theme
          </Button>
        </div>
        <div className="flex items-center justify-between rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div>
            <p className="font-semibold">Sign out</p>
            <p className="text-sm text-muted-foreground">End your session on this device</p>
          </div>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={async () => {
              await supabase.auth.signOut();
              void navigate({ to: "/" });
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    </AppShell>
  );
}