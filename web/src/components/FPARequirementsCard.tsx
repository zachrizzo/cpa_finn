"use client";

import type { ReactElement } from "react";
import { formatNumber, pluralize } from "@/lib/format";

interface FPAState {
    stateName: string;
    stateCode: string;
    fpaAvailable: boolean;
    fpaAutomaticWithLicense?: boolean | null;
    fpaRequiresApplication?: boolean | null;
    fpaHoursRequired?: number | null;
    fpaYearsRequired?: number | null;
    fpaWithinStateRequired?: boolean | null;
    fpaCmeHoursRequired?: number | null;
    cpaRequired?: boolean | null;
    complianceNotes?: string | null;
}

interface FPARequirementsCardProps {
    state: FPAState;
    className?: string;
}

type StatusColor = "green" | "yellow" | "red";

interface FPAStatusInfo {
    label: string;
    color: StatusColor;
    description: string;
}

const STATUS_COLOR_CLASSES: Record<StatusColor, string> = {
    green: "bg-green-100 text-green-800 border-green-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
};

const BORDER_COLOR_CLASSES: Record<StatusColor, string> = {
    green: "border-green-200",
    yellow: "border-yellow-200",
    red: "border-red-200",
};

function getFPAStatus(state: FPAState): FPAStatusInfo {
    if (!state.fpaAvailable) {
        return {
            label: "FPA Not Available",
            color: "red",
            description: "This state does not offer Full Practice Authority for NPs",
        };
    }

    if (state.fpaAutomaticWithLicense) {
        return {
            label: "Automatic with License",
            color: "green",
            description: "FPA is granted automatically upon licensure",
        };
    }

    if (state.fpaHoursRequired || state.fpaYearsRequired) {
        return {
            label: "Requires Supervised Practice",
            color: "yellow",
            description: "Supervised practice required before FPA eligibility",
        };
    }

    if (state.fpaRequiresApplication) {
        return {
            label: "Requires Application",
            color: "yellow",
            description: "Must apply for FPA after meeting requirements",
        };
    }

    return {
        label: "Available",
        color: "green",
        description: "Full Practice Authority is available in this state",
    };
}

function RequirementItem({ children }: { children: React.ReactNode }): ReactElement {
    return (
        <li className="flex items-start gap-2 text-sm">
            <span className="text-green-600 mt-0.5">&#10003;</span>
            <span className="text-gray-700">{children}</span>
        </li>
    );
}

function InfoBox({
    variant,
    children,
}: {
    variant: "blue" | "amber" | "gray" | "green";
    children: React.ReactNode;
}): ReactElement {
    const variantClasses = {
        blue: "bg-blue-50 border-blue-100 text-blue-800",
        amber: "bg-amber-50 border-amber-100 text-amber-800",
        gray: "bg-gray-50 border-gray-100 text-gray-700",
        green: "bg-green-50 border-green-100 text-green-800",
    };

    return (
        <div className={`mt-3 p-3 rounded-md border ${variantClasses[variant]}`}>
            <p className="text-sm">{children}</p>
        </div>
    );
}

export default function FPARequirementsCard({
    state,
    className = "",
}: FPARequirementsCardProps): ReactElement {
    const status = getFPAStatus(state);

    const hasRequirements =
        state.fpaHoursRequired ||
        state.fpaYearsRequired ||
        state.fpaWithinStateRequired ||
        state.fpaCmeHoursRequired ||
        state.fpaRequiresApplication;

    return (
        <div
            className={`bg-white rounded-lg border-2 ${BORDER_COLOR_CLASSES[status.color]} p-4 ${className}`}
        >
            {/* Header with state name and status badge */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                    <h3 className="text-base font-semibold text-gray-900">
                        {state.stateName} FPA Requirements
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {status.description}
                    </p>
                </div>
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLOR_CLASSES[status.color]} whitespace-nowrap`}
                >
                    {status.label}
                </span>
            </div>

            <div className="border-t border-gray-200 my-3" />

            {/* Requirements list */}
            {hasRequirements && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Requirements
                    </h4>
                    <ul className="space-y-1.5">
                        {state.fpaHoursRequired && (
                            <RequirementItem>
                                <span className="font-medium">
                                    {formatNumber(state.fpaHoursRequired)} hours
                                </span>{" "}
                                of supervised practice required
                            </RequirementItem>
                        )}

                        {state.fpaYearsRequired && (
                            <RequirementItem>
                                <span className="font-medium">
                                    {state.fpaYearsRequired} {pluralize(state.fpaYearsRequired, "year")}
                                </span>{" "}
                                of supervised practice required
                            </RequirementItem>
                        )}

                        {state.fpaWithinStateRequired && (
                            <RequirementItem>
                                Must be completed <span className="font-medium">in-state</span>
                            </RequirementItem>
                        )}

                        {state.fpaCmeHoursRequired && (
                            <RequirementItem>
                                <span className="font-medium">
                                    {formatNumber(state.fpaCmeHoursRequired)} CME hours
                                </span>{" "}
                                required
                            </RequirementItem>
                        )}

                        {state.fpaRequiresApplication && (
                            <RequirementItem>
                                <span className="font-medium">Application required</span>{" "}
                                after meeting requirements
                            </RequirementItem>
                        )}
                    </ul>
                </div>
            )}

            {/* CPA Required notice */}
            {state.cpaRequired && (
                <InfoBox variant="blue">
                    <span className="font-medium">Note:</span> This state requires a
                    Collaborative Practice Agreement (CPA) until FPA requirements are
                    met.
                </InfoBox>
            )}

            {/* No FPA - CPA required */}
            {!state.fpaAvailable && state.cpaRequired && (
                <InfoBox variant="amber">
                    <span className="font-medium">Important:</span> Without FPA, a
                    Collaborative Practice Agreement (CPA) with a supervising
                    physician is required to practice.
                </InfoBox>
            )}

            {/* Compliance notes */}
            {state.complianceNotes && (
                <InfoBox variant="gray">
                    <span className="font-medium">Note:</span> {state.complianceNotes}
                </InfoBox>
            )}

            {/* No requirements message for automatic states */}
            {!hasRequirements && state.fpaAvailable && state.fpaAutomaticWithLicense && (
                <InfoBox variant="green">
                    No additional requirements - FPA is granted with your NP license
                    in {state.stateName}.
                </InfoBox>
            )}
        </div>
    );
}

/**
 * Helper function to check if a state requires supervised hours/years tracking
 */
export function stateRequiresSupervisedTracking(state: FPAState | null | undefined): boolean {
    if (!state) return false;
    return Boolean(state.fpaHoursRequired || state.fpaYearsRequired);
}
