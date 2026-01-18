"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpUser } from "@/lib/auth-helpers";
import { INPUT_CLASS } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button, GoogleSignInButton } from "@/components";

const registerSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["NP", "PHYSICIAN"], { message: "Please select a role" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage(): React.ReactNode {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "NP",
    },
  });

  const selectedRole = watch("role");

  async function onSubmit(data: RegisterFormValues): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      await signUpUser(data.email, data.password, data.displayName, data.role);
      router.push("/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to register";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function handleRoleChange(value: string): void {
    setValue("role", value as "NP" | "PHYSICIAN");
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create account</h2>
          <p className="mt-2 text-sm text-gray-600">For Nurse Practitioners and Physicians</p>
        </div>

        <Tabs defaultValue="NP" onValueChange={handleRoleChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="NP">Nurse Practitioner</TabsTrigger>
            <TabsTrigger value="PHYSICIAN">Physician</TabsTrigger>
          </TabsList>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  {...register("displayName")}
                  type="text"
                  className={INPUT_CLASS}
                />
                {errors.displayName && (
                  <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  className={INPUT_CLASS}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  {...register("password")}
                  type="password"
                  autoComplete="new-password"
                  className={INPUT_CLASS}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

            <div className="space-y-3">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating account..." : "Sign up"}
              </Button>
              <GoogleSignInButton role={selectedRole} mode="signup" />
            </div>
          </form>
        </Tabs>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
