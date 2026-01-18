"use client";

import type { ReactElement } from "react";

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({
  message = "Loading...",
  fullScreen = false,
}: LoadingStateProps): ReactElement {
  const containerClasses = fullScreen
    ? "flex h-screen items-center justify-center bg-gray-50"
    : "flex items-center justify-center min-h-[400px]";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}

interface TableLoadingStateProps {
  message?: string;
  colSpan?: number;
}

export function TableLoadingState({
  message = "Loading...",
  colSpan = 1,
}: TableLoadingStateProps): ReactElement {
  return (
    <tr>
      <td colSpan={colSpan} className="p-8 text-center text-gray-500">
        {message}
      </td>
    </tr>
  );
}
