"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth-helpers";

interface GoogleSignInButtonProps {
  role?: string;
  mode?: "signin" | "signup";
}

function GoogleIcon(): React.ReactNode {
  return (
    <svg
      className="mr-2 h-4 w-4"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      />
    </svg>
  );
}

export default function GoogleSignInButton({
  role,
  mode = "signin",
}: GoogleSignInButtonProps): React.ReactNode {
  const router = useRouter();

  async function handleGoogleAuth(): Promise<void> {
    try {
      await signInWithGoogle(role);
      router.push("/dashboard");
    } catch {
      const action = mode === "signin" ? "Sign In" : "Sign Up";
      toast.error(`Google ${action} failed`);
    }
  }

  const buttonText = mode === "signin" ? "Sign in with Google" : "Sign up with Google";

  return (
    <Button variant="outline" type="button" className="w-full" onClick={handleGoogleAuth}>
      <GoogleIcon />
      {buttonText}
    </Button>
  );
}
