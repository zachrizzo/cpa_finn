"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquarePlus, Mail, MailOpen } from "lucide-react";
import { auth, getDc } from "@/lib/firebase";
import { getMyConversations } from "@dataconnect/generated";
import { toast } from "sonner";

interface Conversation {
  id: string;
  conversationId: string;
  status: string;
  contactInfoUnlocked: boolean;
  lastMessageAt: string;
  unreadCountNp: number;
  unreadCountPhysician: number;
  createdAt: string;
  npUser: {
    id: string;
    displayName: string | null;
    email: string;
  };
  physicianUser: {
    id: string;
    displayName: string | null;
    email: string;
  };
  collaborationAgreement: {
    id: string;
    status: string;
    isActive: boolean;
  } | null;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const { data } = await getMyConversations(getDc());
        setConversations(data.conversations as Conversation[]);
      } catch {
        toast.error("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    }
    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId]);

  const getOtherParticipant = (conversation: Conversation) => {
    if (!currentUserId) return null;
    if (conversation.npUser.id === currentUserId) {
      return conversation.physicianUser;
    }
    return conversation.npUser;
  };

  const getUnreadCount = (conversation: Conversation) => {
    if (!currentUserId) return 0;
    if (conversation.npUser.id === currentUserId) {
      return conversation.unreadCountNp;
    }
    return conversation.unreadCountPhysician;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Messages</h1>
        <button
          onClick={() => router.push("/dashboard/messages/new")}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Conversation
        </button>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start a conversation with a collaborating physician or NP
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/dashboard/messages/new")}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                <MessageSquarePlus className="h-4 w-4" />
                New Conversation
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const unreadCount = getUnreadCount(conversation);

              return (
                <Link
                  key={conversation.id}
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
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                            Contact Locked
                          </span>
                        )}
                        {conversation.collaborationAgreement?.isActive && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                            Active CPA
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {otherParticipant?.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      {conversation.lastMessageAt && (
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTimestamp(conversation.lastMessageAt)}
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
            })}
          </div>
        )}
      </div>
    </div>
  );
}
