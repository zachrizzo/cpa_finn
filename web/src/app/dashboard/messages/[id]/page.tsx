"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, Lock, AlertTriangle, Shield } from "lucide-react";
import { getDc } from "@/lib/firebase";
import {
  getConversationById,
  getConversationMessages,
  sendMessage,
  markMessageAsRead,
} from "@dataconnect/generated";
import { toast } from "sonner";
import { preFilterMessage } from "@/lib/message-filter";
import { useAuth } from "@/providers/AuthProvider";
import { getOtherParticipant } from "@/hooks/useOtherParticipant";
import { formatMessageTimestamp } from "@/lib/format";
import { LoadingState, StatusBadge } from "@/components";
import type { Message, Conversation } from "@/types";

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const conversationId = params.id as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [filterWarning, setFilterWarning] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = user?.uid ?? null;

  // Check message for contact info as user types
  useEffect(() => {
    if (!conversation) return;

    const isUnlocked =
      conversation.contactInfoUnlocked ||
      conversation.collaborationAgreement?.isActive;

    if (!isUnlocked && messageInput.trim()) {
      const result = preFilterMessage(messageInput, !!isUnlocked);
      setFilterWarning(result.shouldBlock ? result.message : null);
    } else {
      setFilterWarning(null);
    }
  }, [messageInput, conversation]);

  useEffect(() => {
    async function fetchConversation() {
      try {
        const { data } = await getConversationById(getDc(), { conversationId });
        setConversation(data.conversation as Conversation);
      } catch {
        toast.error("Failed to load conversation");
      }
    }

    async function fetchMessages() {
      try {
        const { data } = await getConversationMessages(getDc(), { conversationId });
        setMessages(data.messages as Message[]);

        // Mark unread messages as read
        const unreadMessages = data.messages.filter(
          (msg: Message) => !msg.readAt && msg.sender.id !== currentUserId
        );

        if (unreadMessages.length > 0) {
          const markPromises = unreadMessages.map((msg: Message) =>
            markMessageAsRead(getDc(), { messageId: msg.id })
          );
          Promise.allSettled(markPromises).catch((err) =>
            console.error("Failed to mark some messages as read:", err)
          );
        }
      } catch {
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    }

    if (currentUserId) {
      fetchConversation();
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [conversationId, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendMessage(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!messageInput.trim() || sending) return;

    const isUnlocked =
      conversation?.contactInfoUnlocked ||
      conversation?.collaborationAgreement?.isActive;

    const preFilterResult = preFilterMessage(messageInput, !!isUnlocked);
    if (preFilterResult.shouldBlock) {
      toast.error(preFilterResult.message, {
        description: "Sign your CPA with the other party to unlock contact sharing.",
        duration: 5000,
      });
      return;
    }

    setSending(true);
    try {
      await sendMessage(getDc(), {
        conversationId,
        messageBody: messageInput.trim(),
      });
      setMessageInput("");
      setFilterWarning(null);

      const { data } = await getConversationMessages(getDc(), { conversationId });
      setMessages(data.messages as Message[]);
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const otherParticipant = conversation ? getOtherParticipant(conversation, currentUserId) : null;
  const isContactInfoUnlocked = conversation?.contactInfoUnlocked ?? false;
  const hasCPA = conversation?.collaborationAgreement?.isActive ?? false;

  if (loading) {
    return <LoadingState message="Loading conversation..." />;
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Conversation not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/messages")}
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {otherParticipant?.displayName || otherParticipant?.email || "Unknown User"}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm text-gray-500">{otherParticipant?.email}</p>
              {hasCPA && (
                <StatusBadge variant="success" label="Active CPA" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {!isContactInfoUnlocked && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Contact Information Protected
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Contact information (phone numbers and email addresses) will be
                available once your CPA is signed by both parties. Any contact
                information shared in messages will be automatically blocked for
                HIPAA compliance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500">No messages yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Send a message to start the conversation
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isMine = message.sender.id === currentUserId;
            const isBlocked = message.containsBlockedContent;

            return (
              <div
                key={message.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md ${isMine ? "items-end" : "items-start"} flex flex-col gap-1`}
                >
                  {!isMine && (
                    <span className="text-xs text-gray-500 px-3">
                      {message.sender.displayName || message.sender.email}
                    </span>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      isMine
                        ? "bg-blue-600 text-white"
                        : isBlocked
                          ? "bg-red-100 border border-red-300"
                          : "bg-white border border-gray-200"
                    }`}
                  >
                    {isBlocked ? (
                      <div className="flex items-start gap-2">
                        <Lock className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-red-900 font-medium">
                            Contact information blocked
                          </p>
                          <p className="text-xs text-red-700 mt-1">
                            This message contained{" "}
                            {message.blockedContentType || "contact information"} and
                            has been blocked for HIPAA compliance.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className={`text-sm ${isMine ? "text-white" : "text-gray-900"}`}>
                        {message.messageBody}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs text-gray-400 px-3 ${isMine ? "text-right" : "text-left"}`}
                  >
                    {formatMessageTimestamp(message.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t bg-white px-6 py-4">
        {filterWarning && (
          <div className="mb-3 flex items-start gap-2 rounded-md bg-yellow-50 border border-yellow-200 px-3 py-2">
            <Shield className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-800">{filterWarning}</p>
          </div>
        )}

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Type your message..."
              rows={3}
              className={`w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                filterWarning ? "border-yellow-300" : "border-gray-300"
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
          <button
            type="submit"
            disabled={!messageInput.trim() || sending || !!filterWarning}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed h-fit"
          >
            <Send className="h-4 w-4" />
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
