import { useCurrentUserId } from "./useCurrentUserId";

interface Participant {
  id: string;
  displayName?: string | null;
  email: string;
}

interface ConversationLike {
  npUser: Participant;
  physicianUser: Participant;
}

interface OtherParticipantResult {
  participant: Participant | null;
  isNP: boolean;
}

/**
 * Hook to determine the other participant in a conversation
 * Returns the other party based on the current user's role
 */
export function useOtherParticipant(conversation: ConversationLike | null): OtherParticipantResult {
  const currentUserId = useCurrentUserId();

  if (!conversation || !currentUserId) {
    return { participant: null, isNP: false };
  }

  const isCurrentUserNP = conversation.npUser.id === currentUserId;

  return {
    participant: isCurrentUserNP ? conversation.physicianUser : conversation.npUser,
    isNP: !isCurrentUserNP,
  };
}

/**
 * Utility function to get the other participant without hook context
 * For use in components that already have currentUserId
 */
export function getOtherParticipant(
  conversation: ConversationLike,
  currentUserId: string | null
): Participant | null {
  if (!currentUserId) return null;
  return conversation.npUser.id === currentUserId
    ? conversation.physicianUser
    : conversation.npUser;
}

/**
 * Get unread count for the current user from a conversation
 */
export function getUnreadCountForUser(
  conversation: {
    npUser: { id: string };
    unreadCountNp?: number | null;
    unreadCountPhysician?: number | null;
  },
  currentUserId: string | null
): number {
  if (!currentUserId) return 0;
  const count = conversation.npUser.id === currentUserId
    ? conversation.unreadCountNp
    : conversation.unreadCountPhysician;
  return count ?? 0;
}
