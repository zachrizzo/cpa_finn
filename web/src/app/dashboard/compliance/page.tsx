"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardCheck, Calendar, FileCheck, AlertCircle, TrendingUp } from "lucide-react";
import { getMyAgreements } from "@dataconnect/generated";
import { useProtectedData } from "@/hooks";
import { StatusBadge, LoadingState, MetricCard, QuickActionCard } from "@/components";
import { getComplianceBadgeProps } from "@/components/StatusBadge";
import type { ComplianceData, ComplianceStatus } from "@/types";

interface ComplianceAgreement {
  id: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  boardApprovalDate: string | null;
  npLicense: {
    user: {
      id: string;
      displayName: string | null;
      email: string;
    };
  };
  physicianLicense: {
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
    chartReviewFrequency: string | null;
    chartReviewPercentage: number | null;
    qaMeetingFrequency: string | null;
    cpaRenewalFrequency: string | null;
    complianceNotes: string | null;
  };
}

export default function CompliancePage() {
  const router = useRouter();

  const { data, loading, userId } = useProtectedData({
    fetcher: async (dc) => {
      const { data } = await getMyAgreements(dc);
      const activeAgreements = data.collaborationAgreements.filter(
        (a: { isActive?: boolean; status?: string }) => a.isActive && a.status === "active"
      ) as unknown as ComplianceAgreement[];
      return activeAgreements;
    },
    errorMessage: "Failed to load compliance data",
  });

  const agreements = data ?? [];

  function buildComplianceData(agreements: ComplianceAgreement[], userId: string | null): ComplianceData[] {
    return agreements.map((agreement) => {
      const otherParty = userId === agreement.npLicense.user.id
        ? agreement.physicianLicense.user.displayName || agreement.physicianLicense.user.email
        : agreement.npLicense.user.displayName || agreement.npLicense.user.email;

      return {
        agreementId: agreement.id,
        agreementName: `${agreement.state.stateCode} - ${otherParty}`,
        stateCode: agreement.state.stateCode,
        stateName: agreement.state.stateName,
        chartReviewStatus: "compliant" as ComplianceStatus,
        qaMeetingStatus: "compliant" as ComplianceStatus,
        chartReviewFrequency: agreement.state.chartReviewFrequency,
        chartReviewPercentage: agreement.state.chartReviewPercentage,
        qaMeetingFrequency: agreement.state.qaMeetingFrequency,
        lastChartReview: null,
        lastQAMeeting: null,
        nextChartReviewDue: null,
        nextQAMeetingDue: null,
      };
    });
  }

  const complianceData = buildComplianceData(agreements, userId);

  function getOverallCompliancePercentage(): number {
    const totalItems = complianceData.length * 2;
    if (totalItems === 0) return 100;

    const compliantItems = complianceData.reduce((acc, item) => {
      let count = 0;
      if (item.chartReviewStatus === "compliant") count++;
      if (item.qaMeetingStatus === "compliant") count++;
      return acc + count;
    }, 0);

    return Math.round((compliantItems / totalItems) * 100);
  }

  const compliancePercentage = getOverallCompliancePercentage();
  const overdueItems = complianceData.filter(
    (item) => item.chartReviewStatus === "overdue" || item.qaMeetingStatus === "overdue"
  );

  if (loading) {
    return <LoadingState message="Loading compliance data..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Compliance Tracking</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Active CPAs"
          value={agreements.length}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          icon={FileCheck}
        />
        <MetricCard
          label="Overall Compliance"
          value={`${compliancePercentage}%`}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          icon={TrendingUp}
        />
        <MetricCard
          label="Chart Reviews"
          value={0}
          subtitle="This Month"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          icon={ClipboardCheck}
        />
        <MetricCard
          label="QA Meetings"
          value={0}
          subtitle="This Quarter"
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          icon={Calendar}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <QuickActionCard
          icon={ClipboardCheck}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          title="Submit Chart Review"
          description="Record a new chart review"
          onClick={() => router.push("/dashboard/compliance/chart-review")}
        />
        <QuickActionCard
          icon={Calendar}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          title="Schedule QA Meeting"
          description="Set up a quality assurance meeting"
          onClick={() => router.push("/dashboard/compliance/qa-meeting")}
        />
      </div>

      {/* Compliance Status Table */}
      <div className="rounded-md border bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Compliance Status by CPA</h2>
          <p className="mt-1 text-sm text-gray-500">
            Track compliance requirements for each collaboration agreement
          </p>
        </div>
        {complianceData.length === 0 ? (
          <div className="p-8 text-center">
            <FileCheck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No active CPAs</h3>
            <p className="mt-1 text-sm text-gray-500">
              You need an active collaboration agreement to track compliance
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/agreements"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                View Agreements
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Collaboration Agreement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Chart Review Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    QA Meeting Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Requirements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {complianceData.map((item) => (
                  <tr key={item.agreementId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{item.agreementName}</div>
                        <div className="text-xs text-gray-500">{item.stateName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge {...getComplianceBadgeProps(item.chartReviewStatus)} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge {...getComplianceBadgeProps(item.qaMeetingStatus)} />
                    </td>
                    <td className="px-6 py-4">
                      <RequirementsCell item={item} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/dashboard/compliance/chart-review?agreement=${item.agreementId}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Review
                      </Link>
                      <Link
                        href={`/dashboard/compliance/qa-meeting?agreement=${item.agreementId}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Meeting
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Compliance Alerts */}
      {overdueItems.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Compliance Alerts</h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                {overdueItems.map((item) => (
                  <li key={item.agreementId}>
                    {item.agreementName}: {formatOverdueDescription(item)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatOverdueDescription(item: ComplianceData): string {
  const issues = [
    item.chartReviewStatus === "overdue" && "Chart review overdue",
    item.qaMeetingStatus === "overdue" && "QA meeting overdue",
  ].filter(Boolean);
  return issues.join(" and ");
}

function RequirementsCell({ item }: { item: ComplianceData }) {
  if (!item.chartReviewFrequency && !item.qaMeetingFrequency) {
    return <div className="text-xs text-gray-400">No specific requirements</div>;
  }

  return (
    <div className="text-xs text-gray-600">
      {item.chartReviewFrequency && (
        <div>Chart: {item.chartReviewFrequency} ({item.chartReviewPercentage}%)</div>
      )}
      {item.qaMeetingFrequency && <div>QA: {item.qaMeetingFrequency}</div>}
    </div>
  );
}
