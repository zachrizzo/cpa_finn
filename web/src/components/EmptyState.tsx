"use client";

import type { ReactElement } from "react";
import { type LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps): ReactElement {
  return (
    <div className="p-8 text-center">
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      {action && (
        <div className="mt-6">
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            {action.icon && <action.icon className="h-4 w-4" />}
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
}

interface TableEmptyStateProps {
  colSpan: number;
  message: string;
}

export function TableEmptyState({
  colSpan,
  message,
}: TableEmptyStateProps): ReactElement {
  return (
    <tr>
      <td colSpan={colSpan} className="p-4 text-center text-gray-500">
        {message}
      </td>
    </tr>
  );
}
