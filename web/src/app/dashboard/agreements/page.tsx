"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Plus, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { auth, getDc } from "@/lib/firebase";
import { getMyAgreements } from "@dataconnect/generated";
import { toast } from "sonner";

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

export default function AgreementsPage() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
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
    async function fetchAgreements() {
      try {
        const { data } = await getMyAgreements(getDc());
        setAgreements(data.collaborationAgreements as Agreement[]);
      } catch {
        toast.error("Failed to load agreements");
      } finally {
        setLoading(false);
      }
    }
    if (currentUserId) {
      fetchAgreements();
    }
  }, [currentUserId]);

  const getStatusBadge = (agreement: Agreement) => {
    if (agreement.status === "terminated") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
          <XCircle className="h-3 w-3" />
          Terminated
        </span>
      );
    }
    if (agreement.isActive) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
          <CheckCircle className="h-3 w-3" />
          Active
        </span>
      );
    }
    if (agreement.status === "pending_signatures") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
          <Clock className="h-3 w-3" />
          Pending Signatures
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
        <AlertCircle className="h-3 w-3" />
        Draft
      </span>
    );
  };

  const getOtherParty = (agreement: Agreement) => {
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
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const filteredAgreements = agreements.filter((agreement) => {
    if (filter === "all") return true;
    if (filter === "active") return agreement.isActive && agreement.status !== "terminated";
    if (filter === "pending") return agreement.status === "pending_signatures" || agreement.status === "draft";
    if (filter === "terminated") return agreement.status === "terminated";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Collaboration Agreements</h1>
        <button
          onClick={() => router.push("/dashboard/agreements/create")}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          New Agreement
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setFilter("all")}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
              filter === "all"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            All Agreements
            {filter === "all" && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                {agreements.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
              filter === "active"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Active
            {filter === "active" && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                {agreements.filter((a) => a.isActive && a.status !== "terminated").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
              filter === "pending"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Pending
            {filter === "pending" && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                {agreements.filter((a) => a.status === "pending_signatures" || a.status === "draft").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("terminated")}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
              filter === "terminated"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Terminated
            {filter === "terminated" && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                {agreements.filter((a) => a.status === "terminated").length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Agreements Table */}
      <div className="rounded-md border bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading agreements...
          </div>
        ) : filteredAgreements.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No agreements found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "all"
                ? "Get started by creating your first collaboration agreement"
                : `No ${filter} agreements at this time`}
            </p>
            {filter === "all" && (
              <div className="mt-6">
                <button
                  onClick={() => router.push("/dashboard/agreements/create")}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  New Agreement
                </button>
              </div>
            )}
          </div>
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
                  const otherParty = getOtherParty(agreement);
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
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(agreement)}</td>
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
