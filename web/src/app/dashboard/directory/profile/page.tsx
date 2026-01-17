"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getDc } from "@/lib/firebase";
import {
    getMyProfile,
    getMyLicenses,
    getMyDirectoryProfile,
    createPhysicianDirectory,
    createNpDirectory,
    updatePhysicianDirectoryProfile,
    updateNpDirectoryProfile,
    getMyStateCapacities,
    upsertStateCapacity,
    listStates,
} from "@dataconnect/generated";
import { toast } from "sonner";

const physicianProfileSchema = z.object({
    availableStates: z.string().min(1, "Select at least one state"),
    specialtyType: z.string().min(1, "Specialty is required"),
    supervisionModel: z.enum(["hourly", "revenue_share", "hybrid", "flat_fee"]),
    hourlyRate: z.number().optional(),
    revenueSharePercentage: z.number().optional(),
    isActive: z.boolean(),
});

const npProfileSchema = z.object({
    seekingStates: z.string().min(1, "Select at least one state"),
    licensedStates: z.string().min(1, "Select at least one state"),
    specialtyType: z.string().min(1, "Specialty is required"),
    needsCPA: z.boolean(),
    cpaNeededStates: z.string().optional(),
    hoursPerWeekAvailable: z.number().min(1).max(168).optional(),
    preferredCompensationModel: z.enum(["hourly", "revenue_share", "hybrid", "salary"]).optional(),
    isActive: z.boolean(),
});

type PhysicianProfileFormValues = z.infer<typeof physicianProfileSchema>;
type NPProfileFormValues = z.infer<typeof npProfileSchema>;

interface License {
    id: string;
    licenseNumber: string;
    state: { stateCode: string; stateName: string };
}

interface StateInfo {
    id: string;
    stateCode: string;
    stateName: string;
}

interface StateCapacity {
    id?: string;
    stateId: string;
    stateCode: string;
    stateName: string;
    maxNpCapacity: number;
    currentNpCount: number;
    isAccepting: boolean;
    notes: string;
}

interface DirectoryProfile {
    physician?: {
        id: string;
    };
    np?: {
        id: string;
    };
    totalNpCapacity?: number | null;
    currentNpCount?: number | null;
}

export default function DirectoryProfilePage() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [licenses, setLicenses] = useState<License[]>([]);
    const [allStates, setAllStates] = useState<StateInfo[]>([]);
    const [existingProfile, setExistingProfile] = useState<DirectoryProfile | null>(null);
    const [stateCapacities, setStateCapacities] = useState<StateCapacity[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const specialties = [
        "Family Medicine",
        "Internal Medicine",
        "Psychiatry",
        "Pediatrics",
        "Emergency Medicine",
        "Urgent Care",
        "Cardiology",
        "Dermatology",
        "Oncology",
        "Other",
    ];

    const physicianForm = useForm<PhysicianProfileFormValues>({
        resolver: zodResolver(physicianProfileSchema),
        defaultValues: {
            availableStates: "",
            specialtyType: "",
            supervisionModel: "hourly",
            isActive: true,
        },
    });

    const npForm = useForm<NPProfileFormValues>({
        resolver: zodResolver(npProfileSchema),
        defaultValues: {
            seekingStates: "",
            licensedStates: "",
            specialtyType: "",
            needsCPA: true,
            cpaNeededStates: "",
            isActive: true,
        },
    });

    // Get state ID from state code
    const getStateId = useCallback((stateCode: string): string | undefined => {
        const state = allStates.find(s => s.stateCode === stateCode);
        return state?.id;
    }, [allStates]);

    // Initialize state capacities from licenses and existing capacities
    const initializeStateCapacities = useCallback((
        licensedStates: License[],
        existingCapacities: Array<{
            id: string;
            state: { id: string; stateCode: string; stateName: string };
            maxNpCapacity: number;
            currentNpCount: number;
            isAccepting: boolean;
            notes?: string | null;
        }>,
        globalCapacity?: number | null,
        globalCurrentCount?: number | null
    ) => {
        const capacityMap = new Map<string, StateCapacity>();

        // First, add existing capacities
        existingCapacities.forEach(cap => {
            capacityMap.set(cap.state.stateCode, {
                id: cap.id,
                stateId: cap.state.id,
                stateCode: cap.state.stateCode,
                stateName: cap.state.stateName,
                maxNpCapacity: cap.maxNpCapacity,
                currentNpCount: cap.currentNpCount,
                isAccepting: cap.isAccepting,
                notes: cap.notes || "",
            });
        });

        // Then, add any licensed states that don't have capacities yet
        // Pre-populate with global values if available
        licensedStates.forEach(license => {
            if (!capacityMap.has(license.state.stateCode)) {
                const stateId = getStateId(license.state.stateCode);
                if (stateId) {
                    capacityMap.set(license.state.stateCode, {
                        stateId,
                        stateCode: license.state.stateCode,
                        stateName: license.state.stateName,
                        maxNpCapacity: globalCapacity || 1,
                        currentNpCount: globalCurrentCount || 0,
                        isAccepting: true,
                        notes: "",
                    });
                }
            }
        });

        return Array.from(capacityMap.values()).sort((a, b) =>
            a.stateCode.localeCompare(b.stateCode)
        );
    }, [getStateId]);

    useEffect(() => {
        async function loadProfile() {
            try {
                // Get all states first
                const { data: statesData } = await listStates(getDc());
                const uniqueStates = Array.from(
                    new Map(statesData.states.map(s => [s.stateCode, { id: s.id, stateCode: s.stateCode, stateName: s.stateName }])).values()
                );
                setAllStates(uniqueStates);

                // Get user profile
                const { data: profileData } = await getMyProfile(getDc());
                const role = profileData.user?.role;
                setUserRole(role || null);

                // Get licenses
                const { data: licensesData } = await getMyLicenses(getDc());
                setLicenses(licensesData.licenses || []);

                // Get existing directory profile
                try {
                    const { data: directoryData } = await getMyDirectoryProfile(getDc());

                    if (role === "physician" && directoryData.providerDirectory) {
                        const profile = directoryData.providerDirectory;
                        setExistingProfile(profile as unknown as DirectoryProfile);
                        physicianForm.reset({
                            availableStates: profile.availableStates || "",
                            specialtyType: profile.primarySpecialty || "",
                            supervisionModel: (profile.supervisionModel as "hourly" | "revenue_share" | "hybrid" | "flat_fee") || "hourly",
                            hourlyRate: profile.hourlyRate || undefined,
                            revenueSharePercentage: profile.revenueSharePercentage || undefined,
                            isActive: profile.isActive ?? true,
                        });

                        // Load per-state capacities
                        try {
                            const { data: capacitiesData } = await getMyStateCapacities(getDc());
                            const initializedCapacities = initializeStateCapacities(
                                licensesData.licenses || [],
                                capacitiesData.providerStateCapacities || [],
                                profile.totalNpCapacity,
                                profile.currentNpCount
                            );
                            setStateCapacities(initializedCapacities);
                        } catch {
                            // No existing capacities, initialize from licenses with global values
                            const initializedCapacities = initializeStateCapacities(
                                licensesData.licenses || [],
                                [],
                                profile.totalNpCapacity,
                                profile.currentNpCount
                            );
                            setStateCapacities(initializedCapacities);
                        }
                    } else if (role === "np" && directoryData.npDirectory) {
                        const profile = directoryData.npDirectory;
                        setExistingProfile(profile as unknown as DirectoryProfile);
                        npForm.reset({
                            seekingStates: profile.seekingStates || "",
                            licensedStates: profile.licensedStates || "",
                            specialtyType: profile.primarySpecialty || "",
                            needsCPA: true,
                            cpaNeededStates: profile.cpaNeededStates || "",
                            hoursPerWeekAvailable: profile.hoursPerWeekAvailable || undefined,
                            preferredCompensationModel: (profile.preferredCompensationModel as "hourly" | "revenue_share" | "hybrid" | "salary") || undefined,
                            isActive: profile.isActive ?? true,
                        });
                    } else if (role === "physician") {
                        // No existing profile, initialize capacities from licenses
                        const initializedCapacities = initializeStateCapacities(
                            licensesData.licenses || [],
                            [],
                            null,
                            null
                        );
                        setStateCapacities(initializedCapacities);
                    }
                } catch {
                    // No existing profile found
                    if (role === "physician") {
                        // Initialize capacities from licenses
                        const initializedCapacities = initializeStateCapacities(
                            licensesData.licenses || [],
                            [],
                            null,
                            null
                        );
                        setStateCapacities(initializedCapacities);
                    }
                }
            } catch {
                toast.error("Failed to load profile data");
                setError("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update a specific state capacity
    const updateStateCapacity = (stateCode: string, field: keyof StateCapacity, value: number | boolean | string) => {
        setStateCapacities(prev => prev.map(cap =>
            cap.stateCode === stateCode ? { ...cap, [field]: value } : cap
        ));
    };

    // Calculate totals from state capacities
    const calculateTotals = () => {
        const acceptingCapacities = stateCapacities.filter(cap => cap.isAccepting);
        const totalMaxNPs = acceptingCapacities.reduce((sum, cap) => sum + cap.maxNpCapacity, 0);
        const totalCurrentNPs = acceptingCapacities.reduce((sum, cap) => sum + cap.currentNpCount, 0);
        return { totalMaxNPs, totalCurrentNPs, availableSpots: totalMaxNPs - totalCurrentNPs };
    };

    const onSubmitPhysician = async (data: PhysicianProfileFormValues) => {
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const { totalMaxNPs, totalCurrentNPs, availableSpots } = calculateTotals();

            if (existingProfile?.physician) {
                // Update existing profile
                await updatePhysicianDirectoryProfile(getDc(), {
                    availableStates: data.availableStates,
                    primarySpecialty: data.specialtyType,
                    maxNPs: totalMaxNPs,
                    availableSpots: availableSpots,
                    currentNpCount: totalCurrentNPs,
                    supervisionModel: data.supervisionModel,
                    hourlyRate: data.hourlyRate || null,
                    revenueSharePercentage: data.revenueSharePercentage || null,
                    isActive: data.isActive,
                    profileVisibility: "public",
                });
            } else {
                // Create new profile
                await createPhysicianDirectory(getDc(), {
                    availableStates: data.availableStates,
                    specialtyType: data.specialtyType,
                    maxNPs: totalMaxNPs,
                    currentNPCount: totalCurrentNPs,
                    availableForNewNPs: availableSpots > 0,
                    supervisionModel: data.supervisionModel,
                });
            }

            // Save per-state capacities
            for (const capacity of stateCapacities) {
                await upsertStateCapacity(getDc(), {
                    stateId: capacity.stateId as `${string}-${string}-${string}-${string}-${string}`,
                    maxNpCapacity: capacity.maxNpCapacity,
                    currentNpCount: capacity.currentNpCount,
                    isAccepting: capacity.isAccepting,
                    notes: capacity.notes || null,
                });
            }

            setSuccess(true);
            toast.success("Profile and state capacities saved successfully!");
            setTimeout(() => router.push("/dashboard/directory"), 2000);
        } catch (err) {
            console.error("Error saving profile:", err);
            toast.error("Failed to save profile. Please try again.");
            setError("Failed to save profile. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const onSubmitNP = async (data: NPProfileFormValues) => {
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            if (existingProfile?.np) {
                // Update existing profile
                await updateNpDirectoryProfile(getDc(), {
                    seekingStates: data.seekingStates,
                    licensedStates: data.licensedStates,
                    cpaNeededStates: data.cpaNeededStates || null,
                    primarySpecialty: data.specialtyType,
                    hoursPerWeekAvailable: data.hoursPerWeekAvailable || null,
                    preferredCompensationModel: data.preferredCompensationModel || null,
                    isActive: data.isActive,
                    profileVisibility: "public",
                });
            } else {
                // Create new profile
                await createNpDirectory(getDc(), {
                    seekingStates: data.seekingStates,
                    licensedStates: data.licensedStates,
                    specialtyType: data.specialtyType,
                    needsCPA: data.needsCPA,
                    cpaNeededStates: data.cpaNeededStates || "",
                });
            }
            setSuccess(true);
            setTimeout(() => router.push("/dashboard/directory"), 2000);
        } catch {
            toast.error("Failed to save profile. Please try again.");
            setError("Failed to save profile. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    const { totalMaxNPs, totalCurrentNPs, availableSpots } = calculateTotals();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    {existingProfile ? "Edit" : "Create"} Directory Profile
                </h1>
                <p className="text-gray-500">
                    {userRole === "physician"
                        ? "Set up your profile to connect with NPs looking for collaboration."
                        : "Set up your profile to find physicians for CPA agreements."}
                </p>
            </div>

            <div className="bg-white p-6 shadow rounded-lg border">
                {userRole === "physician" ? (
                    <form onSubmit={physicianForm.handleSubmit(onSubmitPhysician)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Available States</label>
                            <select
                                multiple
                                {...physicianForm.register("availableStates")}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                size={5}
                            >
                                {licenses.map((license) => (
                                    <option key={license.id} value={license.state.stateCode}>
                                        {license.state.stateName} ({license.state.stateCode})
                                    </option>
                                ))}
                            </select>
                            {physicianForm.formState.errors.availableStates && (
                                <p className="mt-1 text-sm text-red-600">
                                    {physicianForm.formState.errors.availableStates.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Primary Specialty</label>
                            <select
                                {...physicianForm.register("specialtyType")}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">Select Specialty</option>
                                {specialties.map((specialty) => (
                                    <option key={specialty} value={specialty}>
                                        {specialty}
                                    </option>
                                ))}
                            </select>
                            {physicianForm.formState.errors.specialtyType && (
                                <p className="mt-1 text-sm text-red-600">
                                    {physicianForm.formState.errors.specialtyType.message}
                                </p>
                            )}
                        </div>

                        {/* Per-State Capacity Grid */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                    Per-State NP Capacity
                                </label>
                                <div className="text-sm text-gray-500">
                                    Total: {totalCurrentNPs}/{totalMaxNPs} NPs ({availableSpots} spots available)
                                </div>
                            </div>

                            {stateCapacities.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">
                                    Add licenses to configure per-state capacity
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    State
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Max NPs
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Current
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Accepting
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Notes
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {stateCapacities.map((capacity) => (
                                                <tr key={capacity.stateCode} className={!capacity.isAccepting ? "bg-gray-50" : ""}>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {capacity.stateCode}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {capacity.stateName}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={capacity.maxNpCapacity}
                                                            onChange={(e) => updateStateCapacity(
                                                                capacity.stateCode,
                                                                "maxNpCapacity",
                                                                parseInt(e.target.value) || 0
                                                            )}
                                                            className="w-16 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                                            disabled={!capacity.isAccepting}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={capacity.maxNpCapacity}
                                                            value={capacity.currentNpCount}
                                                            onChange={(e) => updateStateCapacity(
                                                                capacity.stateCode,
                                                                "currentNpCount",
                                                                parseInt(e.target.value) || 0
                                                            )}
                                                            className="w-16 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                                            disabled={!capacity.isAccepting}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            checked={capacity.isAccepting}
                                                            onChange={(e) => updateStateCapacity(
                                                                capacity.stateCode,
                                                                "isAccepting",
                                                                e.target.checked
                                                            )}
                                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={capacity.notes}
                                                            onChange={(e) => updateStateCapacity(
                                                                capacity.stateCode,
                                                                "notes",
                                                                e.target.value
                                                            )}
                                                            placeholder="Optional notes..."
                                                            className="w-full max-w-xs rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <p className="text-xs text-gray-500">
                                Set capacity per state. Uncheck &quot;Accepting&quot; to stop receiving requests for a specific state.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Supervision Model</label>
                            <select
                                {...physicianForm.register("supervisionModel")}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="hourly">Hourly Rate</option>
                                <option value="revenue_share">Revenue Share</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="flat_fee">Flat Fee</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Hourly Rate (optional)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...physicianForm.register("hourlyRate", { valueAsNumber: true })}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Revenue Share % (optional)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    {...physicianForm.register("revenueSharePercentage", { valueAsNumber: true })}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...physicianForm.register("isActive")}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Profile Active</span>
                            </label>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
                        )}

                        {success && (
                            <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
                                Profile saved successfully! Redirecting...
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting ? "Saving..." : "Save Profile"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={npForm.handleSubmit(onSubmitNP)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Seeking States</label>
                            <select
                                multiple
                                {...npForm.register("seekingStates")}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                size={5}
                            >
                                {licenses.map((license) => (
                                    <option key={license.id} value={license.state.stateCode}>
                                        {license.state.stateName} ({license.state.stateCode})
                                    </option>
                                ))}
                            </select>
                            {npForm.formState.errors.seekingStates && (
                                <p className="mt-1 text-sm text-red-600">{npForm.formState.errors.seekingStates.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Licensed States</label>
                            <select
                                multiple
                                {...npForm.register("licensedStates")}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                size={5}
                            >
                                {licenses.map((license) => (
                                    <option key={license.id} value={license.state.stateCode}>
                                        {license.state.stateName} ({license.state.stateCode})
                                    </option>
                                ))}
                            </select>
                            {npForm.formState.errors.licensedStates && (
                                <p className="mt-1 text-sm text-red-600">{npForm.formState.errors.licensedStates.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Primary Specialty</label>
                            <select
                                {...npForm.register("specialtyType")}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">Select Specialty</option>
                                {specialties.map((specialty) => (
                                    <option key={specialty} value={specialty}>
                                        {specialty}
                                    </option>
                                ))}
                            </select>
                            {npForm.formState.errors.specialtyType && (
                                <p className="mt-1 text-sm text-red-600">{npForm.formState.errors.specialtyType.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...npForm.register("needsCPA")}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">I need a CPA</span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hours Available per Week</label>
                            <input
                                type="number"
                                {...npForm.register("hoursPerWeekAvailable", { valueAsNumber: true })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Preferred Compensation Model</label>
                            <select
                                {...npForm.register("preferredCompensationModel")}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">Select Model</option>
                                <option value="hourly">Hourly</option>
                                <option value="revenue_share">Revenue Share</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="salary">Salary</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...npForm.register("isActive")}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Profile Active</span>
                            </label>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
                        )}

                        {success && (
                            <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
                                Profile saved successfully! Redirecting...
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting ? "Saving..." : "Save Profile"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
