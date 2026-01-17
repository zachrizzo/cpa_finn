"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getDc } from "@/lib/firebase";
import { listStates, createLicense, ListStatesData } from "@dataconnect/generated";
import { toast } from "sonner";
import MonthYearPicker from "@/components/MonthYearPicker";
import FPARequirementsCard, { stateRequiresSupervisedTracking } from "@/components/FPARequirementsCard";
import { CheckCircle, ExternalLink, X } from "lucide-react";

const currentYear = new Date().getFullYear();

const licenseSchema = z.object({
    stateId: z.string().min(1, "State is required"),
    licenseNumber: z.string().min(1, "License number is required"),
    licenseType: z.enum(["NP", "RN", "MD", "DO"]),
    issueDate: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', { message: "Valid date required" }),
    expirationDate: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', { message: "Valid date required" }),
    supervisedHoursInState: z.string().optional(),
    supervisedYearsInState: z.string().optional(),
});

type LicenseFormValues = z.infer<typeof licenseSchema>;
type State = ListStatesData['states'][number];

interface VerificationModalState {
    isOpen: boolean;
    stateName: string;
    verificationUrl: string | null | undefined;
}

export default function AddLicensePage() {
    const [states, setStates] = useState<State[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [verificationModal, setVerificationModal] = useState<VerificationModalState>({
        isOpen: false,
        stateName: "",
        verificationUrl: null,
    });
    const router = useRouter();

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<LicenseFormValues>({
        resolver: zodResolver(licenseSchema),
    });

    // Watch date values for the MonthYearPicker components
    const issueDate = watch("issueDate");
    const expirationDate = watch("expirationDate");

    // Watch stateId to display FPA requirements
    const selectedStateId = watch("stateId");
    const selectedState = states.find((s) => s.id === selectedStateId);
    const showSupervisedTracking = stateRequiresSupervisedTracking(selectedState);

    useEffect(() => {
        async function fetchStates() {
            try {
                const { data } = await listStates(getDc());
                // Sort states alphabetically by stateName as a fallback
                // (in case database orderBy doesn't work)
                const sortedStates = [...data.states].sort((a, b) =>
                    a.stateName.localeCompare(b.stateName)
                );
                setStates(sortedStates);
            } catch {
                toast.error("Failed to load states");
            }
        }
        fetchStates();
    }, []);

    const onSubmit = async (data: LicenseFormValues) => {
        setLoading(true);
        setError(null);
        try {
            await createLicense(getDc(), {
                stateId: data.stateId,
                licenseNumber: data.licenseNumber,
                licenseType: data.licenseType,
                issueDate: data.issueDate,
                expirationDate: data.expirationDate,
                verificationStatus: "pending_verification",
                supervisedHoursInState: data.supervisedHoursInState ? parseInt(data.supervisedHoursInState) : undefined,
                supervisedYearsInState: data.supervisedYearsInState ? parseInt(data.supervisedYearsInState) : undefined,
            });

            // Find the saved state to get its verification URL
            const savedState = states.find(s => s.id === data.stateId);

            // Show verification modal
            setVerificationModal({
                isOpen: true,
                stateName: savedState?.stateName || "your state",
                verificationUrl: savedState?.licenseVerificationUrl,
            });

            toast.success("License saved successfully!");
        } catch {
            setError("Failed to add license. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyNow = () => {
        if (verificationModal.verificationUrl) {
            window.open(verificationModal.verificationUrl, "_blank", "noopener,noreferrer");
        }
    };

    const handleSkipVerification = () => {
        setVerificationModal({ isOpen: false, stateName: "", verificationUrl: null });
        router.push("/dashboard/licenses");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add New License</h1>
                <p className="text-gray-500">Enter your license details to track compliance requirements.</p>
            </div>

            <div className="bg-white p-6 shadow rounded-lg border">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="stateId" className="block text-sm font-medium text-gray-700">State</label>
                            <select
                                {...register("stateId")}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state.id || state.stateCode} value={state.id}>
                                        {state.stateName}
                                    </option>
                                ))}
                            </select>
                            {errors.stateId && <p className="mt-1 text-sm text-red-600">{errors.stateId.message}</p>}
                        </div>

                        {/* FPA Requirements Card - shown when a state is selected */}
                        {selectedState && (
                            <FPARequirementsCard state={selectedState} />
                        )}

                        <div>
                            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">License Number</label>
                            <input
                                {...register("licenseNumber")}
                                type="text"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            />
                            {errors.licenseNumber && <p className="mt-1 text-sm text-red-600">{errors.licenseNumber.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="licenseType" className="block text-sm font-medium text-gray-700">License Type</label>
                            <select
                                {...register("licenseType")}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="NP">Nurse Practitioner (NP)</option>
                                <option value="RN">Registered Nurse (RN)</option>
                                <option value="MD">Medical Doctor (MD)</option>
                                <option value="DO">Doctor of Osteopathy (DO)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Issue Date
                                </label>
                                <MonthYearPicker
                                    id="issueDate"
                                    value={issueDate}
                                    onChange={(value) => setValue("issueDate", value, { shouldValidate: true })}
                                    minYear={1970}
                                    maxYear={currentYear}
                                />
                                {errors.issueDate && <p className="mt-1 text-sm text-red-600">{errors.issueDate.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Expiration Date
                                </label>
                                <MonthYearPicker
                                    id="expirationDate"
                                    value={expirationDate}
                                    onChange={(value) => setValue("expirationDate", value, { shouldValidate: true })}
                                    minYear={currentYear}
                                    maxYear={currentYear + 10}
                                />
                                {errors.expirationDate && <p className="mt-1 text-sm text-red-600">{errors.expirationDate.message}</p>}
                            </div>
                        </div>

                        {/* Supervised Hours/Years Section - only shown for states that require it */}
                        {showSupervisedTracking && selectedState && (
                            <div className="border-t pt-4 mt-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-3">
                                    FPA Eligibility Tracking
                                </h3>
                                <p className="text-xs text-gray-500 mb-3">
                                    {selectedState.stateName} requires supervised practice for FPA. Track your progress below.
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    {selectedState.fpaHoursRequired && (
                                        <div>
                                            <label htmlFor="supervisedHoursInState" className="block text-sm font-medium text-gray-700">
                                                Supervised Hours in State
                                            </label>
                                            <input
                                                {...register("supervisedHoursInState")}
                                                type="number"
                                                min="0"
                                                placeholder={`Required: ${selectedState.fpaHoursRequired.toLocaleString()}`}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Goal: {selectedState.fpaHoursRequired.toLocaleString()} hours
                                            </p>
                                            {errors.supervisedHoursInState && (
                                                <p className="mt-1 text-sm text-red-600">{errors.supervisedHoursInState.message}</p>
                                            )}
                                        </div>
                                    )}

                                    {selectedState.fpaYearsRequired && (
                                        <div>
                                            <label htmlFor="supervisedYearsInState" className="block text-sm font-medium text-gray-700">
                                                Supervised Years in State
                                            </label>
                                            <input
                                                {...register("supervisedYearsInState")}
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                placeholder={`Required: ${selectedState.fpaYearsRequired}`}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Goal: {selectedState.fpaYearsRequired} {selectedState.fpaYearsRequired === 1 ? "year" : "years"}
                                            </p>
                                            {errors.supervisedYearsInState && (
                                                <p className="mt-1 text-sm text-red-600">{errors.supervisedYearsInState.message}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save License"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Verification Modal */}
            {verificationModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <button
                            onClick={handleSkipVerification}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Your license has been saved!
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                To verify your license, click below to visit the {verificationModal.stateName} state board website.
                                Once you have confirmed your license details, you can mark it as verified in the licenses list.
                            </p>

                            <div className="flex flex-col gap-3">
                                {verificationModal.verificationUrl ? (
                                    <>
                                        <button
                                            onClick={handleVerifyNow}
                                            className="inline-flex items-center justify-center gap-2 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            Verify on State Board Website
                                        </button>
                                        <button
                                            onClick={handleSkipVerification}
                                            className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            Skip for now
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md">
                                            No verification URL is available for {verificationModal.stateName}.
                                            You can manually search for the state board website to verify your license.
                                        </p>
                                        <button
                                            onClick={handleSkipVerification}
                                            className="inline-flex items-center justify-center w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            Continue to Licenses
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
