"use client";

import type { ReactElement } from "react";

interface StateRequirementsCardProps {
  stateCode: string;
  requirements: Array<{ label: string; value: string | number | null | undefined }>;
  fallbackMessage?: string;
}

export function StateRequirementsCard({
  stateCode,
  requirements,
  fallbackMessage = "No specific state requirements",
}: StateRequirementsCardProps): ReactElement {
  const validRequirements = requirements.filter((r) => r.value != null && r.value !== "");

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <h3 className="text-sm font-medium text-blue-800 mb-2">State Requirements - {stateCode}</h3>
      <div className="text-sm text-blue-700 space-y-1">
        {validRequirements.length > 0 ? (
          validRequirements.map((req, index) => (
            <p key={index}>
              {req.label}: {req.value}
            </p>
          ))
        ) : (
          <p>{fallbackMessage}</p>
        )}
      </div>
    </div>
  );
}
