"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { getDc } from "@/lib/firebase";
import { getMyProfile, getMyLicenses, getDirectoryMatches, updateMatchStatus } from "@dataconnect/generated";
import { toast } from "sonner";
import { pluralize } from "@/lib/format";
import { useProtectedData } from "@/hooks";
import type { MatchRequest } from "@/types";

interface DashboardProfile {
  email: string;
  role?: string | null;
}

interface DashboardData {
  profile: DashboardProfile | null;
  licenseCount: number;
  matchRequests: MatchRequest[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [processingMatch, setProcessingMatch] = useState<string | null>(null);

  const { data, refetch } = useProtectedData<DashboardData>({
    fetcher: async (dc) => {
      const [profileResult, licensesResult, matchesResult] = await Promise.all([
        getMyProfile(dc),
        getMyLicenses(dc),
        getDirectoryMatches(dc, { userId: user!.uid }),
      ]);

      const pending = (matchesResult.data.directoryMatches || []).filter(
        (m: MatchRequest) => m.status === "pending"
      );

      return {
        profile: profileResult.data.user as DashboardProfile ?? null,
        licenseCount: licensesResult.data.licenses.length,
        matchRequests: pending,
      };
    },
    errorMessage: "Failed to load profile data",
  });

  const profile = data?.profile ?? null;
  const licenseCount = data?.licenseCount ?? 0;
  const matchRequests = data?.matchRequests ?? [];

  async function handleAcceptMatch(matchId: string): Promise<void> {
    setProcessingMatch(matchId);
    try {
      await updateMatchStatus(getDc(), {
        matchId: matchId as `${string}-${string}-${string}-${string}-${string}`,
        status: "accepted",
      });
      toast.success("Match request accepted!");
      await refetch();
    } catch (error) {
      console.error("Failed to accept match:", error);
      toast.error("Failed to accept match request");
    } finally {
      setProcessingMatch(null);
    }
  }

  async function handleDeclineMatch(matchId: string): Promise<void> {
    setProcessingMatch(matchId);
    try {
      await updateMatchStatus(getDc(), {
        matchId: matchId as `${string}-${string}-${string}-${string}-${string}`,
        status: "declined",
        declinedBy: user?.uid || "",
        declineReason: "User declined",
      });
      toast.success("Match request declined");
      await refetch();
    } catch (error) {
      console.error("Failed to decline match:", error);
      toast.error("Failed to decline match request");
    } finally {
      setProcessingMatch(null);
    }
  }

  const userRole = profile?.role?.toLowerCase();
  const incomingRequests = matchRequests.filter((match) => userRole && userRole !== match.initiatedBy);
  const outgoingRequests = matchRequests.filter((match) => userRole && userRole === match.initiatedBy);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title={`Welcome, ${user?.displayName || "User"}`}
          subtitle={profile?.email}
          badge={profile?.role || "Member"}
        />
        <StatCard
          title="Active Licenses"
          value={licenseCount}
          subtitle={licenseCount === 0 ? "None verified yet" : `${licenseCount} ${pluralize(licenseCount, "license")} on file`}
        />
        <StatCard
          title="Match Requests"
          value={incomingRequests.length}
          subtitle={incomingRequests.length === 0 ? "No pending requests" : `${incomingRequests.length} pending ${pluralize(incomingRequests.length, "request")}`}
        />
      </div>

      {incomingRequests.length > 0 && (
        <MatchRequestsSection
          title="Incoming Match Requests"
          requests={incomingRequests}
          processingMatch={processingMatch}
          onAccept={handleAcceptMatch}
          onDecline={handleDeclineMatch}
          showActions
        />
      )}

      {outgoingRequests.length > 0 && (
        <MatchRequestsSection
          title="Your Pending Match Requests"
          requests={outgoingRequests}
          processingMatch={processingMatch}
        />
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value?: number;
  subtitle?: string;
  badge?: string;
}

function StatCard({ title, value, subtitle, badge }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
      {value !== undefined && <div className="pt-4 text-3xl font-bold">{value}</div>}
      {subtitle && <p className="text-sm text-muted-foreground pt-1">{subtitle}</p>}
      {badge && (
        <div className="pt-4">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}

interface MatchRequestsSectionProps {
  title: string;
  requests: MatchRequest[];
  processingMatch: string | null;
  onAccept?: (matchId: string) => void;
  onDecline?: (matchId: string) => void;
  showActions?: boolean;
}

function MatchRequestsSection({
  title,
  requests,
  processingMatch,
  onAccept,
  onDecline,
  showActions = false,
}: MatchRequestsSectionProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {requests.map((match) => {
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
              {showActions && onAccept && onDecline ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => onAccept(match.id)}
                    disabled={processingMatch === match.id}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingMatch === match.id ? "Processing..." : "Accept"}
                  </button>
                  <button
                    onClick={() => onDecline(match.id)}
                    disabled={processingMatch === match.id}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Decline
                  </button>
                </div>
              ) : (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                  Awaiting Response
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
