"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ExternalLink, Mail, Calendar, Shield } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { getDc } from "@/lib/firebase";
import { getMyProfile, upsertUserProfile } from "@dataconnect/generated";
import { toast } from "sonner";
import { LoadingState, PageHeader, ProfileInfoRow, FormField } from "@/components";
import { formatDateFull, formatRole } from "@/lib/format";
import { INPUT_CLASS } from "@/lib/utils";
import { useProtectedData } from "@/hooks";

const profileSchema = z.object({
    displayName: z.string().min(1, "Display name is required").max(100, "Display name is too long"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface UserProfile {
    email: string;
    displayName?: string | null;
    role?: string | null;
    createdAt: string;
    updatedAt?: string | null;
}

export default function ProfilePage() {
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);

    const { data: profile, loading } = useProtectedData<UserProfile | null>({
        fetcher: async (dc) => {
            const { data } = await getMyProfile(dc);
            return data.user ?? null;
        },
        errorMessage: "Failed to load profile data",
    });

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { displayName: "" },
        values: profile ? { displayName: profile.displayName || "" } : undefined,
    });

    async function onSubmit(data: ProfileFormValues) {
        setSubmitting(true);
        try {
            await upsertUserProfile(getDc(), {
                displayName: data.displayName,
                role: profile?.role || null,
            });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return <LoadingState message="Loading profile..." />;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <PageHeader
                title="My Profile"
                description="Manage your account settings and profile information."
            />

            {/* Account Information Card */}
            <div className="bg-white p-6 shadow rounded-lg border">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
                <div className="space-y-4">
                    <ProfileInfoRow
                        icon={Mail}
                        label="Email Address"
                        value={user?.email || profile?.email || "Not available"}
                    />
                    <ProfileInfoRow
                        icon={Shield}
                        label="Account Type"
                        value={formatRole(profile?.role)}
                    />
                    {profile?.createdAt && (
                        <ProfileInfoRow
                            icon={Calendar}
                            label="Member Since"
                            value={formatDateFull(profile.createdAt)}
                        />
                    )}
                </div>
            </div>

            {/* Edit Display Name Card */}
            <div className="bg-white p-6 shadow rounded-lg border">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Display Name</h2>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        label="Display Name"
                        htmlFor="displayName"
                        error={form.formState.errors.displayName?.message}
                        helpText="This name will be displayed to other users in the directory and messages."
                    >
                        <input
                            type="text"
                            id="displayName"
                            {...form.register("displayName")}
                            className={INPUT_CLASS}
                            placeholder="Enter your display name"
                        />
                    </FormField>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting || !form.formState.isDirty}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Directory Profile Link Card */}
            <div className="bg-white p-6 shadow rounded-lg border">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Directory Profile</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage your public profile in the provider directory.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/directory/profile"
                        className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                        Edit Directory Profile
                        <ExternalLink className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
