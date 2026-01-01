"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { getDc } from "@/lib/firebase";
import { getMyProfile } from "@dataconnect/generated";
import { toast } from "sonner";

export default function DashboardPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Record<string, unknown>>(null);

    useEffect(() => {
        async function fetchProfile() {
            if (user) {
                try {
                    const { data } = await getMyProfile(getDc());
                    setProfile(data.user);
                } catch {
                    toast.error("Failed to load profile data");
                }
            }
        }
        fetchProfile();
    }, [user]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex flex-col space-y-1.5 ">
                        <h3 className="font-semibold leading-none tracking-tight">Welcome, {user?.displayName || "User"}</h3>
                        <p className="text-sm text-muted-foreground pt-1">
                            {profile?.email}
                        </p>
                    </div>
                    <div className="pt-4">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {profile?.role || "Member"}
                        </span>
                    </div>
                </div>

                {/* Placeholder cards for Phase 2 */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="font-semibold leading-none tracking-tight">Active Licenses</h3>
                    <div className="pt-4 text-3xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">None verified yet</p>
                </div>
            </div>
        </div>
    );
}
