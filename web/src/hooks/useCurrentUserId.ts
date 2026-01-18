import { useAuth } from "@/providers/AuthProvider";

/**
 * Hook to get the current authenticated user's ID
 * Uses the AuthProvider context for consistent auth state
 */
export function useCurrentUserId(): string | null {
  const { user } = useAuth();
  return user?.uid ?? null;
}
