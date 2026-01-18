"use client";

import type { ReactElement, ReactNode } from "react";
import { type LucideIcon, Plus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export function MetricCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}: MetricCardProps): ReactElement {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`rounded-full ${iconBg} p-3`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  onClick: () => void;
  actionIcon?: LucideIcon;
}

export function QuickActionCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  onClick,
  actionIcon: ActionIcon = Plus,
}: QuickActionCardProps): ReactElement {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between rounded-lg border bg-white p-4 text-left shadow-sm transition-colors hover:bg-gray-50 w-full"
    >
      <div className="flex items-center gap-3">
        <div className={`rounded-full ${iconBg} p-2`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <ActionIcon className="h-5 w-5 text-gray-400" />
    </button>
  );
}

interface StatCardProps {
  label: string;
  value: ReactNode;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
  };
}

export function StatCard({ label, value, trend }: StatCardProps): ReactElement {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-500",
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      {trend && (
        <p className={`mt-1 text-xs ${trendColors[trend.direction]}`}>
          {trend.value}
        </p>
      )}
    </div>
  );
}
