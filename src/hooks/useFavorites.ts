import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchFavoriteIds, toggleFavorite } from "@/lib/api";
import { useAuth } from "./useAuth";

export function useFavorites() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: ids = [] } = useQuery({
    queryKey: ["favorite-ids", user?.id],
    queryFn: () => fetchFavoriteIds(user!.id),
    enabled: Boolean(user),
  });

  const mutation = useMutation({
    mutationFn: async (recipeId: string) => {
      if (!user) throw new Error("Sign in to save recipes");
      return toggleFavorite(user.id, recipeId, ids.includes(recipeId));
    },
    onSuccess: (added) => {
      toast.success(added ? "Saved to favourites" : "Removed from favourites");
      qc.invalidateQueries({ queryKey: ["favorite-ids"] });
      qc.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    favoriteIds: ids,
    isFavorite: (id: string) => ids.includes(id),
    toggle: mutation.mutate,
    isPending: mutation.isPending,
    signedIn: Boolean(user),
  };
}