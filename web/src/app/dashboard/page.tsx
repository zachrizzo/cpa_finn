"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { getDc } from "@/lib/firebase";
import { getMyProfile, getMyLicenses, getDirectoryMatches, updateMatchStatus } from "@dataconnect/generated";
import { toast } from "sonner";

interface MatchRequest {
    id: string;
    np: { id: string; displayName?: string | null; email: string };
    physician: { id: string; displayName?: string | null; email: string };
    state: { stateCode: string; stateName: string };
    status: string;
    initiatedBy: string;
    createdAt: string;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
    const [licenseCount, setLicenseCount] = useState<number>(0);
    const [matchRequests, setMatchRequests] = useState<MatchRequest[]>([]);
    const [processingMatch, setProcessingMatch] = useState<string | null>(null);

    const fetchMatchRequests = async () => {
        if (user) {
            try {
                const matchesResult = await getDirectoryMatches(getDc(), { userId: user.uid });
                const pending = (matchesResult.data.directoryMatches || []).filter(
                    (m: MatchRequest) => m.status === "pending"
                );
                setMatchRequests(pending);
            } catch (error) {
                console.error("Failed to load match requests:", error);
            }
        }
    };

    useEffect(() => {
        async function fetchData() {
            if (user) {
                try {
                    const [profileResult, licensesResult] = await Promise.all([
                        getMyProfile(getDc()),
                        getMyLicenses(getDc()),
                    ]);
                    setProfile(profileResult.data.user ?? null);
                    setLicenseCount(licensesResult.data.licenses.length);

                    // Fetch match requests
                    await fetchMatchRequests();
                } catch {
                    toast.error("Failed to load profile data");
                }
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleAcceptMatch = async (matchId: string) => {
        setProcessingMatch(matchId);
        try {
            await updateMatchStatus(getDc(), {
                matchId: matchId as `${string}-${string}-${string}-${string}-${string}`,
                status: "accepted",
            });
            toast.success("Match request accepted!");
            await fetchMatchRequests();
        } catch (error) {
            console.error("Failed to accept match:", error);
            toast.error("Failed to accept match request");
        } finally {
            setProcessingMatch(null);
        }
    };

    const handleDeclineMatch = async (matchId: string) => {
        setProcessingMatch(matchId);
        try {
            await updateMatchStatus(getDc(), {
                matchId: matchId as `${string}-${string}-${string}-${string}-${string}`,
                status: "declined",
                declinedBy: user?.uid || "",
                declineReason: "User declined",
            });
            toast.success("Match request declined");
            await fetchMatchRequests();
        } catch (error) {
            console.error("Failed to decline match:", error);
            toast.error("Failed to decline match request");
        } finally {
            setProcessingMatch(null);
        }
    };

    // Determine which match requests are incoming (where I'm the target)
    const incomingRequests = matchRequests.filter((match) => {
        const role = profile?.role as string | undefined;
        if (!role) return false;
        // If I'm a physician and an NP initiated the match, it's incoming to me
        if (role.toLowerCase() === "physician" && match.initiatedBy === "np") return true;
        // If I'm an NP and a physician initiated the match, it's incoming to me
        if (role.toLowerCase() === "np" && match.initiatedBy === "physician") return true;
        return false;
    });

    // Outgoing requests are ones I initiated
    const outgoingRequests = matchRequests.filter((match) => {
        const role = profile?.role as string | undefined;
        if (!role) return false;
        if (role.toLowerCase() === "physician" && match.initiatedBy === "physician") return true;
        if (role.toLowerCase() === "np" && match.initiatedBy === "np") return true;
        return false;
    });

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
                            {profile?.email as string}
                        </p>
                    </div>
                    <div className="pt-4">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {(profile?.role as string) || "Member"}
                        </span>
                    </div>
                </div>

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="font-semibold leading-none tracking-tight">Active Licenses</h3>
                    <div className="pt-4 text-3xl font-bold">{licenseCount}</div>
                    <p className="text-xs text-muted-foreground">
                        {licenseCount === 0 ? "None verified yet" : `${licenseCount} license${licenseCount !== 1 ? "s" : ""} on file`}
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="font-semibold leading-none tracking-tight">Match Requests</h3>
                    <div className="pt-4 text-3xl font-bold">{incomingRequests.length}</div>
                    <p className="text-xs text-muted-foreground">
                        {incomingRequests.length === 0 ? "No pending requests" : `${incomingRequests.length} pending request${incomingRequests.length !== 1 ? "s" : ""}`}
                    </p>
                </div>
            </div>

            {/* Incoming Match Requests Section */}
            {incomingRequests.length > 0 && (
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Incoming Match Requests</h2>
                    <div className="space-y-4">
                        {incomingRequests.map((match) => {
                            const otherParty = match.initiatedBy === "np" ? match.np : match.physician;
                            return (
                                <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                                    <div>
                                        <p className="font-medium">{otherParty?.displayName || "Unknown User"}</p>
                                        <p className="text-sm text-gray-500">{otherParty?.email}</p>
                                        <p className="text-sm text-gray-500">
                                            State: {match.state?.stateName || "Unknown"} ({match.state?.stateCode})
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAcceptMatch(match.id)}
                                            disabled={processingMatch === match.id}
                                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processingMatch === match.id ? "Processing..." : "Accept"}
                                        </button>
                                        <button
                                            onClick={() => handleDeclineMatch(match.id)}
                                            disabled={processingMatch === match.id}
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Outgoing Match Requests Section */}
            {outgoingRequests.length > 0 && (
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Your Pending Match Requests</h2>
                    <div className="space-y-4">
                        {outgoingRequests.map((match) => {
                            const otherParty = match.initiatedBy === "np" ? match.physician : match.np;
                            return (
                                <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                                    <div>
                                        <p className="font-medium">{otherParty?.displayName || "Unknown User"}</p>
                                        <p className="text-sm text-gray-500">{otherParty?.email}</p>
                                        <p className="text-sm text-gray-500">
                                            State: {match.state?.stateName || "Unknown"} ({match.state?.stateCode})
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                        Awaiting Response
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
