"use client";

import type { ReactElement } from "react";
import { CheckCircle, Clock, XCircle, AlertCircle, type LucideIcon } from "lucide-react";
import type { ComplianceStatus } from "@/types";

type BadgeVariant = "success" | "warning" | "error" | "info" | "default";

interface StatusBadgeProps {
  variant: BadgeVariant;
  label: string;
  showIcon?: boolean;
}

const VARIANT_CONFIG: Record<BadgeVariant, { className: string; Icon: LucideIcon }> = {
  success: {
    className: "bg-green-100 text-green-800",
    Icon: CheckCircle,
  },
  warning: {
    className: "bg-yellow-100 text-yellow-800",
    Icon: Clock,
  },
  error: {
    className: "bg-red-100 text-red-800",
    Icon: XCircle,
  },
  info: {
    className: "bg-blue-100 text-blue-800",
    Icon: AlertCircle,
  },
  default: {
    className: "bg-gray-100 text-gray-800",
    Icon: AlertCircle,
  },
};

export function StatusBadge({ variant, label, showIcon = true }: StatusBadgeProps): ReactElement {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {label}
    </span>
  );
}

export type AgreementStatus = "active" | "pending_signatures" | "draft" | "terminated";

type BadgeProps = { variant: BadgeVariant; label: string };

const AGREEMENT_STATUS_MAP: Record<string, BadgeProps> = {
  terminated: { variant: "error", label: "Terminated" },
  pending_signatures: { variant: "warning", label: "Pending Signatures" },
  draft: { variant: "default", label: "Draft" },
};

export function getAgreementBadgeProps(status: string, isActive: boolean): BadgeProps {
  if (status === "terminated") return AGREEMENT_STATUS_MAP.terminated;
  if (isActive) return { variant: "success", label: "Active" };
  return AGREEMENT_STATUS_MAP[status] ?? AGREEMENT_STATUS_MAP.draft;
}

const COMPLIANCE_STATUS_MAP: Record<ComplianceStatus, BadgeProps> = {
  compliant: { variant: "success", label: "Compliant" },
  warning: { variant: "warning", label: "Due Soon" },
  overdue: { variant: "error", label: "Overdue" },
};

export function getComplianceBadgeProps(status: ComplianceStatus): BadgeProps {
  return COMPLIANCE_STATUS_MAP[status];
}

export type VerificationStatus = "verified" | "pending" | "unverified";

const VERIFICATION_STATUS_MAP: Record<string, BadgeProps> = {
  verified: { variant: "success", label: "Verified" },
};

export function getVerificationBadgeProps(status: string | null | undefined): BadgeProps {
  return VERIFICATION_STATUS_MAP[status ?? ""] ?? { variant: "warning", label: "Pending Verification" };
}
