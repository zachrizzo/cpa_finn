"use client";

import type { ReactElement } from "react";
import { CheckCircle } from "lucide-react";

interface SuccessMessageProps {
  message: string;
}

export function SuccessMessage({ message }: SuccessMessageProps): ReactElement {
  return (
    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <p className="text-sm font-medium text-green-800">{message}</p>
      </div>
    </div>
  );
}
