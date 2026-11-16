import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchProfile } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — CookBook" },
      { name: "description", content: "Your CookBook account details and cooking profile." },
      { property: "og:title", content: "Profile — CookBook" },
      { property: "og:description", content: "Manage your CookBook profile." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: Boolean(user),
  });

  return (
    <AppShell title="Profile" subtitle="Your account">
      <div className="flex max-w-xl items-center gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <Avatar className="size-16">
          <AvatarImage src={profile?.avatar ?? undefined} />
          <AvatarFallback className="bg-primary/15 text-primary">
            {(user?.email ?? "C").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">{profile?.name ?? "Home cook"}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
    </AppShell>
  );
}