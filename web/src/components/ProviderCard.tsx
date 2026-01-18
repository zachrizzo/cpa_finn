"use client";

import type { ReactElement } from "react";
import { MapPin } from "lucide-react";
import type { StateCapacityInfo } from "@/types";

export interface Provider {
  id: string;
  displayName: string;
  email: string;
  role: string;
  states: string;
  specialty: string;
  availability: string;
  supervisionModel?: string | null;
  hourlyRate?: number | null;
  revenueSharePercentage?: number | null;
  totalNpCapacity?: number | null;
  currentNpCount?: number | null;
  availableSpots?: number | null;
  hoursPerWeekAvailable?: number | null;
  preferredCompensationModel?: string | null;
  stateCapacity?: StateCapacityInfo | null;
}

interface ProviderCardProps {
  provider: Provider;
  onRequestMatch: (provider: Provider) => void;
}

interface AvailabilityInfo {
  text: string;
  isAvailable: boolean;
}

function formatStateAvailability(provider: Provider): AvailabilityInfo {
  const cap = provider.stateCapacity;

  if (cap) {
    const availableSpots = cap.maxNpCapacity - cap.currentNpCount;
    if (!cap.isAccepting) return { text: `Not accepting in ${cap.stateCode}`, isAvailable: false };
    if (availableSpots <= 0) return { text: `Full in ${cap.stateCode} (${cap.currentNpCount}/${cap.maxNpCapacity})`, isAvailable: false };
    return { text: `${cap.stateCode}: ${cap.currentNpCount}/${cap.maxNpCapacity} NPs (${availableSpots} spots)`, isAvailable: true };
  }

  const availableSpots = provider.availableSpots ?? 0;
  if (availableSpots > 0) {
    return { text: `${provider.currentNpCount}/${provider.totalNpCapacity} NPs (${availableSpots} spots)`, isAvailable: true };
  }
  return { text: "Not accepting", isAvailable: false };
}

export function ProviderCard({ provider, onRequestMatch }: ProviderCardProps): ReactElement {
  const stateAvailability = provider.role === "Physician" ? formatStateAvailability(provider) : null;

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{provider.displayName}</h3>
          <p className="text-sm text-gray-500">{provider.role}</p>
        </div>

        <div className="space-y-2 text-sm">
          <InfoRow label="States" value={provider.states} />
          <InfoRow label="Specialty" value={provider.specialty} />

          {provider.role === "Physician" && stateAvailability && (
            <div className="flex items-start gap-1">
              {provider.stateCapacity && (
                <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <span className="font-medium text-gray-700">Availability: </span>
                <span className={`font-medium ${stateAvailability.isAvailable ? "text-green-600" : "text-gray-600"}`}>
                  {stateAvailability.text}
                </span>
                {provider.stateCapacity?.notes && (
                  <p className="text-xs text-gray-500 mt-0.5">{provider.stateCapacity.notes}</p>
                )}
              </div>
            </div>
          )}

          {provider.role === "NP" && (
            <InfoRow label="Availability" value={provider.availability} />
          )}

          {provider.supervisionModel && (
            <InfoRow label="Model" value={provider.supervisionModel} />
          )}
          {provider.hourlyRate && (
            <InfoRow label="Rate" value={`$${provider.hourlyRate}/hr`} />
          )}
          {provider.revenueSharePercentage && (
            <InfoRow label="Revenue Share" value={`${provider.revenueSharePercentage}%`} />
          )}
        </div>

        <button
          className="w-full mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => onRequestMatch(provider)}
        >
          Request Match
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }): ReactElement {
  return (
    <div>
      <span className="font-medium text-gray-700">{label}: </span>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}
