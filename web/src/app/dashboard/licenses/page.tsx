"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Calculator } from "lucide-react";
import { functions, dc } from "@/lib/firebase";
import { getMyLicenses } from "@dataconnect/generated";
import { httpsCallable } from "firebase/functions";
import { toast } from "sonner";

interface FPAEligibility {
    status: 'fpa_automatic' | 'fpa_eligible_now' | 'fpa_eligible_future' | 'cpa_required';
    notes: string;
    hoursRemaining?: number;
    yearsRemaining?: number;
    eligibilityDate?: string;
}

export default function LicensesPage() {
    const [licenses, setLicenses] = useState<unknown[]>([]);
    const [loading, setLoading] = useState(true);
    const [calculatingLicenseId, setCalculatingLicenseId] = useState<string | null>(null);
    const [fpaResults, setFpaResults] = useState<Record<string, FPAEligibility>>({});

    useEffect(() => {
        async function fetchLicenses() {
            try {
                const { data } = await getMyLicenses(dc);
                setLicenses(data.licenses);
            } catch {
                toast.error("Failed to load licenses");
            } finally {
                setLoading(false);
            }
        }
        fetchLicenses();
    }, []);

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

    const getFPAStatusBadge = (fpaStatus: string | null, licenseId: string) => {
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
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">FPA Status</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center">Loading licenses...</td>
                                </tr>
                            ) : licenses.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-gray-500">No licenses found. Add one to get started.</td>
                                </tr>
                            ) : (
                                licenses.map((license) => (
                                    <tr key={license.id || Math.random()} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">{license.state.stateName} ({license.state.stateCode})</td>
                                        <td className="p-4 align-middle font-mono">{license.licenseNumber}</td>
                                        <td className="p-4 align-middle">{license.licenseType}</td>
                                        <td className="p-4 align-middle">{new Date(license.expirationDate).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${license.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {license.verificationStatus}
                                            </span>
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
