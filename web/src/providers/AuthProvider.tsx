"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

const INVALID_TOKEN_ERROR_CODES = new Set([
  "auth/invalid-refresh-token",
  "auth/user-token-expired",
  "auth/user-disabled",
  "auth/user-not-found",
]);

function isInvalidTokenError(error: unknown): boolean {
  const code = (error as { code?: string })?.code;
  return code ? INVALID_TOKEN_ERROR_CODES.has(code) : false;
}

function clearSessionCookie(): void {
  document.cookie = "__session=; path=/; max-age=0";
}

async function forceSignOutAndRedirect(): Promise<void> {
  await auth.signOut();
  clearSessionCookie();
  window.location.href = "/login";
}

// Helper to set/remove the session cookie for middleware
// Returns false if token is invalid and user should be signed out
async function syncSessionCookie(user: User | null): Promise<boolean> {
  if (!user) {
    clearSessionCookie();
    return true;
  }

  try {
    const token = await user.getIdToken();
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    document.cookie = `__session=${token}; path=/; max-age=${60 * 60}; SameSite=Strict${secure}`;
    return true;
  } catch (error: unknown) {
    console.error("Failed to sync session cookie:", error);
    return !isInvalidTokenError(error);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      const valid = await syncSessionCookie(currentUser);
      if (!valid && currentUser) {
        console.log("Invalid token on auth state change, signing out...");
        await forceSignOutAndRedirect();
        return;
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen for token changes (e.g., token refresh) and update cookie
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      const valid = await syncSessionCookie(currentUser);
      if (!valid && currentUser) {
        console.log("Invalid token on id token change, signing out...");
        await forceSignOutAndRedirect();
      }
    });
    return () => unsubscribe();
  }, []);

  // Refresh token periodically to keep session alive (every 50 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        await user.getIdToken(true);
        await syncSessionCookie(user);
      } catch (error: unknown) {
        console.error("Token refresh failed:", error);
        if (isInvalidTokenError(error)) {
          console.log("Session expired, signing out...");
          await forceSignOutAndRedirect();
        }
      }
    }, 50 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  const signOutUser = useCallback(async () => {
    await auth.signOut();
    clearSessionCookie();
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
