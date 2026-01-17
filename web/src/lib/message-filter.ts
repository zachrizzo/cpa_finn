/**
 * Message filtering utility for HIPAA compliance
 * Blocks phone numbers and email addresses in messages before CPA is active
 */

// Regular expressions matching those in the Cloud Function
const PHONE_REGEX = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;

interface PreFilterResult {
  shouldBlock: boolean;
  blockedContentType?: string;
  message: string;
}

/**
 * Pre-filter check on the client side before sending
 * This prevents sending messages with contact info when CPA is not active
 */
export function preFilterMessage(
  messageBody: string,
  contactInfoUnlocked: boolean
): PreFilterResult {
  // If contact info is already unlocked (CPA active), no filtering needed
  if (contactInfoUnlocked) {
    return { shouldBlock: false, message: "Contact info allowed" };
  }

  // Reset regex lastIndex for global patterns
  PHONE_REGEX.lastIndex = 0;
  EMAIL_REGEX.lastIndex = 0;

  const hasPhone = PHONE_REGEX.test(messageBody);

  // Reset for email check
  EMAIL_REGEX.lastIndex = 0;
  const hasEmail = EMAIL_REGEX.test(messageBody);

  if (!hasPhone && !hasEmail) {
    return { shouldBlock: false, message: "No contact information detected" };
  }

  const blockedTypes: string[] = [];
  if (hasPhone) blockedTypes.push("phone number");
  if (hasEmail) blockedTypes.push("email address");

  return {
    shouldBlock: true,
    blockedContentType: blockedTypes.join(" and "),
    message: `Message contains ${blockedTypes.join(" and ")} which cannot be shared until your CPA is active.`,
  };
}

/**
 * Check if a message would be blocked (useful for real-time UI feedback)
 */
export function wouldMessageBeBlocked(
  messageBody: string,
  contactInfoUnlocked: boolean
): boolean {
  return preFilterMessage(messageBody, contactInfoUnlocked).shouldBlock;
}
