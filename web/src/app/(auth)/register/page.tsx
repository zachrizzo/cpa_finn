"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpUser, signInWithGoogle } from "@/lib/auth-helpers";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// Icons import removed as we use inline SVG

function GoogleSignUpButton({ role }: { role: string }) {
    const router = useRouter();
    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle(role);
            router.push("/dashboard");
        } catch {
            toast.error("Google Sign Up failed");
        }
    };
    return (
        <Button variant="outline" type="button" className="w-full" onClick={handleGoogleSignIn}>
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Sign up with Google
        </Button>
    )
}

const registerSchema = z.object({
    displayName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["NP", "PHYSICIAN"], { message: "Please select a role" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: "NP",
        }
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setLoading(true);
        setError(null);
        try {
            await signUpUser(data.email, data.password, data.displayName, data.role);
            router.push("/dashboard");
        } catch (error) {
            const err = error as Error;
            setError(err.message || "Failed to register");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow rounded-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        For Nurse Practitioners and Physicians
                    </p>
                </div>

                <Tabs defaultValue="NP" onValueChange={(val: string) => setValue("role", val as "NP" | "PHYSICIAN")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="NP">Nurse Practitioner</TabsTrigger>
                        <TabsTrigger value="PHYSICIAN">Physician</TabsTrigger>
                    </TabsList>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    {...register("displayName")}
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                />
                                {errors.displayName && <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                                <input
                                    {...register("email")}
                                    type="email"
                                    autoComplete="email"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    {...register("password")}
                                    type="password"
                                    autoComplete="new-password"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {loading ? "Creating account..." : "Sign up"}
                            </button>

                            <GoogleSignUpButton role={watch("role")} />
                        </div>
                    </form>
                </Tabs>

                <div className="text-center text-sm">
                    Already have an account? <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">Log in</Link>
                </div>
            </div>
        </div>
    );
}
