"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, User } from "lucide-react";
import { getDc } from "@/lib/firebase";
import { listStates, searchPhysicians, searchNPs } from "@dataconnect/generated";
import { toast } from "sonner";

type Provider = {
    id: string;
    displayName: string;
    email: string;
    role: string;
    states: string;
    specialty: string;
    availability: string;
    supervisionModel?: string;
    hourlyRate?: number;
    revenueSharePercentage?: number;
    totalNpCapacity?: number;
    currentNpCount?: number;
    availableSpots?: number;
    hoursPerWeekAvailable?: number;
    preferredCompensationModel?: string;
};

interface State {
    id?: string;
    stateCode: string;
    stateName: string;
}

interface ProviderDirectoryItem {
    physician: {
        id: string;
        displayName: string | null;
        email: string;
    };
    availableStates: string | null;
    primarySpecialty: string | null;
    supervisionModel: string | null;
    hourlyRate: number | null;
    revenueSharePercentage: number | null;
    totalNpCapacity: number | null;
    currentNpCount: number | null;
    availableSpots: number | null;
}

interface NpDirectoryItem {
    np: {
        id: string;
        displayName: string | null;
        email: string;
    };
    seekingStates: string | null;
    primarySpecialty: string | null;
    hoursPerWeekAvailable: number | null;
    preferredCompensationModel: string | null;
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
                setStates(data.states);
            } catch {
                toast.error("Failed to load states");
            }
        }
        fetchStates();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            if (searchType === "physician") {
                const { data } = await searchPhysicians(getDc(), {
                    stateCode: filters.stateCode || undefined,
                    specialtyType: filters.specialtyType || undefined,
                    availableForNewNPs: filters.availableOnly || undefined,
                });

                const formattedProviders = (data.providerDirectories || []).map((pd: ProviderDirectoryItem) => ({
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
                setProviders(formattedProviders);
            } else {
                const { data } = await searchNPs(getDc(), {
                    stateCode: filters.stateCode || undefined,
                    specialtyType: filters.specialtyType || undefined,
                    needsCPA: true,
                });

                const formattedProviders = (data.npDirectories || []).map((nd: NpDirectoryItem) => ({
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
    }, [searchType]);

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
                        {providers.map((provider) => (
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
                                        <div>
                                            <span className="font-medium text-gray-700">Availability: </span>
                                            <span className={`font-medium ${
                                                provider.availableSpots && provider.availableSpots > 0
                                                    ? "text-green-600"
                                                    : "text-gray-600"
                                            }`}>
                                                {provider.availability}
                                            </span>
                                        </div>
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
                                        onClick={() => alert(`Request match with ${provider.displayName}`)}
                                    >
                                        Request Match
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
