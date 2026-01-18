import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import {
  checkContactInfoUnlocked,
  updateMessageBlocked,
  createMessageAuditLog
} from "./dataconnect-admin-generated";

// Regular expressions for detecting contact information
const PHONE_REGEX = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

interface FilterMessageRequest {
  messageId: string;
  messageBody: string;
  conversationId: string;
}

/**
 * HTTP Callable function to filter message content for HIPAA compliance.
 */
export const filterMessageContent = onCall<FilterMessageRequest>(
  async (request) => {
    // Verify user is authenticated
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "User must be authenticated to filter messages"
      );
    }

    const { messageId, messageBody, conversationId } = request.data;

    if (!messageId || !messageBody || !conversationId) {
      throw new HttpsError(
        "invalid-argument",
        "messageId, messageBody, and conversationId are required"
      );
    }

    try {
      // Query to get conversation and check CPA status
      const conversationResult = await checkContactInfoUnlocked({
        conversationId,
      });

      const conversation = conversationResult.data?.conversation;

      if (!conversation) {
        throw new HttpsError("not-found", "Conversation not found");
      }

      // Check if contact info is unlocked
      const isUnlocked = conversation.contactInfoUnlocked;
      const hasCPA = conversation.collaborationAgreement?.isActive || false;

      // If contact info is unlocked or CPA is active, no filtering needed
      if (isUnlocked || hasCPA) {
        return {
          filtered: false,
          message: "Message does not require filtering",
        };
      }

      // Check for phone numbers or email addresses
      const phoneMatches = messageBody.match(PHONE_REGEX);
      const emailMatches = messageBody.match(EMAIL_REGEX);

      // If no contact info found, return
      if (!phoneMatches && !emailMatches) {
        return {
          filtered: false,
          message: "No contact information detected",
        };
      }

      // Determine what was blocked
      const blockedTypes: string[] = [];
      if (phoneMatches) blockedTypes.push("phone number");
      if (emailMatches) blockedTypes.push("email address");

      const blockedContentType = blockedTypes.join(" and ");

      // Update the message to mark it as blocked
      await updateMessageBlocked({
        messageId,
        originalBody: messageBody,
        blockedContentType,
      });

      // Create audit log entry
      await createMessageAuditLog({
        conversationId,
        userId: request.auth.uid,
        actionType: "CONTENT_BLOCKED",
        actionDetails: `Blocked ${blockedContentType} from message. CPA not active.`,
      });

      return {
        filtered: true,
        blockedContentType,
        message: `Message contained ${blockedContentType} and has been blocked`,
      };
    } catch (error: any) {
      console.error("Error filtering message:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError(
        "internal",
        "Failed to filter message content: " + error.message
      );
    }
  }
);

/**
 * Scheduled function to periodically scan messages for contact information.
 * Currently a placeholder - requires GetUnscannedMessages query implementation.
 */
export const scanMessagesForContactInfo = onSchedule(
  {
    schedule: "every 5 minutes",
    timeZone: "America/New_York",
  },
  async () => {
    try {
      console.log("Scheduled message scan initiated");
    } catch (error) {
      console.error("Error in scheduled message scan:", error);
    }
  }
);
