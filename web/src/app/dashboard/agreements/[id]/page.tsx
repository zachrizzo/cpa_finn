"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, User, Building, Calendar, FileSignature } from "lucide-react";
import { auth, getDc } from "@/lib/firebase";
import { getAgreementById, getAgreementSignatures, activateAgreement } from "@dataconnect/generated";
import { toast } from "sonner";

interface Agreement {
  id: string;
  status: string;
  isActive: boolean;
  docusignUrl: string | null;
  boardFilingDate: string | null;
  boardApprovalDate: string | null;
  terminationDate: string | null;
  terminationReason: string | null;
  createdAt: string;
  updatedAt: string;
  isBoardReported: boolean | null;
  boardReportingStatus: string | null;
  boardReportingInstructions: string | null;
  terminationResponsibility: string | null;
  npLicense: {
    id: string;
    licenseNumber: string;
    licenseType: string;
    issueDate: string;
    expirationDate: string;
    verificationStatus: string;
    user: {
      id: string;
      displayName: string | null;
      email: string;
      role: string | null;
    };
  };
  physicianLicense: {
    id: string;
    licenseNumber: string;
    licenseType: string;
    issueDate: string;
    expirationDate: string;
    verificationStatus: string;
    user: {
      id: string;
      displayName: string | null;
      email: string;
      role: string | null;
    };
  };
  state: {
    id: string;
    stateCode: string;
    stateName: string;
    cpaRequired: boolean | null;
    physicianNpRatio: string | null;
    ratioIsFte: boolean | null;
    chartReviewFrequency: string | null;
    chartReviewPercentage: number | null;
    chartReviewControlledSubstancesOnly: boolean | null;
    qaMeetingFrequency: string | null;
    qaMeetingDurationMonths: number | null;
    boardFilingRequired: boolean | null;
    boardFilingWho: string | null;
    boardFilingFee: number | null;
    boardPortalUrl: string | null;
    cpaRenewalFrequency: string | null;
    cpaAutoRenews: boolean | null;
    complianceNotes: string | null;
  };
}

interface Signature {
  signer: {
    id: string;
    displayName: string | null;
    email: string;
    role: string | null;
  };
  signedAt: string;
  signatureMethod: string;
  ipAddress: string | null;
  createdAt: string;
}

export default function AgreementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const agreementId = params.id as string;

  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchAgreement() {
      try {
        const { data } = await getAgreementById(getDc(), { agreementId });
        const agreementData = data.collaborationAgreement as Agreement;
        setAgreement(agreementData);

        // Fetch signatures
        const sigData = await getAgreementSignatures(getDc(), {
          npUserId: agreementData.npLicense.user.id,
          physicianUserId: agreementData.physicianLicense.user.id,
        });
        setSignatures(sigData.data.documentSignatures as Signature[]);
      } catch {
        toast.error("Failed to load agreement");
      } finally {
        setLoading(false);
      }
    }

    if (currentUserId) {
      fetchAgreement();
    }
  }, [agreementId, currentUserId]);

  const hasUserSigned = () => {
    if (!currentUserId) return false;
    return signatures.some((sig) => sig.signer.id === currentUserId);
  };

  const hasNPSigned = () => {
    if (!agreement) return false;
    return signatures.some((sig) => sig.signer.id === agreement.npLicense.user.id);
  };

  const hasPhysicianSigned = () => {
    if (!agreement) return false;
    return signatures.some((sig) => sig.signer.id === agreement.physicianLicense.user.id);
  };

  const bothPartiesSigned = hasNPSigned() && hasPhysicianSigned();

  const handleActivate = async () => {
    if (!bothPartiesSigned) {
      toast.error("Both parties must sign before activating the agreement.");
      return;
    }

    setActivating(true);
    try {
      await activateAgreement(getDc(), { agreementId });
      toast.success("Agreement activated successfully!");

      // Refresh agreement data
      const { data } = await getAgreementById(getDc(), { agreementId });
      setAgreement(data.collaborationAgreement as Agreement);
    } catch {
      toast.error("Failed to activate agreement. Please try again.");
    } finally {
      setActivating(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading agreement...</div>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Agreement not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/agreements")}
          className="text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Collaboration Agreement
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {agreement.state.stateName} - Created {formatDate(agreement.createdAt)}
          </p>
        </div>
        {agreement.isActive && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            <CheckCircle className="h-4 w-4" />
            Active
          </span>
        )}
      </div>

      {/* Alert Banners */}
      {!agreement.isActive && bothPartiesSigned && (
        <div className="rounded-md bg-blue-50 border border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800">Ready to Activate</h3>
              <p className="text-sm text-blue-700 mt-1">
                Both parties have signed this agreement. Click the button below to activate it.
              </p>
              <button
                onClick={handleActivate}
                disabled={activating}
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {activating ? "Activating..." : "Activate Agreement"}
              </button>
            </div>
          </div>
        </div>
      )}

      {!hasUserSigned() && !agreement.isActive && (
        <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Signature Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You need to sign this agreement before it can be activated.
              </p>
              <button
                onClick={() => router.push(`/dashboard/agreements/${agreementId}/sign`)}
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700"
              >
                <FileSignature className="h-4 w-4" />
                Sign Agreement
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NP Information */}
        <div className="rounded-md border bg-white shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-blue-100 p-2">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Nurse Practitioner</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-sm text-gray-900">
                {agreement.npLicense.user.displayName || agreement.npLicense.user.email}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{agreement.npLicense.user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">License Number</p>
              <p className="text-sm text-gray-900">{agreement.npLicense.licenseNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">License Type</p>
              <p className="text-sm text-gray-900">{agreement.npLicense.licenseType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Signature Status</p>
              {hasNPSigned() ? (
                <span className="inline-flex items-center gap-1 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Signed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm text-yellow-700">
                  <Clock className="h-4 w-4" />
                  Not Signed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Physician Information */}
        <div className="rounded-md border bg-white shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-purple-100 p-2">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Collaborating Physician</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-sm text-gray-900">
                {agreement.physicianLicense.user.displayName || agreement.physicianLicense.user.email}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{agreement.physicianLicense.user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">License Number</p>
              <p className="text-sm text-gray-900">{agreement.physicianLicense.licenseNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">License Type</p>
              <p className="text-sm text-gray-900">{agreement.physicianLicense.licenseType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Signature Status</p>
              {hasPhysicianSigned() ? (
                <span className="inline-flex items-center gap-1 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Signed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm text-yellow-700">
                  <Clock className="h-4 w-4" />
                  Not Signed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* State Compliance Requirements */}
      <div className="rounded-md border bg-white shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-green-100 p-2">
            <Building className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            {agreement.state.stateName} Compliance Requirements
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agreement.state.physicianNpRatio && (
            <div>
              <p className="text-sm font-medium text-gray-500">Physician to NP Ratio</p>
              <p className="text-sm text-gray-900">
                {agreement.state.physicianNpRatio}
                {agreement.state.ratioIsFte && " (FTE)"}
              </p>
            </div>
          )}
          {agreement.state.chartReviewFrequency && (
            <div>
              <p className="text-sm font-medium text-gray-500">Chart Review Frequency</p>
              <p className="text-sm text-gray-900">
                {agreement.state.chartReviewFrequency}
                {agreement.state.chartReviewPercentage &&
                  ` - ${agreement.state.chartReviewPercentage}% of charts`}
              </p>
            </div>
          )}
          {agreement.state.qaMeetingFrequency && (
            <div>
              <p className="text-sm font-medium text-gray-500">QA Meeting Frequency</p>
              <p className="text-sm text-gray-900">{agreement.state.qaMeetingFrequency}</p>
            </div>
          )}
          {agreement.state.cpaRenewalFrequency && (
            <div>
              <p className="text-sm font-medium text-gray-500">CPA Renewal</p>
              <p className="text-sm text-gray-900">
                {agreement.state.cpaRenewalFrequency}
                {agreement.state.cpaAutoRenews && " (Auto-renews)"}
              </p>
            </div>
          )}
          {agreement.state.boardFilingRequired && (
            <div>
              <p className="text-sm font-medium text-gray-500">Board Filing</p>
              <p className="text-sm text-gray-900">
                Required
                {agreement.state.boardFilingFee && ` - Fee: $${agreement.state.boardFilingFee}`}
              </p>
            </div>
          )}
        </div>
        {agreement.state.complianceNotes && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium text-gray-500 mb-2">Additional Notes</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{agreement.state.complianceNotes}</p>
          </div>
        )}
      </div>

      {/* Signature History */}
      {signatures.length > 0 && (
        <div className="rounded-md border bg-white shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-indigo-100 p-2">
              <FileSignature className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Signature History</h2>
          </div>
          <div className="space-y-3">
            {signatures.map((signature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-md bg-gray-50">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {signature.signer.displayName || signature.signer.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    Signed on {formatDate(signature.signedAt)} via {signature.signatureMethod}
                  </p>
                  {signature.ipAddress && (
                    <p className="text-xs text-gray-400 mt-1">IP: {signature.ipAddress}</p>
                  )}
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agreement Status */}
      {agreement.status === "terminated" && (
        <div className="rounded-md border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-red-900">Agreement Terminated</h2>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-red-700">
              <span className="font-medium">Termination Date:</span> {formatDate(agreement.terminationDate)}
            </p>
            {agreement.terminationReason && (
              <p className="text-red-700">
                <span className="font-medium">Reason:</span> {agreement.terminationReason}
              </p>
            )}
            {agreement.terminationResponsibility && (
              <p className="text-red-700">
                <span className="font-medium">Responsible Party:</span> {agreement.terminationResponsibility}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
