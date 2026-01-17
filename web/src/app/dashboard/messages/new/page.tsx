"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { getDc } from "@/lib/firebase";
import { toast } from "sonner";
import { ArrowLeft, MessageSquarePlus, Search, Users, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  getMyProfile,
  getMyConversations,
  searchPhysicians,
  searchNPs,
  createConversation,
} from "@dataconnect/generated";

interface Provider {
  id: string;
  displayName?: string | null;
  email: string;
  specialty: string;
  states: string;
  availability?: string;
  supervisionModel?: string | null;
  hourlyRate?: number | null;
  availableSpots?: number | null;
  hoursPerWeekAvailable?: number | null;
}

interface ExistingConversation {
  id: string;
  npUser: { id: string };
  physicianUser: { id: string };
}

export default function NewConversationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [existingConversations, setExistingConversations] = useState<ExistingConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState<string | null>(null);

  // Fetch user profile and existing conversations on mount
  useEffect(() => {
    async function fetchInitialData() {
      if (!user) return;

      try {
        // Fetch user profile to get role
        const { data: profileData } = await getMyProfile(getDc());
        const role = profileData.user?.role || null;
        setUserRole(role);

        // Fetch existing conversations
        const { data: conversationsData } = await getMyConversations(getDc());
        setExistingConversations(
          conversationsData.conversations.map((c) => ({
            id: c.id,
            npUser: { id: c.npUser.id },
            physicianUser: { id: c.physicianUser.id },
          }))
        );

        // Search for providers based on role
        await searchProviders(role);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, [user]);

  // Search for providers based on user role
  const searchProviders = async (role: string | null) => {
    setSearching(true);
    try {
      if (role === "np") {
        // NPs search for physicians
        const { data } = await searchPhysicians(getDc(), {});
        const formattedProviders = (data.providerDirectories || []).map((pd) => ({
          id: pd.physician.id,
          displayName: pd.physician.displayName,
          email: pd.physician.email,
          specialty: pd.primarySpecialty || "Not specified",
          states: pd.availableStates || "",
          availability:
            pd.availableSpots && pd.availableSpots > 0
              ? `${pd.availableSpots} spots available`
              : "Not available",
          supervisionModel: pd.supervisionModel,
          hourlyRate: pd.hourlyRate,
          availableSpots: pd.availableSpots,
        }));
        setProviders(formattedProviders);
        setFilteredProviders(formattedProviders);
      } else if (role === "physician") {
        // Physicians search for NPs
        const { data } = await searchNPs(getDc(), {});
        const formattedProviders = (data.npDirectories || []).map((nd) => ({
          id: nd.np.id,
          displayName: nd.np.displayName,
          email: nd.np.email,
          specialty: nd.primarySpecialty || "Not specified",
          states: nd.seekingStates || "",
          hoursPerWeekAvailable: nd.hoursPerWeekAvailable,
          availability: nd.hoursPerWeekAvailable
            ? `${nd.hoursPerWeekAvailable} hrs/week available`
            : "Available",
        }));
        setProviders(formattedProviders);
        setFilteredProviders(formattedProviders);
      }
    } catch (error) {
      console.error("Error searching providers:", error);
      toast.error("Failed to search providers");
    } finally {
      setSearching(false);
    }
  };

  // Filter providers based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProviders(providers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = providers.filter(
      (provider) =>
        provider.displayName?.toLowerCase().includes(query) ||
        provider.email.toLowerCase().includes(query) ||
        provider.specialty.toLowerCase().includes(query) ||
        provider.states.toLowerCase().includes(query)
    );
    setFilteredProviders(filtered);
  }, [searchQuery, providers]);

  // Check if conversation already exists with a provider
  const hasExistingConversation = (providerId: string): string | null => {
    const existing = existingConversations.find(
      (c) => c.npUser.id === providerId || c.physicianUser.id === providerId
    );
    return existing?.id || null;
  };

  // Start a new conversation
  const handleStartConversation = async (provider: Provider) => {
    // Check if conversation already exists
    const existingId = hasExistingConversation(provider.id);
    if (existingId) {
      router.push(`/dashboard/messages/${existingId}`);
      return;
    }

    setCreating(provider.id);
    try {
      const { data } = await createConversation(getDc(), {
        participantUserId: provider.id,
      });

      toast.success(`Conversation started with ${provider.displayName || provider.email}`);
      router.push(`/dashboard/messages/${data.conversation_insert.id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to start conversation. Please try again.");
    } finally {
      setCreating(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/messages"
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            New Conversation
          </h1>
        </div>
        <div className="rounded-md border bg-white shadow-sm p-8 text-center text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/messages"
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            New Conversation
          </h1>
        </div>
        <div className="rounded-md border bg-white shadow-sm p-8">
          <div className="flex items-center gap-3 text-yellow-600">
            <AlertCircle className="h-6 w-6" />
            <div>
              <p className="font-medium">Profile Setup Required</p>
              <p className="text-sm text-gray-500 mt-1">
                Please complete your profile setup to start conversations. Your
                role (NP or Physician) needs to be set first.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const providerType = userRole === "np" ? "Physicians" : "Nurse Practitioners";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/messages"
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              New Conversation
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Select a {userRole === "np" ? "physician" : "nurse practitioner"} to
              start a conversation
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-md border bg-white shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${providerType.toLowerCase()} by name, email, specialty, or state...`}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Providers List */}
      <div className="rounded-md border bg-white shadow-sm">
        {searching ? (
          <div className="p-8 text-center text-gray-500">
            Searching {providerType.toLowerCase()}...
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No {providerType.toLowerCase()} found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? "Try adjusting your search terms"
                : `No ${providerType.toLowerCase()} are currently available in the directory`}
            </p>
            <div className="mt-4">
              <Link
                href="/dashboard/directory"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Browse the full provider directory
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {filteredProviders.map((provider) => {
              const existingId = hasExistingConversation(provider.id);
              const isCreating = creating === provider.id;

              return (
                <div
                  key={provider.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {provider.displayName || "Unknown"}
                        </p>
                        {existingId && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            Existing Chat
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {provider.email}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{provider.specialty}</span>
                        {provider.states && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span>{provider.states}</span>
                          </>
                        )}
                        {provider.availability && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span className="text-green-600">
                              {provider.availability}
                            </span>
                          </>
                        )}
                        {provider.supervisionModel && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span>{provider.supervisionModel}</span>
                          </>
                        )}
                        {provider.hourlyRate && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span>${provider.hourlyRate}/hr</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartConversation(provider)}
                      disabled={isCreating}
                      className="ml-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MessageSquarePlus className="h-4 w-4" />
                      {isCreating
                        ? "Starting..."
                        : existingId
                        ? "View Chat"
                        : "Start Chat"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <MessageSquarePlus className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              About Conversations
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Start a conversation to discuss potential collaboration. Contact
              information (phone, email) will be protected until a Collaboration
              Practice Agreement (CPA) is signed by both parties. This ensures
              HIPAA compliance and protects both parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
