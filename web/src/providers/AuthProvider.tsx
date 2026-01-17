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

// Helper to set/remove the session cookie for middleware
// Returns false if token is invalid and user should be signed out
async function syncSessionCookie(user: User | null): Promise<boolean> {
  if (user) {
    try {
      const token = await user.getIdToken();
      // Set cookie with secure flags
      // Note: httpOnly can only be set server-side, but this works for middleware
      const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
      document.cookie = `__session=${token}; path=/; max-age=${60 * 60}; SameSite=Strict${secure}`;
      return true;
    } catch (error: unknown) {
      console.error("Failed to sync session cookie:", error);
      const firebaseError = error as { code?: string };
      if (
        firebaseError?.code === "auth/invalid-refresh-token" ||
        firebaseError?.code === "auth/user-token-expired" ||
        firebaseError?.code === "auth/user-disabled" ||
        firebaseError?.code === "auth/user-not-found"
      ) {
        return false; // Signal that user should be signed out
      }
    }
  } else {
    // Remove the cookie
    document.cookie = "__session=; path=/; max-age=0";
  }
  return true;
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
        // Token is invalid, sign out
        console.log("Invalid token on auth state change, signing out...");
        await auth.signOut();
        document.cookie = "__session=; path=/; max-age=0";
        window.location.href = "/login";
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
        // Token is invalid, sign out
        console.log("Invalid token on id token change, signing out...");
        await auth.signOut();
        document.cookie = "__session=; path=/; max-age=0";
        window.location.href = "/login";
      }
    });
    return () => unsubscribe();
  }, []);

  // Refresh token periodically to keep session alive (every 50 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        await user.getIdToken(true); // Force refresh
        await syncSessionCookie(user);
      } catch (error: unknown) {
        console.error("Token refresh failed:", error);
        // If refresh token is invalid/expired, sign the user out
        const firebaseError = error as { code?: string };
        if (
          firebaseError?.code === "auth/invalid-refresh-token" ||
          firebaseError?.code === "auth/user-token-expired" ||
          firebaseError?.code === "auth/user-disabled" ||
          firebaseError?.code === "auth/user-not-found"
        ) {
          console.log("Session expired, signing out...");
          await auth.signOut();
          document.cookie = "__session=; path=/; max-age=0";
          window.location.href = "/login";
        }
      }
    }, 50 * 60 * 1000); // 50 minutes

    return () => clearInterval(interval);
  }, [user]);

  const signOutUser = useCallback(async () => {
    await auth.signOut();
    document.cookie = "__session=; path=/; max-age=0";
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
