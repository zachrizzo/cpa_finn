"use client";

interface State {
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
    state: State;
    className?: string;
}

/**
 * Determines the FPA status category based on state data
 */
function getFPAStatus(state: State): {
    label: string;
    color: "green" | "yellow" | "red";
    description: string;
} {
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

/**
 * Format a number with commas for display
 */
function formatNumber(num: number): string {
    return num.toLocaleString();
}

/**
 * FPA Requirements Card Component
 * Displays state-specific FPA requirements and compliance information
 */
export default function FPARequirementsCard({
    state,
    className = "",
}: FPARequirementsCardProps) {
    const status = getFPAStatus(state);

    const statusColorClasses = {
        green: "bg-green-100 text-green-800 border-green-200",
        yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
        red: "bg-red-100 text-red-800 border-red-200",
    };

    const borderColorClasses = {
        green: "border-green-200",
        yellow: "border-yellow-200",
        red: "border-red-200",
    };

    const hasRequirements =
        state.fpaHoursRequired ||
        state.fpaYearsRequired ||
        state.fpaWithinStateRequired ||
        state.fpaCmeHoursRequired ||
        state.fpaRequiresApplication;

    return (
        <div
            className={`bg-white rounded-lg border-2 ${borderColorClasses[status.color]} p-4 ${className}`}
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
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColorClasses[status.color]} whitespace-nowrap`}
                >
                    {status.label}
                </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-3" />

            {/* Requirements list */}
            {hasRequirements && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Requirements
                    </h4>
                    <ul className="space-y-1.5">
                        {state.fpaHoursRequired && (
                            <li className="flex items-start gap-2 text-sm">
                                <span className="text-green-600 mt-0.5">&#10003;</span>
                                <span className="text-gray-700">
                                    <span className="font-medium">
                                        {formatNumber(state.fpaHoursRequired)} hours
                                    </span>{" "}
                                    of supervised practice required
                                </span>
                            </li>
                        )}

                        {state.fpaYearsRequired && (
                            <li className="flex items-start gap-2 text-sm">
                                <span className="text-green-600 mt-0.5">&#10003;</span>
                                <span className="text-gray-700">
                                    <span className="font-medium">
                                        {state.fpaYearsRequired}{" "}
                                        {state.fpaYearsRequired === 1 ? "year" : "years"}
                                    </span>{" "}
                                    of supervised practice required
                                </span>
                            </li>
                        )}

                        {state.fpaWithinStateRequired && (
                            <li className="flex items-start gap-2 text-sm">
                                <span className="text-green-600 mt-0.5">&#10003;</span>
                                <span className="text-gray-700">
                                    Must be completed{" "}
                                    <span className="font-medium">in-state</span>
                                </span>
                            </li>
                        )}

                        {state.fpaCmeHoursRequired && (
                            <li className="flex items-start gap-2 text-sm">
                                <span className="text-green-600 mt-0.5">&#10003;</span>
                                <span className="text-gray-700">
                                    <span className="font-medium">
                                        {formatNumber(state.fpaCmeHoursRequired)} CME hours
                                    </span>{" "}
                                    required
                                </span>
                            </li>
                        )}

                        {state.fpaRequiresApplication && (
                            <li className="flex items-start gap-2 text-sm">
                                <span className="text-green-600 mt-0.5">&#10003;</span>
                                <span className="text-gray-700">
                                    <span className="font-medium">Application required</span>{" "}
                                    after meeting requirements
                                </span>
                            </li>
                        )}
                    </ul>
                </div>
            )}

            {/* CPA Required notice */}
            {state.cpaRequired && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                    <p className="text-sm text-blue-800">
                        <span className="font-medium">Note:</span> This state requires a
                        Collaborative Practice Agreement (CPA) until FPA requirements are
                        met.
                    </p>
                </div>
            )}

            {/* No FPA - CPA required */}
            {!state.fpaAvailable && state.cpaRequired && (
                <div className="mt-3 p-3 bg-amber-50 rounded-md border border-amber-100">
                    <p className="text-sm text-amber-800">
                        <span className="font-medium">Important:</span> Without FPA, a
                        Collaborative Practice Agreement (CPA) with a supervising
                        physician is required to practice.
                    </p>
                </div>
            )}

            {/* Compliance notes */}
            {state.complianceNotes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-100">
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Note:</span>{" "}
                        {state.complianceNotes}
                    </p>
                </div>
            )}

            {/* No requirements message for automatic states */}
            {!hasRequirements && state.fpaAvailable && state.fpaAutomaticWithLicense && (
                <div className="p-3 bg-green-50 rounded-md border border-green-100">
                    <p className="text-sm text-green-800">
                        No additional requirements - FPA is granted with your NP license
                        in {state.stateName}.
                    </p>
                </div>
            )}
        </div>
    );
}

/**
 * Helper function to check if a state requires supervised hours/years tracking
 */
export function stateRequiresSupervisedTracking(state: State | null | undefined): boolean {
    if (!state) return false;
    return Boolean(state.fpaHoursRequired || state.fpaYearsRequired);
}
