"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, BadgeCheck, BookUser, LogOut, ClipboardCheck } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export default function Sidebar() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    const links = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/licenses", label: "My Licenses", icon: BadgeCheck },
        // Placeholder for future phases
        { href: "/dashboard/directory", label: "Directory", icon: BookUser },
        { href: "/dashboard/agreements", label: "Agreements", icon: FileText },
        { href: "/dashboard/compliance", label: "Compliance", icon: ClipboardCheck },
    ];

    return (
        <div className="flex flex-col h-full w-64 bg-white border-r border-gray-200">
            <div className="flex h-16 items-center justify-center border-b border-gray-200">
                <h1 className="text-xl font-bold text-blue-600">Finn</h1>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {link.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="border-t border-gray-200 p-4">
                <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
