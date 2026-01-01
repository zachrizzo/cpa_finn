"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, Lock, CheckCircle, AlertTriangle } from "lucide-react";
import { auth, getDc } from "@/lib/firebase";
import {
  getConversationById,
  getConversationMessages,
  sendMessage,
  markMessageAsRead,
} from "@dataconnect/generated";
import { toast } from "sonner";

interface Message {
  id: string;
  messageType: string;
  messageBody: string;
  containsBlockedContent: boolean | null;
  blockedContentType: string | null;
  readAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  sender: {
    id: string;
    displayName: string | null;
    email: string;
  };
  conversation: {
    id: string;
    contactInfoUnlocked: boolean;
  };
}

interface Conversation {
  id: string;
  conversationId: string;
  status: string;
  contactInfoUnlocked: boolean;
  lastMessageAt: string | null;
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

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

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
        for (const message of data.messages) {
          if (!message.readAt && message.sender.id !== currentUserId) {
            await markMessageAsRead(getDc(), { messageId: message.id });
          }
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

      // Poll for new messages every 5 seconds
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [conversationId, currentUserId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(getDc(), {
        conversationId,
        messageBody: messageInput.trim(),
      });
      setMessageInput("");

      // Fetch messages immediately to show the new message
      const { data } = await getConversationMessages(getDc(), { conversationId });
      setMessages(data.messages as Message[]);
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = () => {
    if (!conversation || !currentUserId) return null;
    if (conversation.npUser.id === currentUserId) {
      return conversation.physicianUser;
    }
    return conversation.npUser;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;

    if (date.toDateString() === now.toDateString()) {
      return `${displayHours}:${displayMinutes} ${ampm}`;
    }

    return `${date.toLocaleDateString()} ${displayHours}:${displayMinutes} ${ampm}`;
  };

  const otherParticipant = getOtherParticipant();
  const isContactInfoUnlocked = conversation?.contactInfoUnlocked || false;
  const hasCPA = conversation?.collaborationAgreement?.isActive || false;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading conversation...</div>
      </div>
    );
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
              <p className="text-sm text-gray-500">
                {otherParticipant?.email}
              </p>
              {hasCPA && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active CPA
                </span>
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
                Contact information (phone numbers and email addresses) will be available once your CPA is signed by both parties.
                Any contact information shared in messages will be automatically blocked for HIPAA compliance.
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
              <p className="text-sm text-gray-400 mt-1">Send a message to start the conversation</p>
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
                <div className={`max-w-md ${isMine ? "items-end" : "items-start"} flex flex-col gap-1`}>
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
                            This message contained {message.blockedContentType || "contact information"} and has been blocked for HIPAA compliance.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className={`text-sm ${isMine ? "text-white" : "text-gray-900"}`}>
                        {message.messageBody}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs text-gray-400 px-3 ${isMine ? "text-right" : "text-left"}`}>
                    {formatTimestamp(message.createdAt)}
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
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
          <button
            type="submit"
            disabled={!messageInput.trim() || sending}
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
