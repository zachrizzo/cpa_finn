"use client";

import type { ReactElement } from "react";
import { type LucideIcon, Info } from "lucide-react";

type BannerVariant = "blue" | "green" | "yellow" | "red" | "gray";

interface InfoBannerProps {
  icon?: LucideIcon;
  title?: string;
  children: React.ReactNode;
  variant?: BannerVariant;
}

const VARIANT_CLASSES: Record<BannerVariant, { container: string; icon: string; title: string; body: string }> = {
  blue: {
    container: "border-blue-200 bg-blue-50",
    icon: "text-blue-600",
    title: "text-blue-900",
    body: "text-blue-700",
  },
  green: {
    container: "border-green-200 bg-green-50",
    icon: "text-green-600",
    title: "text-green-900",
    body: "text-green-700",
  },
  yellow: {
    container: "border-yellow-200 bg-yellow-50",
    icon: "text-yellow-600",
    title: "text-yellow-900",
    body: "text-yellow-700",
  },
  red: {
    container: "border-red-200 bg-red-50",
    icon: "text-red-600",
    title: "text-red-900",
    body: "text-red-700",
  },
  gray: {
    container: "border-gray-200 bg-gray-50",
    icon: "text-gray-600",
    title: "text-gray-900",
    body: "text-gray-700",
  },
};

export function InfoBanner({
  icon: Icon = Info,
  title,
  children,
  variant = "blue",
}: InfoBannerProps): ReactElement {
  const classes = VARIANT_CLASSES[variant];

  return (
    <div className={`rounded-md border p-4 ${classes.container}`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 ${classes.icon}`} />
        <div>
          {title && (
            <p className={`text-sm font-medium ${classes.title}`}>{title}</p>
          )}
          <div className={`text-sm ${title ? "mt-1" : ""} ${classes.body}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
