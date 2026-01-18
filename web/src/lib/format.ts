/**
 * Common formatting utilities for dates, numbers, and display values
 */

/**
 * Format a date string to localized date format
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
}

/**
 * Format a date string to a full localized date format
 */
export function formatDateFull(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const MINUTE_MS = 60000;
const HOUR_MS = 3600000;
const DAY_MS = 86400000;

/**
 * Format a timestamp to relative time (e.g., "5m ago", "2h ago")
 */
export function formatRelativeTime(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMins = Math.floor(diffMs / MINUTE_MS);
  const diffHours = Math.floor(diffMs / HOUR_MS);
  const diffDays = Math.floor(diffMs / DAY_MS);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

/**
 * Format a number with locale-specific formatting
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format a user role for display
 */
export function formatRole(role: string | null | undefined): string {
  if (!role) return "Not set";
  if (role === "np") return "Nurse Practitioner";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

/**
 * Get display name from user object, falling back to email prefix
 */
export function getDisplayName(user: {
  displayName?: string | null;
  email?: string | null;
}): string {
  return user.displayName || user.email?.split("@")[0] || "Unknown User";
}

/**
 * Pluralize a word based on count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || `${singular}s`);
}

/**
 * Format a timestamp for message display
 * Shows "Just now", "Xm ago", time for today, or full date+time for older
 */
export function formatMessageTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / MINUTE_MS);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const timeString = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  if (date.toDateString() === new Date().toDateString()) {
    return timeString;
  }

  return `${date.toLocaleDateString()} ${timeString}`;
}

/**
 * Format a date string into separate date and time parts
 */
export function formatDateTime(dateString: string): { date: string; time: string } {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

/**
 * Check if a date is in the past
 */
export function isDatePast(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format hourly rate for display
 */
export function formatHourlyRate(rate: number | null | undefined): string {
  if (rate == null) return "Rate not specified";
  return `${formatCurrency(rate)}/hr`;
}

/**
 * Get the other party's display name from an agreement based on current user
 */
interface AgreementWithParties {
  npLicense: { user: { id: string; displayName?: string | null; email: string } };
  physicianLicense: { user: { id: string; displayName?: string | null; email: string } };
}

export function getOtherPartyName(
  agreement: AgreementWithParties,
  currentUserId: string | null
): string {
  if (!currentUserId) return "";
  const otherUser =
    agreement.npLicense.user.id === currentUserId
      ? agreement.physicianLicense.user
      : agreement.npLicense.user;
  return getDisplayName(otherUser);
}
