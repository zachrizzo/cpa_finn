"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getDc } from "@/lib/firebase";
import { listStates, createLicense } from "@dataconnect/generated";
import { toast } from "sonner";

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

export default function AddLicensePage() {
    const [states, setStates] = useState<unknown[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<LicenseFormValues>({
        resolver: zodResolver(licenseSchema),
    });

    useEffect(() => {
        async function fetchStates() {
            try {
                const { data } = await listStates(getDc());
                setStates(data.states);
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
            router.push("/dashboard/licenses");
        } catch {
            // console.error(err);
            setError("Failed to add license. Please try again.");
        } finally {
            setLoading(false);
        }
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
                                {/* Fallback if IDs are not UUID but something else, though schema says UUID. 
                     Wait, schema says State @table. 
                     If I don't have IDs in listStates query, I might fail.
                     Let's check queries.gql... it selects stateCode, stateName... BUT NOT ID. 
                     CRITICAL MISTAKE in queries.gql vs usage here? 
                     'state(id: $id)' exists, but 'states' query returns code/name. 
                     Data Connect usually generates an ID for @table unless @table(key: ...) is user defined. 
                     Checking schema.gql: State @table (no key). So it has a UUID 'id' field implicit.
                     I need to update queries.gql to fetch ID. 
                 */}
                                <option disabled>Loading states...</option>
                            </select>
                            {errors.stateId && <p className="mt-1 text-sm text-red-600">{errors.stateId.message}</p>}
                        </div>

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

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">Issue Date</label>
                                <input
                                    {...register("issueDate")}
                                    type="date"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                />
                                {errors.issueDate && <p className="mt-1 text-sm text-red-600">{errors.issueDate.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">Expiration Date</label>
                                <input
                                    {...register("expirationDate")}
                                    type="date"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                />
                                {errors.expirationDate && <p className="mt-1 text-sm text-red-600">{errors.expirationDate.message}</p>}
                            </div>
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">FPA Eligibility Tracking (Optional)</h3>
                            <p className="text-xs text-gray-500 mb-3">Track supervised hours and years to calculate FPA eligibility</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="supervisedHoursInState" className="block text-sm font-medium text-gray-700">
                                        Supervised Hours in State
                                    </label>
                                    <input
                                        {...register("supervisedHoursInState")}
                                        type="number"
                                        min="0"
                                        placeholder="e.g., 2000"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                    />
                                    {errors.supervisedHoursInState && (
                                        <p className="mt-1 text-sm text-red-600">{errors.supervisedHoursInState.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="supervisedYearsInState" className="block text-sm font-medium text-gray-700">
                                        Supervised Years in State
                                    </label>
                                    <input
                                        {...register("supervisedYearsInState")}
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        placeholder="e.g., 2.5"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                    />
                                    {errors.supervisedYearsInState && (
                                        <p className="mt-1 text-sm text-red-600">{errors.supervisedYearsInState.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
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
        </div>
    );
}
