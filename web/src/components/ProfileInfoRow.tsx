"use client";

import type { ReactElement, ElementType } from "react";

interface ProfileInfoRowProps {
  icon: ElementType;
  label: string;
  value: string;
}

export function ProfileInfoRow({ icon: Icon, label, value }: ProfileInfoRowProps): ReactElement {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
        <Icon className="h-5 w-5 text-gray-500" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
