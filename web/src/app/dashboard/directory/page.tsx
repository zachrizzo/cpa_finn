"use client";

import { useEffect, useState } from "react";
import { Search, User } from "lucide-react";
import { getDc } from "@/lib/firebase";
import { listStates, searchPhysicians, searchNPs, createDirectoryMatch, createDirectoryMatchByPhysician, getPhysicianStateCapacities } from "@dataconnect/generated";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageHeader, LinkButton, Button, LoadingState, ToggleButton, ProviderCard, MatchRequestModal, type Provider } from "@/components";
import type { StateCapacityInfo } from "@/types";
import { MEDICAL_SPECIALTIES } from "@/lib/utils";
import { useProtectedData } from "@/hooks";

interface State {
    id?: string;
    stateCode: string;
    stateName: string;
}

export default function DirectorySearchPage() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
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
    const router = useRouter();

    // Fetch states list using useProtectedData
    const { data: states, loading: statesLoading } = useProtectedData<State[]>({
        fetcher: async (dc) => {
            const { data } = await listStates(dc);
            // Deduplicate states by stateCode (in case seed data has duplicates)
            const uniqueStates = Array.from(
                new Map(data.states.map(s => [s.stateCode, s])).values()
            );
            return uniqueStates;
        },
        errorMessage: "Failed to load states",
    });

    async function fetchStateCapacity(physicianId: string, stateCode: string): Promise<StateCapacityInfo | null> {
        try {
            const { data } = await getPhysicianStateCapacities(getDc(), { physicianId });
            const cap = (data.providerStateCapacities || []).find(c => c.state.stateCode === stateCode);
            if (!cap) return null;

            return {
                stateCode: cap.state.stateCode,
                stateName: cap.state.stateName,
                maxNpCapacity: cap.maxNpCapacity,
                currentNpCount: cap.currentNpCount,
                isAccepting: cap.isAccepting,
                notes: cap.notes,
            };
        } catch {
            return null;
        }
    }

    async function handleSearch(): Promise<void> {
        setSearchLoading(true);
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
            setSearchLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchType]);

    function openMatchModal(provider: Provider): void {
        setSelectedProvider(provider);
        const stateId = filters.stateCode
            ? (states || []).find(s => s.stateCode === filters.stateCode)?.id ?? ""
            : "";
        setSelectedStateId(stateId);
        setShowMatchModal(true);
    }

    async function handleRequestMatch(): Promise<void> {
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

    return (
        <div className="space-y-6">
            <PageHeader
                title="Provider Directory"
                description="Search for physicians or NPs to collaborate with"
                actions={
                    <LinkButton href="/dashboard/directory/profile" icon={User}>
                        Manage My Profile
                    </LinkButton>
                }
            />

            {/* Search Filters */}
            <div className="bg-white p-6 shadow rounded-lg border">
                <div className="space-y-4">
                    {/* Search Type Toggle */}
                    <ToggleButton
                        options={[
                            { value: "physician", label: "Find Physicians" },
                            { value: "np", label: "Find NPs" },
                        ]}
                        value={searchType}
                        onChange={setSearchType}
                    />

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
                                disabled={statesLoading}
                            >
                                <option value="">All States</option>
                                {(states || []).map((state) => (
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
                                {MEDICAL_SPECIALTIES.map((specialty) => (
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
                        <Button icon={Search} onClick={handleSearch} loading={searchLoading}>
                            {searchLoading ? "Searching..." : "Search"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div>
                {searchLoading ? (
                    <LoadingState message="Loading providers..." />
                ) : providers.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border">
                        <p className="text-gray-500">No providers found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {providers.map((provider) => (
                            <ProviderCard
                                key={provider.id}
                                provider={provider}
                                onRequestMatch={openMatchModal}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showMatchModal && selectedProvider && (
                <MatchRequestModal
                    provider={selectedProvider}
                    states={states || []}
                    selectedStateId={selectedStateId}
                    onStateChange={setSelectedStateId}
                    onClose={() => setShowMatchModal(false)}
                    onSubmit={handleRequestMatch}
                    isSubmitting={requestingMatch}
                />
            )}
        </div>
    );
}
