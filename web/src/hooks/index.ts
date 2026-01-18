/**
 * Shared Hooks
 *
 * This file re-exports all shared hooks for convenient imports.
 * Usage: import { useCurrentUserId, useOtherParticipant } from "@/hooks";
 */

export { useCurrentUserId } from "./useCurrentUserId";
export {
  useOtherParticipant,
  getOtherParticipant,
  getUnreadCountForUser,
} from "./useOtherParticipant";
export {
  useProtectedData,
  type UseProtectedDataOptions,
  type UseProtectedDataResult,
} from "./useProtectedData";
