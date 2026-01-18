"use client";

import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MessageSquarePlus, Search, Users } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { getDc } from "@/lib/firebase";
import { LoadingState, EmptyState, InfoBanner, PageHeader, AlertBanner, Button } from "@/components";
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

function ProfileSetupRequired(): ReactElement {
  return (
    <div className="space-y-6">
      <PageHeader title="New Conversation" backHref="/dashboard/messages" />
      <AlertBanner
        title="Profile Setup Required"
        description="Please complete your profile setup to start conversations. Your role (NP or Physician) needs to be set first."
        variant="warning"
      />
    </div>
  );
}

interface ProviderRowProps {
  provider: Provider;
  existingId: string | null;
  isCreating: boolean;
  onStartConversation: () => void;
}

function ProviderRow({
  provider,
  existingId,
  isCreating,
  onStartConversation,
}: ProviderRowProps): ReactElement {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
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
          <p className="text-xs text-gray-500 mt-0.5">{provider.email}</p>
          <ProviderDetails provider={provider} />
        </div>
        <Button
          icon={MessageSquarePlus}
          onClick={onStartConversation}
          loading={isCreating}
          className="ml-4"
        >
          {existingId ? "View Chat" : "Start Chat"}
        </Button>
      </div>
    </div>
  );
}

function ProviderDetails({ provider }: { provider: Provider }): ReactElement {
  const details = [
    { text: provider.specialty, highlight: false },
    provider.states ? { text: provider.states, highlight: false } : null,
    provider.availability ? { text: provider.availability, highlight: true } : null,
    provider.supervisionModel ? { text: provider.supervisionModel, highlight: false } : null,
    provider.hourlyRate ? { text: `$${provider.hourlyRate}/hr`, highlight: false } : null,
  ].filter((item): item is { text: string; highlight: boolean } => item !== null);

  return (
    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
      {details.map((detail, index) => (
        <span key={index} className="flex items-center gap-3">
          {index > 0 && <span className="text-gray-300">|</span>}
          <span className={detail.highlight ? "text-green-600" : ""}>{detail.text}</span>
        </span>
      ))}
    </div>
  );
}


export default function NewConversationPage(): ReactElement {
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

  async function searchProviders(role: string | null): Promise<void> {
    setSearching(true);
    try {
      if (role === "np") {
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
  }

  useEffect(() => {
    async function fetchInitialData(): Promise<void> {
      if (!user) return;

      try {
        const { data: profileData } = await getMyProfile(getDc());
        const role = profileData.user?.role || null;
        setUserRole(role);

        const { data: conversationsData } = await getMyConversations(getDc());
        setExistingConversations(
          conversationsData.conversations.map((c) => ({
            id: c.id,
            npUser: { id: c.npUser.id },
            physicianUser: { id: c.physicianUser.id },
          }))
        );

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

  function findExistingConversation(providerId: string): string | null {
    const existing = existingConversations.find(
      (c) => c.npUser.id === providerId || c.physicianUser.id === providerId
    );
    return existing?.id || null;
  }

  async function handleStartConversation(provider: Provider): Promise<void> {
    const existingId = findExistingConversation(provider.id);
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
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="New Conversation" backHref="/dashboard/messages" />
        <LoadingState message="Loading..." />
      </div>
    );
  }

  if (!userRole) {
    return <ProfileSetupRequired />;
  }

  const providerType = userRole === "np" ? "Physicians" : "Nurse Practitioners";
  const targetRole = userRole === "np" ? "physician" : "nurse practitioner";

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Conversation"
        description={`Select a ${targetRole} to start a conversation`}
        backHref="/dashboard/messages"
      />

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

      <div className="rounded-md border bg-white shadow-sm">
        {searching ? (
          <div className="p-8 text-center text-gray-500">
            Searching {providerType.toLowerCase()}...
          </div>
        ) : filteredProviders.length === 0 ? (
          <EmptyState
            icon={Users}
            title={`No ${providerType.toLowerCase()} found`}
            description={
              searchQuery
                ? "Try adjusting your search terms"
                : `No ${providerType.toLowerCase()} are currently available in the directory`
            }
            action={{
              label: "Browse the full provider directory",
              onClick: () => router.push("/dashboard/directory"),
            }}
          />
        ) : (
          <div className="divide-y">
            {filteredProviders.map((provider) => (
              <ProviderRow
                key={provider.id}
                provider={provider}
                existingId={findExistingConversation(provider.id)}
                isCreating={creating === provider.id}
                onStartConversation={() => handleStartConversation(provider)}
              />
            ))}
          </div>
        )}
      </div>

      <InfoBanner icon={MessageSquarePlus} title="About Conversations">
        Start a conversation to discuss potential collaboration. Contact
        information (phone, email) will be protected until a Collaboration
        Practice Agreement (CPA) is signed by both parties. This ensures
        HIPAA compliance and protects both parties.
      </InfoBanner>
    </div>
  );
}
