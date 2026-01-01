"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClipboardCheck,
  Calendar,
  FileCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus
} from "lucide-react";
import { auth, getDc } from "@/lib/firebase";
import { getMyAgreements } from "@dataconnect/generated";
import { toast } from "sonner";

interface Agreement {
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

interface ComplianceStatus {
  agreementId: string;
  agreementName: string;
  stateCode: string;
  stateName: string;
  chartReviewStatus: "compliant" | "warning" | "overdue";
  qaMeetingStatus: "compliant" | "warning" | "overdue";
  chartReviewFrequency: string | null;
  chartReviewPercentage: number | null;
  qaMeetingFrequency: string | null;
  lastChartReview: Date | null;
  lastQAMeeting: Date | null;
  nextChartReviewDue: Date | null;
  nextQAMeetingDue: Date | null;
}

export default function CompliancePage() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [complianceData, setComplianceData] = useState<ComplianceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await getMyAgreements(getDc());
        const activeAgreements = data.collaborationAgreements.filter(
          (a: { isActive?: boolean; status?: string }) => a.isActive && a.status === "active"
        ) as unknown as Agreement[];

        setAgreements(activeAgreements);

        // Calculate compliance status for each agreement
        const complianceStatuses: ComplianceStatus[] = activeAgreements.map((agreement) => {
          const otherParty = currentUserId === agreement.npLicense.user.id
            ? agreement.physicianLicense.user.displayName || agreement.physicianLicense.user.email
            : agreement.npLicense.user.displayName || agreement.npLicense.user.email;

          return {
            agreementId: agreement.id,
            agreementName: `${agreement.state.stateCode} - ${otherParty}`,
            stateCode: agreement.state.stateCode,
            stateName: agreement.state.stateName,
            chartReviewStatus: "compliant",
            qaMeetingStatus: "compliant",
            chartReviewFrequency: agreement.state.chartReviewFrequency,
            chartReviewPercentage: agreement.state.chartReviewPercentage,
            qaMeetingFrequency: agreement.state.qaMeetingFrequency,
            lastChartReview: null,
            lastQAMeeting: null,
            nextChartReviewDue: null,
            nextQAMeetingDue: null,
          };
        });

        setComplianceData(complianceStatuses);
      } catch {
        toast.error("Failed to load compliance data");
      } finally {
        setLoading(false);
      }
    }

    if (currentUserId) {
      fetchData();
    }
  }, [currentUserId]);

  const getStatusBadge = (status: "compliant" | "warning" | "overdue") => {
    if (status === "compliant") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
          <CheckCircle className="h-3 w-3" />
          Compliant
        </span>
      );
    }
    if (status === "warning") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
          <Clock className="h-3 w-3" />
          Due Soon
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
        <AlertCircle className="h-3 w-3" />
        Overdue
      </span>
    );
  };

  const getOverallComplianceStatus = () => {
    const totalItems = complianceData.length * 2;
    const compliantItems = complianceData.reduce((acc, item) => {
      let count = 0;
      if (item.chartReviewStatus === "compliant") count++;
      if (item.qaMeetingStatus === "compliant") count++;
      return acc + count;
    }, 0);

    if (totalItems === 0) return 100;
    return Math.round((compliantItems / totalItems) * 100);
  };

  const compliancePercentage = getOverallComplianceStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Compliance Tracking</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active CPAs</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{agreements.length}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <FileCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Compliance</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{compliancePercentage}%</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chart Reviews</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-500">This Month</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <ClipboardCheck className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">QA Meetings</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-500">This Quarter</p>
            </div>
            <div className="rounded-full bg-orange-100 p-3">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={() => router.push("/dashboard/compliance/chart-review")}
          className="flex items-center justify-between rounded-lg border bg-white p-4 text-left shadow-sm transition-colors hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Submit Chart Review</p>
              <p className="text-sm text-gray-500">Record a new chart review</p>
            </div>
          </div>
          <Plus className="h-5 w-5 text-gray-400" />
        </button>

        <button
          onClick={() => router.push("/dashboard/compliance/qa-meeting")}
          className="flex items-center justify-between rounded-lg border bg-white p-4 text-left shadow-sm transition-colors hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Schedule QA Meeting</p>
              <p className="text-sm text-gray-500">Set up a quality assurance meeting</p>
            </div>
          </div>
          <Plus className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Compliance Status Table */}
      <div className="rounded-md border bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Compliance Status by CPA</h2>
          <p className="mt-1 text-sm text-gray-500">
            Track compliance requirements for each collaboration agreement
          </p>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading compliance data...
          </div>
        ) : complianceData.length === 0 ? (
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
                      {getStatusBadge(item.chartReviewStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.qaMeetingStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600">
                        {item.chartReviewFrequency && (
                          <div>Chart: {item.chartReviewFrequency} ({item.chartReviewPercentage}%)</div>
                        )}
                        {item.qaMeetingFrequency && (
                          <div>QA: {item.qaMeetingFrequency}</div>
                        )}
                        {!item.chartReviewFrequency && !item.qaMeetingFrequency && (
                          <div className="text-gray-400">No specific requirements</div>
                        )}
                      </div>
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
      {complianceData.some(item => item.chartReviewStatus === "overdue" || item.qaMeetingStatus === "overdue") && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Compliance Alerts</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {complianceData
                    .filter(item => item.chartReviewStatus === "overdue" || item.qaMeetingStatus === "overdue")
                    .map(item => (
                      <li key={item.agreementId}>
                        {item.agreementName}:
                        {item.chartReviewStatus === "overdue" && " Chart review overdue"}
                        {item.chartReviewStatus === "overdue" && item.qaMeetingStatus === "overdue" && " and "}
                        {item.qaMeetingStatus === "overdue" && " QA meeting overdue"}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
