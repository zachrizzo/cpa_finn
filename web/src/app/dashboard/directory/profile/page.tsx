"use client";

import { useEffect, useState } from "react";
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
} from "@dataconnect/generated";
import { toast } from "sonner";

const physicianProfileSchema = z.object({
    availableStates: z.string().min(1, "Select at least one state"),
    specialtyType: z.string().min(1, "Specialty is required"),
    maxNPs: z.number().min(1, "Must accept at least 1 NP").max(100),
    currentNPCount: z.number().min(0).max(100),
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

interface DirectoryProfile {
    physician?: {
        id: string;
    };
    np?: {
        id: string;
    };
}

export default function DirectoryProfilePage() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [licenses, setLicenses] = useState<License[]>([]);
    const [existingProfile, setExistingProfile] = useState<DirectoryProfile | null>(null);
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
            maxNPs: 1,
            currentNPCount: 0,
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

    useEffect(() => {
        async function loadProfile() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            try {
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
                            maxNPs: profile.totalNpCapacity || 1,
                            currentNPCount: profile.currentNpCount || 0,
                            supervisionModel: (profile.supervisionModel as "hourly" | "revenue_share" | "hybrid" | "flat_fee") || "hourly",
                            hourlyRate: profile.hourlyRate || undefined,
                            revenueSharePercentage: profile.revenueSharePercentage || undefined,
                            isActive: profile.isActive ?? true,
                        });
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
                    }
                } catch {
                    // No existing profile found, will create new one
                }
            } catch {
                toast.error("Failed to load profile data");
                setError("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    const onSubmitPhysician = async (data: PhysicianProfileFormValues) => {
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            if (existingProfile?.physician) {
                // Update existing profile
                await updatePhysicianDirectoryProfile(getDc(), {
                    userId: existingProfile.physician.id,
                    availableStates: data.availableStates,
                    primarySpecialty: data.specialtyType,
                    maxNPs: data.maxNPs,
                    availableSpots: data.maxNPs - data.currentNPCount,
                    currentNpCount: data.currentNPCount,
                    supervisionModel: data.supervisionModel,
                    hourlyRate: data.hourlyRate || null,
                    revenueSharePercentage: data.revenueSharePercentage || null,
                    isActive: data.isActive,
                    profileVisibility: "public",
                });
            } else {
                // Create new profile - need userId from auth
                // For now, using placeholder
                const tempUserId = "00000000-0000-0000-0000-000000000000"; // Will be replaced with auth.uid
                await createPhysicianDirectory(getDc(), {
                    userId: tempUserId,
                    availableStates: data.availableStates,
                    specialtyType: data.specialtyType,
                    maxNPs: data.maxNPs,
                    currentNPCount: data.currentNPCount,
                    availableForNewNPs: data.maxNPs > data.currentNPCount,
                    supervisionModel: data.supervisionModel,
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

    const onSubmitNP = async (data: NPProfileFormValues) => {
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            if (existingProfile?.np) {
                // Update existing profile
                await updateNpDirectoryProfile(getDc(), {
                    userId: existingProfile.np.id,
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
                const tempUserId = "00000000-0000-0000-0000-000000000000"; // Will be replaced with auth.uid
                await createNpDirectory(getDc(), {
                    userId: tempUserId,
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

    return (
        <div className="max-w-3xl mx-auto space-y-6">
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

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Maximum NPs</label>
                                <input
                                    type="number"
                                    {...physicianForm.register("maxNPs", { valueAsNumber: true })}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                />
                                {physicianForm.formState.errors.maxNPs && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {physicianForm.formState.errors.maxNPs.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current NP Count</label>
                                <input
                                    type="number"
                                    {...physicianForm.register("currentNPCount", { valueAsNumber: true })}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
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
