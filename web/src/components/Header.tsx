"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { getDisplayName } from "@/lib/format";

export default function Header(): React.ReactNode {
  const { user } = useAuth();

  const displayName = user ? getDisplayName(user) : "Profile";

  return (
    <header className="flex h-16 items-center justify-end border-b bg-white px-6">
      <Link
        href="/dashboard/profile"
        className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <span className="text-sm font-medium text-gray-700">{displayName}</span>
      </Link>
    </header>
  );
}
