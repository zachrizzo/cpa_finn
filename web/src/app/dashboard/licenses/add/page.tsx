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
import { PageHeader, ErrorMessage, VerificationModal, FormField, FormActions } from "@/components";
import { INPUT_CLASS } from "@/lib/utils";

const currentYear = new Date().getFullYear();

const licenseSchema = z.object({
    stateId: z.string().min(1, "State is required"),
    licenseNumber: z.string().min(1, "License number is required"),
    licenseType: z.enum(["NP", "RN", "MD", "DO"]),
    issueDate: z.string().refine((date) => new Date(date).toString() !== "Invalid Date", { message: "Valid date required" }),
    expirationDate: z.string().refine((date) => new Date(date).toString() !== "Invalid Date", { message: "Valid date required" }),
    supervisedHoursInState: z.string().optional(),
    supervisedYearsInState: z.string().optional(),
});

type LicenseFormValues = z.infer<typeof licenseSchema>;
type State = ListStatesData["states"][number];

const LICENSE_TYPE_OPTIONS = [
    { value: "NP", label: "Nurse Practitioner (NP)" },
    { value: "RN", label: "Registered Nurse (RN)" },
    { value: "MD", label: "Medical Doctor (MD)" },
    { value: "DO", label: "Doctor of Osteopathy (DO)" },
];

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

    const issueDate = watch("issueDate");
    const expirationDate = watch("expirationDate");
    const selectedStateId = watch("stateId");
    const selectedState = states.find((s) => s.id === selectedStateId);
    const showSupervisedTracking = stateRequiresSupervisedTracking(selectedState);

    useEffect(() => {
        async function fetchStates() {
            try {
                const { data } = await listStates(getDc());
                const sortedStates = [...data.states].sort((a, b) => a.stateName.localeCompare(b.stateName));
                setStates(sortedStates);
            } catch {
                toast.error("Failed to load states");
            }
        }
        fetchStates();
    }, []);

    async function onSubmit(data: LicenseFormValues) {
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

            const savedState = states.find((s) => s.id === data.stateId);
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
    }

    function handleVerifyNow() {
        if (verificationModal.verificationUrl) {
            window.open(verificationModal.verificationUrl, "_blank", "noopener,noreferrer");
        }
    }

    function handleSkipVerification() {
        setVerificationModal({ isOpen: false, stateName: "", verificationUrl: null });
        router.push("/dashboard/licenses");
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <PageHeader
                title="Add New License"
                description="Enter your license details to track compliance requirements."
            />

            <div className="bg-white p-6 shadow rounded-lg border">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField label="State" htmlFor="stateId" error={errors.stateId?.message}>
                            <select {...register("stateId")} className={INPUT_CLASS}>
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state.id || state.stateCode} value={state.id}>
                                        {state.stateName}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        {selectedState && <FPARequirementsCard state={selectedState} />}

                        <FormField label="License Number" htmlFor="licenseNumber" error={errors.licenseNumber?.message}>
                            <input {...register("licenseNumber")} type="text" className={INPUT_CLASS} />
                        </FormField>

                        <FormField label="License Type" htmlFor="licenseType">
                            <select {...register("licenseType")} className={INPUT_CLASS}>
                                {LICENSE_TYPE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </FormField>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="Issue Date" htmlFor="issueDate" error={errors.issueDate?.message}>
                                <MonthYearPicker
                                    id="issueDate"
                                    value={issueDate}
                                    onChange={(value) => setValue("issueDate", value, { shouldValidate: true })}
                                    minYear={1970}
                                    maxYear={currentYear}
                                />
                            </FormField>

                            <FormField label="Expiration Date" htmlFor="expirationDate" error={errors.expirationDate?.message}>
                                <MonthYearPicker
                                    id="expirationDate"
                                    value={expirationDate}
                                    onChange={(value) => setValue("expirationDate", value, { shouldValidate: true })}
                                    minYear={currentYear}
                                    maxYear={currentYear + 10}
                                />
                            </FormField>
                        </div>

                        {showSupervisedTracking && selectedState && (
                            <SupervisedTrackingSection
                                selectedState={selectedState}
                                register={register}
                                errors={errors}
                            />
                        )}
                    </div>

                    {error && <ErrorMessage message={error} />}

                    <FormActions
                        onCancel={() => router.back()}
                        isSubmitting={loading}
                        submitLabel="Save License"
                    />
                </form>
            </div>

            <VerificationModal
                isOpen={verificationModal.isOpen}
                stateName={verificationModal.stateName}
                verificationUrl={verificationModal.verificationUrl}
                onVerify={handleVerifyNow}
                onSkip={handleSkipVerification}
            />
        </div>
    );
}

interface SupervisedTrackingSectionProps {
    selectedState: State;
    register: ReturnType<typeof useForm<LicenseFormValues>>["register"];
    errors: ReturnType<typeof useForm<LicenseFormValues>>["formState"]["errors"];
}

function SupervisedTrackingSection({ selectedState, register, errors }: SupervisedTrackingSectionProps) {
    return (
        <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">FPA Eligibility Tracking</h3>
            <p className="text-xs text-gray-500 mb-3">
                {selectedState.stateName} requires supervised practice for FPA. Track your progress below.
            </p>

            <div className="grid grid-cols-2 gap-4">
                {selectedState.fpaHoursRequired && (
                    <FormField
                        label="Supervised Hours in State"
                        htmlFor="supervisedHoursInState"
                        error={errors.supervisedHoursInState?.message}
                        helpText={`Goal: ${selectedState.fpaHoursRequired.toLocaleString()} hours`}
                    >
                        <input
                            {...register("supervisedHoursInState")}
                            type="number"
                            min="0"
                            placeholder={`Required: ${selectedState.fpaHoursRequired.toLocaleString()}`}
                            className={INPUT_CLASS}
                        />
                    </FormField>
                )}

                {selectedState.fpaYearsRequired && (
                    <FormField
                        label="Supervised Years in State"
                        htmlFor="supervisedYearsInState"
                        error={errors.supervisedYearsInState?.message}
                        helpText={`Goal: ${selectedState.fpaYearsRequired} ${selectedState.fpaYearsRequired === 1 ? "year" : "years"}`}
                    >
                        <input
                            {...register("supervisedYearsInState")}
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder={`Required: ${selectedState.fpaYearsRequired}`}
                            className={INPUT_CLASS}
                        />
                    </FormField>
                )}
            </div>
        </div>
    );
}
