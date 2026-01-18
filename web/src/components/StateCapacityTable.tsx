"use client";

import type { ReactElement } from "react";

interface StateCapacity {
  id?: string;
  stateId: string;
  stateCode: string;
  stateName: string;
  maxNpCapacity: number;
  currentNpCount: number;
  isAccepting: boolean;
  notes: string;
}

interface StateCapacityTableProps {
  capacities: StateCapacity[];
  onUpdate: (stateCode: string, field: keyof StateCapacity, value: number | boolean | string) => void;
  totalMaxNPs: number;
  totalCurrentNPs: number;
  availableSpots: number;
}

export function StateCapacityTable({
  capacities,
  onUpdate,
  totalMaxNPs,
  totalCurrentNPs,
  availableSpots,
}: StateCapacityTableProps): ReactElement {
  if (capacities.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        Add licenses to configure per-state capacity
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Per-State NP Capacity
        </label>
        <div className="text-sm text-gray-500">
          Total: {totalCurrentNPs}/{totalMaxNPs} NPs ({availableSpots} spots available)
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                State
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max NPs
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accepting
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {capacities.map((capacity) => (
              <StateCapacityRow
                key={capacity.stateCode}
                capacity={capacity}
                onUpdate={onUpdate}
              />
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">
        Set capacity per state. Uncheck &quot;Accepting&quot; to stop receiving requests for a specific state.
      </p>
    </div>
  );
}

interface StateCapacityRowProps {
  capacity: StateCapacity;
  onUpdate: (stateCode: string, field: keyof StateCapacity, value: number | boolean | string) => void;
}

function StateCapacityRow({ capacity, onUpdate }: StateCapacityRowProps): ReactElement {
  const inputClass = "w-16 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500";

  return (
    <tr className={!capacity.isAccepting ? "bg-gray-50" : ""}>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {capacity.stateCode}
        </div>
        <div className="text-xs text-gray-500">
          {capacity.stateName}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <input
          type="number"
          min="0"
          max="100"
          value={capacity.maxNpCapacity}
          onChange={(e) => onUpdate(capacity.stateCode, "maxNpCapacity", parseInt(e.target.value) || 0)}
          className={inputClass}
          disabled={!capacity.isAccepting}
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <input
          type="number"
          min="0"
          max={capacity.maxNpCapacity}
          value={capacity.currentNpCount}
          onChange={(e) => onUpdate(capacity.stateCode, "currentNpCount", parseInt(e.target.value) || 0)}
          className={inputClass}
          disabled={!capacity.isAccepting}
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <input
          type="checkbox"
          checked={capacity.isAccepting}
          onChange={(e) => onUpdate(capacity.stateCode, "isAccepting", e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="text"
          value={capacity.notes}
          onChange={(e) => onUpdate(capacity.stateCode, "notes", e.target.value)}
          placeholder="Optional notes..."
          className="w-full max-w-xs rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </td>
    </tr>
  );
}
