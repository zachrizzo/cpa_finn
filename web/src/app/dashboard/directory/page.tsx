"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, User, MapPin } from "lucide-react";
import { getDc } from "@/lib/firebase";
import { listStates, searchPhysicians, searchNPs, createDirectoryMatch, createDirectoryMatchByPhysician, getPhysicianStateCapacities } from "@dataconnect/generated";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

type StateCapacityInfo = {
    stateCode: string;
    stateName: string;
    maxNpCapacity: number;
    currentNpCount: number;
    isAccepting: boolean;
    notes?: string | null;
};

type Provider = {
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
    // Per-state capacity info (loaded on demand)
    stateCapacity?: StateCapacityInfo | null;
};

interface State {
    id?: string;
    stateCode: string;
    stateName: string;
}

export default function DirectorySearchPage() {
    const [states, setStates] = useState<State[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchType, setSearchType] = useState<"physician" | "np">("physician");
    const [filters, setFilters] = useState({
        stateCode: "",
        specialtyType: "",
        availableOnly: true,
    });
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [selectedStateId, setSelectedStateId] = useState<string>("");
    const [requestingMatch, setRequestingMatch] = useState(false);
    useAuth(); // Ensure user is authenticated
    const router = useRouter();

    const specialties = [
        "Family Medicine",
        "Internal Medicine",
        "Psychiatry",
        "Pediatrics",
        "Emergency Medicine",
        "Urgent Care",
        "Cardiology",
        "Dermatology",
        "Oncology",
        "Other",
    ];

    useEffect(() => {
        async function fetchStates() {
            try {
                const { data } = await listStates(getDc());
                // Deduplicate states by stateCode (in case seed data has duplicates)
                const uniqueStates = Array.from(
                    new Map(data.states.map(s => [s.stateCode, s])).values()
                );
                setStates(uniqueStates);
            } catch {
                toast.error("Failed to load states");
            }
        }
        fetchStates();
    }, []);

    // Fetch per-state capacity for a physician
    const fetchStateCapacity = async (physicianId: string, stateCode: string): Promise<StateCapacityInfo | null> => {
        try {
            const { data } = await getPhysicianStateCapacities(getDc(), { physicianId });
            const capacities = data.providerStateCapacities || [];
            const stateCapacity = capacities.find(cap => cap.state.stateCode === stateCode);
            if (stateCapacity) {
                return {
                    stateCode: stateCapacity.state.stateCode,
                    stateName: stateCapacity.state.stateName,
                    maxNpCapacity: stateCapacity.maxNpCapacity,
                    currentNpCount: stateCapacity.currentNpCount,
                    isAccepting: stateCapacity.isAccepting,
                    notes: stateCapacity.notes,
                };
            }
            return null;
        } catch {
            return null;
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            if (searchType === "physician") {
                const { data } = await searchPhysicians(getDc(), {
                    stateCode: filters.stateCode || undefined,
                    specialtyType: filters.specialtyType || undefined,
                    availableForNewNPs: filters.availableOnly || undefined,
                });

                const formattedProviders: Provider[] = (data.providerDirectories || []).map((pd) => ({
                    id: pd.physician.id,
                    displayName: pd.physician.displayName || "Unknown",
                    email: pd.physician.email,
                    role: "Physician",
                    states: pd.availableStates || "",
                    specialty: pd.primarySpecialty || "Not specified",
                    availability: pd.availableSpots && pd.availableSpots > 0
                        ? `Accepting NPs: ${pd.currentNpCount}/${pd.totalNpCapacity}`
                        : "Not accepting",
                    supervisionModel: pd.supervisionModel,
                    hourlyRate: pd.hourlyRate,
                    revenueSharePercentage: pd.revenueSharePercentage,
                    totalNpCapacity: pd.totalNpCapacity,
                    currentNpCount: pd.currentNpCount,
                    availableSpots: pd.availableSpots,
                }));

                // If a specific state is selected, fetch per-state capacity for each physician
                if (filters.stateCode) {
                    const providersWithCapacity = await Promise.all(
                        formattedProviders.map(async (provider) => {
                            const stateCapacity = await fetchStateCapacity(provider.id, filters.stateCode);
                            return { ...provider, stateCapacity };
                        })
                    );
                    setProviders(providersWithCapacity);
                } else {
                    setProviders(formattedProviders);
                }
            } else {
                const { data } = await searchNPs(getDc(), {
                    stateCode: filters.stateCode || undefined,
                    specialtyType: filters.specialtyType || undefined,
                    needsCPA: true,
                });

                const formattedProviders = (data.npDirectories || []).map((nd) => ({
                    id: nd.np.id,
                    displayName: nd.np.displayName || "Unknown",
                    email: nd.np.email,
                    role: "NP",
                    states: nd.seekingStates || "",
                    specialty: nd.primarySpecialty || "Not specified",
                    availability: nd.hoursPerWeekAvailable
                        ? `${nd.hoursPerWeekAvailable} hrs/week`
                        : "Not specified",
                    hoursPerWeekAvailable: nd.hoursPerWeekAvailable,
                    preferredCompensationModel: nd.preferredCompensationModel,
                }));
                setProviders(formattedProviders);
            }
        } catch {
            toast.error("Failed to search providers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchType]);

    const openMatchModal = (provider: Provider) => {
        setSelectedProvider(provider);
        // Pre-select the filtered state if one is selected
        if (filters.stateCode) {
            const state = states.find(s => s.stateCode === filters.stateCode);
            if (state?.id) {
                setSelectedStateId(state.id);
            } else {
                setSelectedStateId("");
            }
        } else {
            setSelectedStateId("");
        }
        setShowMatchModal(true);
    };

    const handleRequestMatch = async () => {
        if (!selectedProvider || !selectedStateId) {
            toast.error("Please select a state for the collaboration");
            return;
        }

        setRequestingMatch(true);
        try {
            // NP searching for physician uses createDirectoryMatch
            // Physician searching for NP uses createDirectoryMatchByPhysician
            if (searchType === "physician") {
                await createDirectoryMatch(getDc(), {
                    targetPhysicianId: selectedProvider.id,
                    stateId: selectedStateId as `${string}-${string}-${string}-${string}-${string}`,
                });
            } else {
                await createDirectoryMatchByPhysician(getDc(), {
                    targetNpId: selectedProvider.id,
                    stateId: selectedStateId as `${string}-${string}-${string}-${string}-${string}`,
                });
            }

            toast.success(`Match request sent to ${selectedProvider.displayName}!`);
            setShowMatchModal(false);
            setSelectedProvider(null);

            // Navigate to messages page
            router.push("/dashboard/messages");
        } catch (error) {
            console.error("Error requesting match:", error);
            toast.error("Failed to send match request. Please try again.");
        } finally {
            setRequestingMatch(false);
        }
    };

    // Helper to format state-specific availability
    const formatStateAvailability = (provider: Provider): { text: string; isAvailable: boolean } => {
        if (provider.stateCapacity) {
            const cap = provider.stateCapacity;
            const availableSpots = cap.maxNpCapacity - cap.currentNpCount;
            if (!cap.isAccepting) {
                return { text: `Not accepting in ${cap.stateCode}`, isAvailable: false };
            }
            if (availableSpots <= 0) {
                return { text: `Full in ${cap.stateCode} (${cap.currentNpCount}/${cap.maxNpCapacity})`, isAvailable: false };
            }
            return {
                text: `${cap.stateCode}: ${cap.currentNpCount}/${cap.maxNpCapacity} NPs (${availableSpots} spots)`,
                isAvailable: true
            };
        }
        // Fall back to global availability
        const availableSpots = provider.availableSpots ?? 0;
        if (availableSpots > 0) {
            return {
                text: `${provider.currentNpCount}/${provider.totalNpCapacity} NPs (${availableSpots} spots)`,
                isAvailable: true
            };
        }
        return { text: "Not accepting", isAvailable: false };
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Provider Directory</h1>
                    <p className="text-gray-500 mt-1">Search for physicians or NPs to collaborate with</p>
                </div>
                <Link
                    href="/dashboard/directory/profile"
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <User className="h-4 w-4" />
                    Manage My Profile
                </Link>
            </div>

            {/* Search Filters */}
            <div className="bg-white p-6 shadow rounded-lg border">
                <div className="space-y-4">
                    {/* Search Type Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSearchType("physician")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                searchType === "physician"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Find Physicians
                        </button>
                        <button
                            onClick={() => setSearchType("np")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                searchType === "np"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Find NPs
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                State
                            </label>
                            <select
                                value={filters.stateCode}
                                onChange={(e) => setFilters({ ...filters, stateCode: e.target.value })}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">All States</option>
                                {states.map((state) => (
                                    <option key={state.id} value={state.stateCode}>
                                        {state.stateName} ({state.stateCode})
                                    </option>
                                ))}
                            </select>
                            {filters.stateCode && searchType === "physician" && (
                                <p className="mt-1 text-xs text-blue-600">
                                    Showing state-specific availability for {filters.stateCode}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Specialty
                            </label>
                            <select
                                value={filters.specialtyType}
                                onChange={(e) => setFilters({ ...filters, specialtyType: e.target.value })}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">All Specialties</option>
                                {specialties.map((specialty) => (
                                    <option key={specialty} value={specialty}>
                                        {specialty}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.availableOnly}
                                    onChange={(e) => setFilters({ ...filters, availableOnly: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Show only available
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            <Search className="h-4 w-4" />
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div>
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading providers...</p>
                    </div>
                ) : providers.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border">
                        <p className="text-gray-500">No providers found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {providers.map((provider) => {
                            const stateAvailability = provider.role === "Physician"
                                ? formatStateAvailability(provider)
                                : null;

                            return (
                                <div
                                    key={provider.id}
                                    className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900">
                                                {provider.displayName}
                                            </h3>
                                            <p className="text-sm text-gray-500">{provider.role}</p>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-700">States: </span>
                                                <span className="text-gray-600">{provider.states}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Specialty: </span>
                                                <span className="text-gray-600">{provider.specialty}</span>
                                            </div>

                                            {/* State-specific availability for physicians */}
                                            {provider.role === "Physician" && stateAvailability && (
                                                <div className="flex items-start gap-1">
                                                    {provider.stateCapacity && (
                                                        <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                    )}
                                                    <div>
                                                        <span className="font-medium text-gray-700">Availability: </span>
                                                        <span className={`font-medium ${
                                                            stateAvailability.isAvailable
                                                                ? "text-green-600"
                                                                : "text-gray-600"
                                                        }`}>
                                                            {stateAvailability.text}
                                                        </span>
                                                        {provider.stateCapacity?.notes && (
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {provider.stateCapacity.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* NP availability */}
                                            {provider.role === "NP" && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Availability: </span>
                                                    <span className="text-gray-600">{provider.availability}</span>
                                                </div>
                                            )}

                                            {provider.supervisionModel && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Model: </span>
                                                    <span className="text-gray-600">{provider.supervisionModel}</span>
                                                </div>
                                            )}
                                            {provider.hourlyRate && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Rate: </span>
                                                    <span className="text-gray-600">${provider.hourlyRate}/hr</span>
                                                </div>
                                            )}
                                            {provider.revenueSharePercentage && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Revenue Share: </span>
                                                    <span className="text-gray-600">{provider.revenueSharePercentage}%</span>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            className="w-full mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            onClick={() => openMatchModal(provider)}
                                        >
                                            Request Match
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Match Request Modal */}
            {showMatchModal && selectedProvider && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center px-4 py-6">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowMatchModal(false)} />
                        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Request Match with {selectedProvider.displayName}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Select a state for this collaboration agreement. You can only request a match for states where you are both licensed.
                            </p>

                            {/* Show state-specific capacity info if available */}
                            {selectedProvider.stateCapacity && (
                                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium text-blue-900">
                                            {selectedProvider.stateCapacity.stateCode} Capacity:
                                        </span>
                                        <span className={selectedProvider.stateCapacity.isAccepting ? "text-green-700" : "text-red-700"}>
                                            {selectedProvider.stateCapacity.currentNpCount}/{selectedProvider.stateCapacity.maxNpCapacity} NPs
                                            {!selectedProvider.stateCapacity.isAccepting && " (Not accepting)"}
                                        </span>
                                    </div>
                                    {selectedProvider.stateCapacity.notes && (
                                        <p className="text-xs text-blue-700 mt-1">
                                            Note: {selectedProvider.stateCapacity.notes}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State for Collaboration
                                </label>
                                <select
                                    value={selectedStateId}
                                    onChange={(e) => setSelectedStateId(e.target.value)}
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

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowMatchModal(false)}
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRequestMatch}
                                    disabled={!selectedStateId || requestingMatch}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {requestingMatch ? "Sending..." : "Send Match Request"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
