"use client";

import type { ReactElement } from "react";

interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

interface ToggleButtonProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function ToggleButton<T extends string>({
  options,
  value,
  onChange,
}: ToggleButtonProps<T>): ReactElement {
  return (
    <div className="flex gap-2">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
