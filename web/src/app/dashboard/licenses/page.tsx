"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Calculator, ExternalLink, CheckCircle } from "lucide-react";
import { functions, getDc } from "@/lib/firebase";
import { getMyLicenses, updateLicenseVerification, type GetMyLicensesData } from "@dataconnect/generated";

type License = GetMyLicensesData['licenses'][number];
import { httpsCallable } from "firebase/functions";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";

interface FPAEligibility {
    status: 'fpa_automatic' | 'fpa_eligible_now' | 'fpa_eligible_future' | 'cpa_required';
    notes: string;
    hoursRemaining?: number;
    yearsRemaining?: number;
    eligibilityDate?: string;
}

export default function LicensesPage() {
    const { user, loading: authLoading } = useAuth();
    const [licenses, setLicenses] = useState<License[]>([]);
    const [loading, setLoading] = useState(true);
    const [calculatingLicenseId, setCalculatingLicenseId] = useState<string | null>(null);
    const [verifyingLicenseId, setVerifyingLicenseId] = useState<string | null>(null);
    const [fpaResults, setFpaResults] = useState<Record<string, FPAEligibility>>({});

    useEffect(() => {
        async function fetchLicenses() {
            if (authLoading || !user) {
                return;
            }
            try {
                const { data } = await getMyLicenses(getDc());
                setLicenses(data.licenses);
            } catch {
                toast.error("Failed to load licenses");
            } finally {
                setLoading(false);
            }
        }
        fetchLicenses();
    }, [authLoading, user]);

    const calculateFPA = async (licenseId: string) => {
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
    };

    const markAsVerified = async (licenseId: string) => {
        setVerifyingLicenseId(licenseId);
        try {
            await updateLicenseVerification(getDc(), {
                licenseId,
                verificationStatus: "verified",
                verificationMethod: "manual_state_board"
            });
            // Update the local state to reflect the change
            setLicenses(prev => prev.map(license =>
                license.id === licenseId
                    ? { ...license, verificationStatus: "verified", verificationDate: new Date().toISOString() }
                    : license
            ));
            toast.success("License marked as verified!");
        } catch {
            toast.error("Failed to update verification status. Please try again.");
        } finally {
            setVerifyingLicenseId(null);
        }
    };

    const getVerificationStatusDisplay = (license: License) => {
        const isVerified = license.verificationStatus === 'verified';
        const verificationDate = license.verificationDate ? new Date(license.verificationDate).toLocaleDateString() : null;

        return (
            <div className="space-y-1">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {isVerified ? 'Verified' : 'Pending Verification'}
                </span>
                {isVerified && verificationDate && (
                    <p className="text-xs text-gray-500">Verified on {verificationDate}</p>
                )}
            </div>
        );
    };

    const getFPAStatusBadge = (fpaStatus: string | null | undefined, licenseId: string) => {
        const result = fpaResults[licenseId];

        if (result) {
            const statusColors = {
                'fpa_automatic': 'bg-green-100 text-green-800',
                'fpa_eligible_now': 'bg-blue-100 text-blue-800',
                'fpa_eligible_future': 'bg-yellow-100 text-yellow-800',
                'cpa_required': 'bg-gray-100 text-gray-800',
            };

            const statusLabels = {
                'fpa_automatic': 'FPA Automatic',
                'fpa_eligible_now': 'FPA Eligible Now',
                'fpa_eligible_future': 'FPA Future',
                'cpa_required': 'CPA Required',
            };

            return (
                <div className="space-y-1">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[result.status]}`}>
                        {statusLabels[result.status]}
                    </span>
                    <p className="text-xs text-gray-600">{result.notes}</p>
                    {result.hoursRemaining !== undefined && (
                        <p className="text-xs text-gray-600">Hours remaining: {result.hoursRemaining}</p>
                    )}
                    {result.yearsRemaining !== undefined && (
                        <p className="text-xs text-gray-600">Years remaining: {result.yearsRemaining.toFixed(1)}</p>
                    )}
                </div>
            );
        }

        return fpaStatus ? (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                {fpaStatus}
            </span>
        ) : (
            <span className="text-gray-400">-</span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Licenses</h1>
                <Link
                    href="/dashboard/licenses/add"
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <Plus className="h-4 w-4" />
                    Add License
                </Link>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
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
                            {loading || authLoading ? (
                                <tr>
                                    <td colSpan={8} className="p-4 text-center">Loading licenses...</td>
                                </tr>
                            ) : licenses.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-4 text-center text-gray-500">No licenses found. Add one to get started.</td>
                                </tr>
                            ) : (
                                licenses.map((license) => (
                                    <tr key={license.id || Math.random()} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">{license.state.stateName} ({license.state.stateCode})</td>
                                        <td className="p-4 align-middle font-mono">{license.licenseNumber}</td>
                                        <td className="p-4 align-middle">{license.licenseType}</td>
                                        <td className="p-4 align-middle">{new Date(license.expirationDate).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle">
                                            {getVerificationStatusDisplay(license)}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {license.state.licenseVerificationUrl ? (
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
                                                            onClick={() => markAsVerified(license.id)}
                                                            disabled={verifyingLicenseId === license.id}
                                                            className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 hover:underline text-sm disabled:opacity-50"
                                                        >
                                                            <CheckCircle className="h-3 w-3" />
                                                            {verifyingLicenseId === license.id ? 'Updating...' : 'Mark as Verified'}
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">No verification URL available</span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {getFPAStatusBadge(license.fpaStatus, license.id)}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <button
                                                onClick={() => calculateFPA(license.id)}
                                                disabled={calculatingLicenseId === license.id}
                                                className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                            >
                                                <Calculator className="h-3 w-3" />
                                                {calculatingLicenseId === license.id ? 'Calculating...' : 'Calculate FPA'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
