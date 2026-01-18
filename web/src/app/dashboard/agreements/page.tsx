"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import { getMyAgreements } from "@dataconnect/generated";
import { useProtectedData } from "@/hooks";
import { PageHeader, Button, FilterTabs, EmptyState, LoadingState, StatusBadge } from "@/components";
import { getAgreementBadgeProps } from "@/components/StatusBadge";
import { formatDate } from "@/lib/format";

interface Agreement {
  id: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  boardFilingDate: string | null;
  boardApprovalDate: string | null;
  terminationDate: string | null;
  terminationReason: string | null;
  docusignUrl: string | null;
  npLicense: {
    id: string;
    licenseNumber: string;
    licenseType: string;
    user: {
      id: string;
      displayName: string | null;
      email: string;
    };
  };
  physicianLicense: {
    id: string;
    licenseNumber: string;
    licenseType: string;
    user: {
      id: string;
      displayName: string | null;
      email: string;
    };
  };
  state: {
    id: string;
    stateCode: string;
    stateName: string;
    cpaRequired: boolean | null;
    physicianNpRatio: string | null;
    chartReviewFrequency: string | null;
    chartReviewPercentage: number | null;
    qaMeetingFrequency: string | null;
    cpaRenewalFrequency: string | null;
    boardFilingRequired: boolean | null;
    complianceNotes: string | null;
  };
}

type FilterKey = "all" | "active" | "pending" | "terminated";

function getFilteredAgreements(agreements: Agreement[], filter: FilterKey): Agreement[] {
  switch (filter) {
    case "active":
      return agreements.filter(a => a.isActive && a.status !== "terminated");
    case "pending":
      return agreements.filter(a => a.status === "pending_signatures" || a.status === "draft");
    case "terminated":
      return agreements.filter(a => a.status === "terminated");
    default:
      return agreements;
  }
}

function getOtherParty(agreement: Agreement, currentUserId: string | null) {
  if (!currentUserId) return null;
  if (agreement.npLicense.user.id === currentUserId) {
    return {
      name: agreement.physicianLicense.user.displayName || agreement.physicianLicense.user.email,
      role: "Physician",
    };
  }
  return {
    name: agreement.npLicense.user.displayName || agreement.npLicense.user.email,
    role: "Nurse Practitioner",
  };
}

export default function AgreementsPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const router = useRouter();

  const { data, loading, userId } = useProtectedData({
    fetcher: async (dc) => {
      const { data } = await getMyAgreements(dc);
      return data.collaborationAgreements as Agreement[];
    },
    errorMessage: "Failed to load agreements",
  });

  const agreements = data ?? [];

  const filteredAgreements = useMemo(
    () => getFilteredAgreements(agreements, filter),
    [agreements, filter]
  );

  const filterTabs = useMemo(() => [
    { key: "all", label: "All Agreements", count: agreements.length },
    { key: "active", label: "Active", count: getFilteredAgreements(agreements, "active").length },
    { key: "pending", label: "Pending", count: getFilteredAgreements(agreements, "pending").length },
    { key: "terminated", label: "Terminated", count: getFilteredAgreements(agreements, "terminated").length },
  ], [agreements]);

  function handleNewAgreement(): void {
    router.push("/dashboard/agreements/create");
  }

  const emptyMessage = filter === "all"
    ? "Get started by creating your first collaboration agreement"
    : `No ${filter} agreements at this time`;

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Collaboration Agreements"
          actions={
            <Button icon={Plus} onClick={handleNewAgreement}>
              New Agreement
            </Button>
          }
        />
        <LoadingState message="Loading agreements..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Collaboration Agreements"
        actions={
          <Button icon={Plus} onClick={handleNewAgreement}>
            New Agreement
          </Button>
        }
      />

      <FilterTabs
        tabs={filterTabs}
        activeTab={filter}
        onTabChange={(key) => setFilter(key as FilterKey)}
      />

      <div className="rounded-md border bg-white shadow-sm">
        {filteredAgreements.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No agreements found"
            description={emptyMessage}
            action={filter === "all" ? {
              label: "New Agreement",
              onClick: handleNewAgreement,
              icon: Plus,
            } : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Collaborating With
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredAgreements.map((agreement) => {
                  const otherParty = getOtherParty(agreement, userId);
                  return (
                    <tr key={agreement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{otherParty?.name}</div>
                          <div className="text-xs text-gray-500">{otherParty?.role}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{agreement.state.stateCode}</div>
                        <div className="text-xs text-gray-500">{agreement.state.stateName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge {...getAgreementBadgeProps(agreement.status, agreement.isActive)} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(agreement.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/dashboard/agreements/${agreement.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
