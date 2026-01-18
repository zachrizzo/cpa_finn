"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { getDc } from "@/lib/firebase";
import { toast } from "sonner";

export interface UseProtectedDataOptions<T> {
  /** The async function to fetch data. Receives DataConnect instance. */
  fetcher: (dc: ReturnType<typeof getDc>) => Promise<T>;
  /** Error message to show in toast. Default: "Failed to load data" */
  errorMessage?: string;
  /** Whether to skip the initial fetch. Default: false */
  skip?: boolean;
  /** Dependencies that trigger refetch when changed */
  deps?: unknown[];
}

export interface UseProtectedDataResult<T> {
  /** The fetched data, or null if not yet loaded */
  data: T | null;
  /** True while auth is loading OR data is being fetched */
  loading: boolean;
  /** Error object if fetch failed */
  error: Error | null;
  /** The current user's ID, or null if not authenticated */
  userId: string | null;
  /** Manually refetch the data */
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching data that requires authentication.
 * Consolidates the auth check + loading state + error handling pattern.
 *
 * @example
 * const { data: profile, loading, refetch } = useProtectedData({
 *   fetcher: async (dc) => {
 *     const { data } = await getMyProfile(dc);
 *     return data.user;
 *   },
 *   errorMessage: "Failed to load profile",
 * });
 */
export function useProtectedData<T>({
  fetcher,
  errorMessage = "Failed to load data",
  skip = false,
  deps = [],
}: UseProtectedDataOptions<T>): UseProtectedDataResult<T> {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const userId = user?.uid ?? null;

  const fetchData = useCallback(async () => {
    // Don't fetch if auth is still loading or user is not authenticated
    if (authLoading || !user) {
      setLoading(authLoading);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher(getDc());
      setData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error(errorMessage, error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, errorMessage]);

  useEffect(() => {
    if (!skip) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, skip, ...deps]);

  return {
    data,
    loading: authLoading || loading,
    error,
    userId,
    refetch: fetchData,
  };
}
