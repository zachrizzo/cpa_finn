"use client";

import { useState } from "react";
import { Plus, Calculator, ExternalLink, CheckCircle } from "lucide-react";
import { functions, getDc } from "@/lib/firebase";
import { getMyLicenses, updateLicenseVerification, type GetMyLicensesData } from "@dataconnect/generated";
import { httpsCallable } from "firebase/functions";
import { toast } from "sonner";
import { useProtectedData } from "@/hooks";
import { PageHeader, LinkButton, Button, StatusBadge, TableLoadingState, TableEmptyState } from "@/components";
import { getVerificationBadgeProps } from "@/components/StatusBadge";
import { formatDate } from "@/lib/format";
import type { FPAEligibility } from "@/types";

type License = GetMyLicensesData['licenses'][number];

const FPA_STATUS_CONFIG = {
    fpa_automatic: { color: 'bg-green-100 text-green-800', label: 'FPA Automatic' },
    fpa_eligible_now: { color: 'bg-blue-100 text-blue-800', label: 'FPA Eligible Now' },
    fpa_eligible_future: { color: 'bg-yellow-100 text-yellow-800', label: 'FPA Future' },
    cpa_required: { color: 'bg-gray-100 text-gray-800', label: 'CPA Required' },
};

export default function LicensesPage() {
    const { data, loading, refetch } = useProtectedData({
        fetcher: async (dc) => {
            const { data } = await getMyLicenses(dc);
            return data.licenses;
        },
        errorMessage: "Failed to load licenses",
    });

    const licenses = data ?? [];

    const [calculatingLicenseId, setCalculatingLicenseId] = useState<string | null>(null);
    const [verifyingLicenseId, setVerifyingLicenseId] = useState<string | null>(null);
    const [fpaResults, setFpaResults] = useState<Record<string, FPAEligibility>>({});

    async function calculateFPA(licenseId: string): Promise<void> {
        setCalculatingLicenseId(licenseId);
        try {
            const calculateFPAEligibility = httpsCallable<{ licenseId: string }, FPAEligibility>(
                functions,
                'calculateFPAEligibility'
            );
            const result = await calculateFPAEligibility({ licenseId });
            setFpaResults(prev => ({ ...prev, [licenseId]: result.data }));
        } catch {
            toast.error("Failed to calculate FPA eligibility. Please try again.");
        } finally {
            setCalculatingLicenseId(null);
        }
    }

    async function markAsVerified(licenseId: string): Promise<void> {
        setVerifyingLicenseId(licenseId);
        try {
            await updateLicenseVerification(getDc(), {
                licenseId,
                verificationStatus: "verified",
                verificationMethod: "manual_state_board"
            });
            await refetch();
            toast.success("License marked as verified!");
        } catch {
            toast.error("Failed to update verification status. Please try again.");
        } finally {
            setVerifyingLicenseId(null);
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Licenses"
                actions={
                    <LinkButton href="/dashboard/licenses/add" icon={Plus}>
                        Add License
                    </LinkButton>
                }
            />

            <div className="rounded-md border bg-white shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">State</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">License Number</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Type</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Expiration</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Verification Status</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Verification</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">FPA Status</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {loading ? (
                                <TableLoadingState message="Loading licenses..." colSpan={8} />
                            ) : licenses.length === 0 ? (
                                <TableEmptyState colSpan={8} message="No licenses found. Add one to get started." />
                            ) : (
                                licenses.map((license) => (
                                    <LicenseRow
                                        key={license.id}
                                        license={license}
                                        fpaResult={fpaResults[license.id]}
                                        calculatingLicenseId={calculatingLicenseId}
                                        verifyingLicenseId={verifyingLicenseId}
                                        onCalculateFPA={calculateFPA}
                                        onMarkVerified={markAsVerified}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

interface LicenseRowProps {
    license: License;
    fpaResult?: FPAEligibility;
    calculatingLicenseId: string | null;
    verifyingLicenseId: string | null;
    onCalculateFPA: (licenseId: string) => void;
    onMarkVerified: (licenseId: string) => void;
}

function LicenseRow({
    license,
    fpaResult,
    calculatingLicenseId,
    verifyingLicenseId,
    onCalculateFPA,
    onMarkVerified,
}: LicenseRowProps) {
    const isVerified = license.verificationStatus === 'verified';
    const verificationDate = license.verificationDate ? formatDate(license.verificationDate) : null;
    const isCalculating = calculatingLicenseId === license.id;
    const isVerifying = verifyingLicenseId === license.id;

    return (
        <tr className="border-b transition-colors hover:bg-muted/50">
            <td className="p-4 align-middle font-medium">
                {license.state.stateName} ({license.state.stateCode})
            </td>
            <td className="p-4 align-middle font-mono">{license.licenseNumber}</td>
            <td className="p-4 align-middle">{license.licenseType}</td>
            <td className="p-4 align-middle">{formatDate(license.expirationDate)}</td>
            <td className="p-4 align-middle">
                <div className="space-y-1">
                    <StatusBadge {...getVerificationBadgeProps(license.verificationStatus)} showIcon={false} />
                    {isVerified && verificationDate && (
                        <p className="text-xs text-gray-500">Verified on {verificationDate}</p>
                    )}
                </div>
            </td>
            <td className="p-4 align-middle">
                <VerificationCell
                    license={license}
                    isVerifying={isVerifying}
                    onMarkVerified={onMarkVerified}
                />
            </td>
            <td className="p-4 align-middle">
                <FPAStatusCell fpaStatus={license.fpaStatus} fpaResult={fpaResult} />
            </td>
            <td className="p-4 align-middle">
                <Button
                    size="sm"
                    icon={Calculator}
                    onClick={() => onCalculateFPA(license.id)}
                    loading={isCalculating}
                >
                    {isCalculating ? 'Calculating...' : 'Calculate FPA'}
                </Button>
            </td>
        </tr>
    );
}

function VerificationCell({
    license,
    isVerifying,
    onMarkVerified,
}: {
    license: License;
    isVerifying: boolean;
    onMarkVerified: (licenseId: string) => void;
}) {
    if (!license.state.licenseVerificationUrl) {
        return <span className="text-gray-400 text-sm">No verification URL available</span>;
    }

    return (
        <div className="flex flex-col gap-2">
            <a
                href={license.state.licenseVerificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-sm"
            >
                <ExternalLink className="h-3 w-3" />
                Verify on State Board
            </a>
            {license.verificationStatus !== 'verified' && (
                <button
                    onClick={() => onMarkVerified(license.id)}
                    disabled={isVerifying}
                    className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 hover:underline text-sm disabled:opacity-50"
                >
                    <CheckCircle className="h-3 w-3" />
                    {isVerifying ? 'Updating...' : 'Mark as Verified'}
                </button>
            )}
        </div>
    );
}

function FPAStatusCell({
    fpaStatus,
    fpaResult,
}: {
    fpaStatus: string | null | undefined;
    fpaResult?: FPAEligibility;
}) {
    if (fpaResult) {
        const config = FPA_STATUS_CONFIG[fpaResult.status];
        return (
            <div className="space-y-1">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
                    {config.label}
                </span>
                <p className="text-xs text-gray-600">{fpaResult.notes}</p>
                {fpaResult.hoursRemaining !== undefined && (
                    <p className="text-xs text-gray-600">Hours remaining: {fpaResult.hoursRemaining}</p>
                )}
                {fpaResult.yearsRemaining !== undefined && (
                    <p className="text-xs text-gray-600">Years remaining: {fpaResult.yearsRemaining.toFixed(1)}</p>
                )}
            </div>
        );
    }

    if (fpaStatus) {
        return (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                {fpaStatus}
            </span>
        );
    }

    return <span className="text-gray-400">-</span>;
}
