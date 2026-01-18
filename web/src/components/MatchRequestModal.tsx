"use client";

import type { ReactElement } from "react";
import { MapPin } from "lucide-react";
import { Modal, ModalActions } from "./Modal";
import type { Provider } from "./ProviderCard";

interface State {
  id?: string;
  stateCode: string;
  stateName: string;
}

interface MatchRequestModalProps {
  provider: Provider;
  states: State[];
  selectedStateId: string;
  onStateChange: (stateId: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function MatchRequestModal({
  provider,
  states,
  selectedStateId,
  onStateChange,
  onClose,
  onSubmit,
  isSubmitting,
}: MatchRequestModalProps): ReactElement {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Request Match with ${provider.displayName}`}
    >
      <p className="text-sm text-gray-600 mb-4">
        Select a state for this collaboration agreement. You can only request a match for
        states where you are both licensed.
      </p>

      {provider.stateCapacity && (
        <StateCapacityInfo stateCapacity={provider.stateCapacity} />
      )}

      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State for Collaboration
        </label>
        <select
          value={selectedStateId}
          onChange={(e) => onStateChange(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select a state...</option>
          {states.map((state) => (
            <option key={state.id} value={state.id}>
              {state.stateName} ({state.stateCode})
            </option>
          ))}
        </select>
      </div>

      <ModalActions
        onCancel={onClose}
        onSubmit={onSubmit}
        submitLabel="Send Match Request"
        isSubmitting={isSubmitting}
        submitDisabled={!selectedStateId}
      />
    </Modal>
  );
}

interface StateCapacityInfoProps {
  stateCapacity: NonNullable<Provider["stateCapacity"]>;
}

function StateCapacityInfo({ stateCapacity }: StateCapacityInfoProps): ReactElement {
  return (
    <div className="mb-4 p-3 bg-blue-50 rounded-md">
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4 text-blue-600" />
        <span className="font-medium text-blue-900">
          {stateCapacity.stateCode} Capacity:
        </span>
        <span className={stateCapacity.isAccepting ? "text-green-700" : "text-red-700"}>
          {stateCapacity.currentNpCount}/{stateCapacity.maxNpCapacity} NPs
          {!stateCapacity.isAccepting && " (Not accepting)"}
        </span>
      </div>
      {stateCapacity.notes && (
        <p className="text-xs text-blue-700 mt-1">Note: {stateCapacity.notes}</p>
      )}
    </div>
  );
}
