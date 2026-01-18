"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  BookUser,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  User,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_LINKS: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/licenses", label: "My Licenses", icon: BadgeCheck },
  { href: "/dashboard/directory", label: "Directory", icon: BookUser },
  { href: "/dashboard/agreements", label: "Agreements", icon: FileText },
  { href: "/dashboard/messages", label: "Messages", icon: MessageCircle },
  { href: "/dashboard/compliance", label: "Compliance", icon: ClipboardCheck },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
];

function getNavLinkClassName(isActive: boolean): string {
  const base = "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors";
  if (isActive) {
    return `${base} bg-blue-50 text-blue-600`;
  }
  return `${base} text-gray-700 hover:bg-gray-100 hover:text-gray-900`;
}

export default function Sidebar(): React.ReactNode {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Finn</h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link href={href} className={getNavLinkClassName(pathname === href)}>
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-gray-200 p-4">
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
