"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
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
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (!currentUser && !window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/register")) {
                // Optionally redirect to login here, or handle in Middleware
                // router.push("/login");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const signOutUser = async () => {
        await auth.signOut();
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut: signOutUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
