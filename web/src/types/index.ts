/**
 * Shared type definitions used across the application
 */

// Next.js 15 Page Props - params and searchParams are now Promises
// Use this type for pages that don't need URL params to prevent enumeration warnings
export interface PageProps<
  P extends Record<string, string> = Record<string, never>,
  S extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>
> {
  params: Promise<P>;
  searchParams: Promise<S>;
}

// User types
export interface User {
  id: string;
  displayName?: string | null;
  email: string;
  role?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

// License types
export interface License {
  id: string;
  licenseNumber: string;
  licenseType: string;
  issueDate: string;
  expirationDate: string;
  verificationStatus: string;
  verificationDate?: string | null;
  fpaStatus?: string | null;
  user: User;
  state: State;
}

// State types
export interface State {
  id: string;
  stateCode: string;
  stateName: string;
  cpaRequired?: boolean | null;
  physicianNpRatio?: string | null;
  ratioIsFte?: boolean | null;
  chartReviewFrequency?: string | null;
  chartReviewPercentage?: number | null;
  chartReviewControlledSubstancesOnly?: boolean | null;
  qaMeetingFrequency?: string | null;
  qaMeetingDurationMonths?: number | null;
  boardFilingRequired?: boolean | null;
  boardFilingWho?: string | null;
  boardFilingFee?: number | null;
  boardPortalUrl?: string | null;
  cpaRenewalFrequency?: string | null;
  cpaAutoRenews?: boolean | null;
  complianceNotes?: string | null;
  licenseVerificationUrl?: string | null;
}

// Agreement types
export interface Agreement {
  id: string;
  status: string;
  isActive: boolean;
  docusignUrl?: string | null;
  boardFilingDate?: string | null;
  boardApprovalDate?: string | null;
  terminationDate?: string | null;
  terminationReason?: string | null;
  createdAt: string;
  updatedAt: string;
  isBoardReported?: boolean | null;
  boardReportingStatus?: string | null;
  boardReportingInstructions?: string | null;
  terminationResponsibility?: string | null;
  npLicense: License;
  physicianLicense: License;
  state: State;
}

export interface Signature {
  signer: User;
  signedAt: string;
  signatureMethod: string;
  ipAddress?: string | null;
  createdAt: string;
}

// Conversation and Message types
export interface Conversation {
  id: string;
  conversationId: string;
  status: string;
  contactInfoUnlocked: boolean;
  lastMessageAt?: string | null;
  unreadCountNp?: number | null;
  unreadCountPhysician?: number | null;
  createdAt: string;
  npUser: User;
  physicianUser: User;
  collaborationAgreement?: {
    id: string;
    status: string;
    isActive: boolean;
  } | null;
}

export interface Message {
  id: string;
  messageType: string;
  messageBody?: string | null;
  containsBlockedContent?: boolean | null;
  blockedContentType?: string | null;
  readAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  sender: User;
  conversation: {
    id: string;
    contactInfoUnlocked: boolean;
  };
}

// Match types
export interface MatchRequest {
  id: string;
  np: User;
  physician: User;
  state: Pick<State, "stateCode" | "stateName">;
  status: string;
  initiatedBy: string;
  createdAt: string;
}

// State capacity types for provider directory
export interface StateCapacityInfo {
  stateCode: string;
  stateName: string;
  maxNpCapacity: number;
  currentNpCount: number;
  isAccepting: boolean;
  notes?: string | null;
}

// Compliance types
export type ComplianceStatus = "compliant" | "warning" | "overdue";

export interface ComplianceData {
  agreementId: string;
  agreementName: string;
  stateCode: string;
  stateName: string;
  chartReviewStatus: ComplianceStatus;
  qaMeetingStatus: ComplianceStatus;
  chartReviewFrequency: string | null;
  chartReviewPercentage: number | null;
  qaMeetingFrequency: string | null;
  lastChartReview: Date | null;
  lastQAMeeting: Date | null;
  nextChartReviewDue: Date | null;
  nextQAMeetingDue: Date | null;
}

// FPA Eligibility types
export type FPAStatus =
  | "fpa_automatic"
  | "fpa_eligible_now"
  | "fpa_eligible_future"
  | "cpa_required";

export interface FPAEligibility {
  status: FPAStatus;
  notes: string;
  hoursRemaining?: number;
  yearsRemaining?: number;
  eligibilityDate?: string;
}
