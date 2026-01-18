/**
 * Message filtering utility for HIPAA compliance
 * Blocks phone numbers and email addresses in messages before CPA is active
 */

const PHONE_REGEX = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i;

interface PreFilterResult {
  shouldBlock: boolean;
  blockedContentType?: string;
  message: string;
}

function detectContactInfo(messageBody: string): string[] {
  const detected: string[] = [];
  if (PHONE_REGEX.test(messageBody)) detected.push("phone number");
  if (EMAIL_REGEX.test(messageBody)) detected.push("email address");
  return detected;
}

/**
 * Pre-filter check on the client side before sending
 * Prevents sending messages with contact info when CPA is not active
 */
export function preFilterMessage(
  messageBody: string,
  contactInfoUnlocked: boolean
): PreFilterResult {
  if (contactInfoUnlocked) {
    return { shouldBlock: false, message: "Contact info allowed" };
  }

  const blockedTypes = detectContactInfo(messageBody);

  if (blockedTypes.length === 0) {
    return { shouldBlock: false, message: "No contact information detected" };
  }

  const typesList = blockedTypes.join(" and ");
  return {
    shouldBlock: true,
    blockedContentType: typesList,
    message: `Message contains ${typesList} which cannot be shared until your CPA is active.`,
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
