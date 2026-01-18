"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquarePlus, Mail, MailOpen } from "lucide-react";
import { getMyConversations } from "@dataconnect/generated";
import { useProtectedData, getOtherParticipant, getUnreadCountForUser } from "@/hooks";
import { PageHeader, Button, EmptyState, LoadingState, StatusBadge } from "@/components";
import { formatRelativeTime } from "@/lib/format";
import type { Conversation } from "@/types";

export default function MessagesPage() {
  const router = useRouter();

  const { data, loading, userId } = useProtectedData({
    fetcher: async (dc) => {
      const { data } = await getMyConversations(dc);
      return data.conversations as Conversation[];
    },
    errorMessage: "Failed to load conversations",
  });

  const conversations = data ?? [];

  function handleNewConversation(): void {
    router.push("/dashboard/messages/new");
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Messages"
          actions={
            <Button icon={MessageSquarePlus} onClick={handleNewConversation}>
              New Conversation
            </Button>
          }
        />
        <LoadingState message="Loading conversations..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        actions={
          <Button icon={MessageSquarePlus} onClick={handleNewConversation}>
            New Conversation
          </Button>
        }
      />

      <div className="rounded-md border bg-white shadow-sm">
        {conversations.length === 0 ? (
          <EmptyState
            icon={Mail}
            title="No messages yet"
            description="Start a conversation with a collaborating physician or NP"
            action={{
              label: "New Conversation",
              onClick: handleNewConversation,
              icon: MessageSquarePlus,
            }}
          />
        ) : (
          <div className="divide-y">
            {conversations.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
                currentUserId={userId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ConversationRowProps {
  conversation: Conversation;
  currentUserId: string | null;
}

function ConversationRow({ conversation, currentUserId }: ConversationRowProps) {
  const otherParticipant = getOtherParticipant(conversation, currentUserId);
  const unreadCount = getUnreadCountForUser(conversation, currentUserId);

  return (
    <Link
      href={`/dashboard/messages/${conversation.id}`}
      className="block p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-medium ${unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
              {otherParticipant?.displayName || otherParticipant?.email || "Unknown User"}
            </p>
            {!conversation.contactInfoUnlocked && (
              <StatusBadge variant="warning" label="Contact Locked" showIcon={false} />
            )}
            {conversation.collaborationAgreement?.isActive && (
              <StatusBadge variant="success" label="Active CPA" showIcon={false} />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {otherParticipant?.email}
          </p>
        </div>
        <div className="flex items-center gap-3 ml-4">
          {conversation.lastMessageAt && (
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatRelativeTime(conversation.lastMessageAt)}
            </span>
          )}
          {unreadCount > 0 && (
            <div className="flex items-center gap-1">
              <MailOpen className="h-4 w-4 text-blue-600" />
              <span className="inline-flex items-center justify-center rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white min-w-[20px]">
                {unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
