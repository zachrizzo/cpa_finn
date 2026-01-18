"use client";

import type { ReactElement } from "react";
import { AlertCircle, XCircle, type LucideIcon } from "lucide-react";

type AlertVariant = "info" | "warning" | "error" | "success";

interface VariantStyles {
  bg: string;
  border: string;
  titleColor: string;
  textColor: string;
  iconColor: string;
  Icon: LucideIcon;
}

const VARIANT_STYLES: Record<AlertVariant, VariantStyles> = {
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    titleColor: "text-blue-800",
    textColor: "text-blue-700",
    iconColor: "text-blue-600",
    Icon: AlertCircle,
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    titleColor: "text-yellow-800",
    textColor: "text-yellow-700",
    iconColor: "text-yellow-600",
    Icon: AlertCircle,
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    titleColor: "text-red-800",
    textColor: "text-red-700",
    iconColor: "text-red-600",
    Icon: XCircle,
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    titleColor: "text-green-800",
    textColor: "text-green-700",
    iconColor: "text-green-600",
    Icon: AlertCircle,
  },
};

interface ErrorMessageProps {
  message: string;
  variant?: "error" | "warning";
}

export function ErrorMessage({ message, variant = "error" }: ErrorMessageProps): ReactElement {
  const styles = VARIANT_STYLES[variant];

  return (
    <div className={`rounded-md ${styles.bg} p-4`}>
      <div className="flex items-start gap-3">
        <styles.Icon className={`h-5 w-5 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
        <p className={`text-sm ${styles.textColor}`}>{message}</p>
      </div>
    </div>
  );
}

interface AlertBannerProps {
  title: string;
  description?: string;
  variant?: AlertVariant;
}

export function AlertBanner({ title, description, variant = "info" }: AlertBannerProps): ReactElement {
  const styles = VARIANT_STYLES[variant];

  return (
    <div className={`rounded-lg border ${styles.border} ${styles.bg} p-4`}>
      <div className="flex items-start gap-3">
        <styles.Icon className={`h-5 w-5 ${styles.iconColor} mt-0.5`} />
        <div>
          <h3 className={`text-sm font-medium ${styles.titleColor}`}>{title}</h3>
          {description && <p className={`mt-1 text-sm ${styles.textColor}`}>{description}</p>}
        </div>
      </div>
    </div>
  );
}
