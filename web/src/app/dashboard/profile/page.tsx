"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ExternalLink, Mail, Calendar, Shield } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { getDc } from "@/lib/firebase";
import { getMyProfile, upsertUserProfile } from "@dataconnect/generated";
import { toast } from "sonner";

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
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: "",
        },
    });

    useEffect(() => {
        async function loadProfile() {
            try {
                const { data } = await getMyProfile(getDc());
                if (data.user) {
                    setProfile(data.user);
                    form.reset({
                        displayName: data.user.displayName || "",
                    });
                }
            } catch (error) {
                console.error("Failed to load profile:", error);
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, [form]);

    const onSubmit = async (data: ProfileFormValues) => {
        setSubmitting(true);
        try {
            await upsertUserProfile(getDc(), {
                displayName: data.displayName,
                role: profile?.role || null,
            });
            setProfile((prev) => prev ? { ...prev, displayName: data.displayName } : null);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatRole = (role: string | null | undefined) => {
        if (!role) return "Not set";
        return role === "np" ? "Nurse Practitioner" : role.charAt(0).toUpperCase() + role.slice(1);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Profile</h1>
                <p className="text-gray-500">Manage your account settings and profile information.</p>
            </div>

            {/* Account Information Card */}
            <div className="bg-white p-6 shadow rounded-lg border">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Mail className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="text-sm font-medium text-gray-900">
                                {user?.email || profile?.email || "Not available"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Shield className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Account Type</p>
                            <p className="text-sm font-medium text-gray-900">{formatRole(profile?.role)}</p>
                        </div>
                    </div>

                    {profile?.createdAt && (
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Member Since</p>
                                <p className="text-sm font-medium text-gray-900">{formatDate(profile.createdAt)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Display Name Card */}
            <div className="bg-white p-6 shadow rounded-lg border">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Display Name</h2>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                            Display Name
                        </label>
                        <input
                            type="text"
                            id="displayName"
                            {...form.register("displayName")}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            placeholder="Enter your display name"
                        />
                        {form.formState.errors.displayName && (
                            <p className="mt-1 text-sm text-red-600">{form.formState.errors.displayName.message}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            This name will be displayed to other users in the directory and messages.
                        </p>
                    </div>

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
