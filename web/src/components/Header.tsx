"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export default function Header() {
    const { user } = useAuth();

    return (
        <header className="h-16 border-b bg-white flex items-center justify-end px-6">
            <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
            >
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                    {user?.displayName || user?.email?.split("@")[0] || "Profile"}
                </span>
            </Link>
        </header>
    );
}
