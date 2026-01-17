import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface ActivateAgreementData {
  collaborationAgreement_update?: CollaborationAgreement_Key | null;
}

export interface ActivateAgreementVariables {
  agreementId: UUIDString;
}

export interface AttachmentDownload_Key {
  id: UUIDString;
  __typename?: 'AttachmentDownload_Key';
}

export interface BoardFilingDocumentRequirement_Key {
  id: UUIDString;
  __typename?: 'BoardFilingDocumentRequirement_Key';
}

export interface BoardFilingSubmission_Key {
  id: UUIDString;
  __typename?: 'BoardFilingSubmission_Key';
}

export interface BoardFilingUpload_Key {
  id: UUIDString;
  __typename?: 'BoardFilingUpload_Key';
}

export interface ChartReview_Key {
  id: UUIDString;
  __typename?: 'ChartReview_Key';
}

export interface CheckBothPartiesSignedData {
  collaborationAgreement?: {
    id: UUIDString;
    status: string;
    isActive: boolean;
    npLicense: {
      user: {
        id: string;
        displayName?: string | null;
      } & User_Key;
    };
      physicianLicense: {
        user: {
          id: string;
          displayName?: string | null;
        } & User_Key;
      };
  } & CollaborationAgreement_Key;
}

export interface CheckBothPartiesSignedVariables {
  agreementId: UUIDString;
}

export interface CheckContactInfoUnlockedData {
  conversation?: {
    id: UUIDString;
    contactInfoUnlocked: boolean;
    collaborationAgreement?: {
      id: UUIDString;
      status: string;
      isActive: boolean;
    } & CollaborationAgreement_Key;
  } & Conversation_Key;
}

export interface CheckContactInfoUnlockedVariables {
  conversationId: UUIDString;
}

export interface CollaborationAgreement_Key {
  id: UUIDString;
  __typename?: 'CollaborationAgreement_Key';
}

export interface CompleteQaMeetingData {
  qualityAssuranceMeeting_update?: QualityAssuranceMeeting_Key | null;
}

export interface CompleteQaMeetingVariables {
  meetingId: UUIDString;
  notes?: string | null;
  meetingDocumentUrl?: string | null;
}

export interface Conversation_Key {
  id: UUIDString;
  __typename?: 'Conversation_Key';
}

export interface CreateCollaborationAgreementData {
  collaborationAgreement_insert: CollaborationAgreement_Key;
}

export interface CreateCollaborationAgreementVariables {
  npLicenseId: UUIDString;
  physicianLicenseId: UUIDString;
  stateId: UUIDString;
  docusignUrl?: string | null;
}

export interface CreateConversationData {
  conversation_insert: Conversation_Key;
}

export interface CreateConversationVariables {
  participantUserId: string;
  agreementId?: UUIDString | null;
}

export interface CreateDirectoryMatchByPhysicianData {
  directoryMatch_insert: DirectoryMatch_Key;
}

export interface CreateDirectoryMatchByPhysicianVariables {
  targetNpId: string;
  stateId: UUIDString;
}

export interface CreateDirectoryMatchData {
  directoryMatch_insert: DirectoryMatch_Key;
}

export interface CreateDirectoryMatchVariables {
  targetPhysicianId: string;
  stateId: UUIDString;
}

export interface CreateLicenseData {
  license_insert: License_Key;
}

export interface CreateLicenseVariables {
  stateId: UUIDString;
  licenseNumber: string;
  licenseType: string;
  issueDate: DateString;
  expirationDate: DateString;
  verificationStatus: string;
  supervisedHoursInState?: number | null;
  supervisedYearsInState?: number | null;
}

export interface CreateMediaData {
  media_insert: Media_Key;
}

export interface CreateMediaVariables {
  mediaId: string;
  mediaType: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  containsPhi: boolean;
}

export interface CreateMessageAuditLogData {
  messageAuditLog_insert: MessageAuditLog_Key;
}

export interface CreateMessageAuditLogVariables {
  conversationId: UUIDString;
  actionType: string;
  userId: string;
  actionDetails: string;
}

export interface CreateNpDirectoryData {
  npDirectory_insert: NpDirectory_Key;
}

export interface CreateNpDirectoryVariables {
  seekingStates: string;
  licensedStates: string;
  specialtyType: string;
  needsCPA: boolean;
  cpaNeededStates?: string | null;
}

export interface CreatePhysicianDirectoryData {
  providerDirectory_insert: ProviderDirectory_Key;
}

export interface CreatePhysicianDirectoryVariables {
  availableStates: string;
  specialtyType: string;
  maxNPs: number;
  currentNPCount: number;
  availableForNewNPs: boolean;
  supervisionModel: string;
}

export interface DeleteStateCapacityData {
  providerStateCapacity_delete?: ProviderStateCapacity_Key | null;
}

export interface DeleteStateCapacityVariables {
  id: UUIDString;
}

export interface DirectoryMatch_Key {
  id: UUIDString;
  __typename?: 'DirectoryMatch_Key';
}

export interface DocumentShare_Key {
  id: UUIDString;
  __typename?: 'DocumentShare_Key';
}

export interface DocumentSignature_Key {
  mediaId: UUIDString;
  signerId: string;
  __typename?: 'DocumentSignature_Key';
}

export interface FileUploadPolicy_Key {
  id: UUIDString;
  __typename?: 'FileUploadPolicy_Key';
}

export interface GetActiveCpaCountData {
  collaborationAgreements: ({
    id: UUIDString;
  } & CollaborationAgreement_Key)[];
}

export interface GetActiveCpaCountVariables {
  physicianId: string;
  stateCode: string;
}

export interface GetAgreementByIdData {
  collaborationAgreement?: {
    id: UUIDString;
    status: string;
    isActive: boolean;
    docusignUrl?: string | null;
    boardFilingDate?: DateString | null;
    boardApprovalDate?: DateString | null;
    terminationDate?: DateString | null;
    terminationReason?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    isBoardReported?: boolean | null;
    boardReportingStatus?: string | null;
    boardReportingInstructions?: string | null;
    terminationResponsibility?: string | null;
    npLicense: {
      id: UUIDString;
      licenseNumber: string;
      licenseType: string;
      issueDate: DateString;
      expirationDate: DateString;
      verificationStatus: string;
      user: {
        id: string;
        displayName?: string | null;
        email: string;
        role?: string | null;
      } & User_Key;
    } & License_Key;
      physicianLicense: {
        id: UUIDString;
        licenseNumber: string;
        licenseType: string;
        issueDate: DateString;
        expirationDate: DateString;
        verificationStatus: string;
        user: {
          id: string;
          displayName?: string | null;
          email: string;
          role?: string | null;
        } & User_Key;
      } & License_Key;
        state: {
          id: UUIDString;
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
        } & State_Key;
  } & CollaborationAgreement_Key;
}

export interface GetAgreementByIdVariables {
  agreementId: UUIDString;
}

export interface GetAgreementSignaturesData {
  documentSignatures: ({
    signer: {
      id: string;
      displayName?: string | null;
      email: string;
      role?: string | null;
    } & User_Key;
      signedAt: TimestampString;
      signatureMethod: string;
      ipAddress?: string | null;
      createdAt: TimestampString;
  })[];
}

export interface GetAgreementSignaturesVariables {
  npUserId: string;
  physicianUserId: string;
}

export interface GetChartReviewsData {
  chartReviews: ({
    id: UUIDString;
    reviewDate: DateString;
    isTimely: boolean;
    notes?: string | null;
    chartIdentifier?: string | null;
    reviewPercentage?: number | null;
    isControlledSubstanceChart?: boolean | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    reviewer: {
      id: string;
      displayName?: string | null;
      email: string;
      role?: string | null;
    } & User_Key;
      collaborationAgreement: {
        id: UUIDString;
        status: string;
        state: {
          stateCode: string;
          stateName: string;
          chartReviewFrequency?: string | null;
          chartReviewPercentage?: number | null;
          chartReviewControlledSubstancesOnly?: boolean | null;
        };
      } & CollaborationAgreement_Key;
  } & ChartReview_Key)[];
}

export interface GetChartReviewsVariables {
  agreementId: UUIDString;
}

export interface GetComplianceStatusData {
  collaborationAgreement?: {
    id: UUIDString;
    status: string;
    isActive: boolean;
    createdAt: TimestampString;
    boardApprovalDate?: DateString | null;
    npLicense: {
      id: UUIDString;
      user: {
        id: string;
        displayName?: string | null;
        email: string;
        role?: string | null;
      } & User_Key;
    } & License_Key;
      physicianLicense: {
        id: UUIDString;
        user: {
          id: string;
          displayName?: string | null;
          email: string;
          role?: string | null;
        } & User_Key;
      } & License_Key;
        state: {
          id: UUIDString;
          stateCode: string;
          stateName: string;
          chartReviewFrequency?: string | null;
          chartReviewPercentage?: number | null;
          chartReviewControlledSubstancesOnly?: boolean | null;
          qaMeetingFrequency?: string | null;
          qaMeetingDurationMonths?: number | null;
          cpaRenewalFrequency?: string | null;
          cpaAutoRenews?: boolean | null;
          complianceNotes?: string | null;
        } & State_Key;
  } & CollaborationAgreement_Key;
    chartReviews: ({
      id: UUIDString;
      reviewDate: DateString;
      isTimely: boolean;
      reviewPercentage?: number | null;
      createdAt: TimestampString;
    } & ChartReview_Key)[];
      qualityAssuranceMeetings: ({
        id: UUIDString;
        meetingDate: TimestampString;
        createdAt: TimestampString;
      } & QualityAssuranceMeeting_Key)[];
}

export interface GetComplianceStatusVariables {
  agreementId: UUIDString;
}

export interface GetConversationByIdData {
  conversation?: {
    id: UUIDString;
    conversationId: UUIDString;
    status: string;
    contactInfoUnlocked: boolean;
    lastMessageAt?: TimestampString | null;
    unreadCountNp?: number | null;
    unreadCountPhysician?: number | null;
    createdAt: TimestampString;
    npUser: {
      id: string;
      displayName?: string | null;
      email: string;
    } & User_Key;
      physicianUser: {
        id: string;
        displayName?: string | null;
        email: string;
      } & User_Key;
        collaborationAgreement?: {
          id: UUIDString;
          status: string;
          isActive: boolean;
        } & CollaborationAgreement_Key;
  } & Conversation_Key;
}

export interface GetConversationByIdVariables {
  conversationId: UUIDString;
}

export interface GetConversationMessagesData {
  messages: ({
    id: UUIDString;
    messageType: string;
    messageBody?: string | null;
    containsBlockedContent?: boolean | null;
    blockedContentType?: string | null;
    readAt?: TimestampString | null;
    deliveredAt?: TimestampString | null;
    createdAt: TimestampString;
    sender: {
      id: string;
      displayName?: string | null;
      email: string;
    } & User_Key;
      conversation: {
        id: UUIDString;
        contactInfoUnlocked: boolean;
      } & Conversation_Key;
  } & Message_Key)[];
}

export interface GetConversationMessagesVariables {
  conversationId: UUIDString;
}

export interface GetDirectoryMatchesData {
  directoryMatches: ({
    id: UUIDString;
    np: {
      id: string;
      displayName?: string | null;
      email: string;
    } & User_Key;
      physician: {
        id: string;
        displayName?: string | null;
        email: string;
      } & User_Key;
        state: {
          stateCode: string;
          stateName: string;
        };
          status: string;
          initiatedBy: string;
          firstContactAt: TimestampString;
          lastContactAt?: TimestampString | null;
          messageCount?: number | null;
          agreedToCollaborate?: boolean | null;
          agreedAt?: TimestampString | null;
          declinedBy?: string | null;
          declinedAt?: TimestampString | null;
          declineReason?: string | null;
          createdAt: TimestampString;
  } & DirectoryMatch_Key)[];
}

export interface GetDirectoryMatchesVariables {
  userId: string;
}

export interface GetLicenseWithFpaEligibilityData {
  license?: {
    id: UUIDString;
    licenseNumber: string;
    licenseType: string;
    issueDate: DateString;
    expirationDate: DateString;
    verificationStatus: string;
    fpaStatus?: string | null;
    fpaApplicationDate?: DateString | null;
    fpaApprovalDate?: DateString | null;
    fpaVerifiedOnPortal?: boolean | null;
    rxAuthorityStatus?: string | null;
    supervisedHoursInState?: number | null;
    supervisedYearsInState?: number | null;
    notes?: string | null;
    state: {
      id: UUIDString;
      stateCode: string;
      stateName: string;
      fpaAvailable: boolean;
      fpaAutomaticWithLicense?: boolean | null;
      fpaRequiresApplication?: boolean | null;
      fpaHoursRequired?: number | null;
      fpaYearsRequired?: number | null;
      fpaWithinStateRequired?: boolean | null;
      cpaRequired?: boolean | null;
      physicianNpRatio?: string | null;
      boardFilingRequired?: boolean | null;
      boardPortalUrl?: string | null;
      licenseVerificationUrl?: string | null;
      complianceNotes?: string | null;
    } & State_Key;
  } & License_Key;
}

export interface GetLicenseWithFpaEligibilityVariables {
  licenseId: UUIDString;
}

export interface GetMyAgreementsData {
  collaborationAgreements: ({
    id: UUIDString;
    status: string;
    isActive: boolean;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    boardFilingDate?: DateString | null;
    boardApprovalDate?: DateString | null;
    terminationDate?: DateString | null;
    terminationReason?: string | null;
    docusignUrl?: string | null;
    npLicense: {
      id: UUIDString;
      licenseNumber: string;
      licenseType: string;
      user: {
        id: string;
        displayName?: string | null;
        email: string;
      } & User_Key;
    } & License_Key;
      physicianLicense: {
        id: UUIDString;
        licenseNumber: string;
        licenseType: string;
        user: {
          id: string;
          displayName?: string | null;
          email: string;
        } & User_Key;
      } & License_Key;
        state: {
          id: UUIDString;
          stateCode: string;
          stateName: string;
          cpaRequired?: boolean | null;
          physicianNpRatio?: string | null;
          chartReviewFrequency?: string | null;
          chartReviewPercentage?: number | null;
          qaMeetingFrequency?: string | null;
          cpaRenewalFrequency?: string | null;
          boardFilingRequired?: boolean | null;
          complianceNotes?: string | null;
        } & State_Key;
  } & CollaborationAgreement_Key)[];
}

export interface GetMyConversationsData {
  conversations: ({
    id: UUIDString;
    conversationId: UUIDString;
    status: string;
    contactInfoUnlocked: boolean;
    lastMessageAt?: TimestampString | null;
    unreadCountNp?: number | null;
    unreadCountPhysician?: number | null;
    createdAt: TimestampString;
    npUser: {
      id: string;
      displayName?: string | null;
      email: string;
    } & User_Key;
      physicianUser: {
        id: string;
        displayName?: string | null;
        email: string;
      } & User_Key;
        collaborationAgreement?: {
          id: UUIDString;
          status: string;
          isActive: boolean;
        } & CollaborationAgreement_Key;
  } & Conversation_Key)[];
}

export interface GetMyDirectoryProfileData {
  providerDirectory?: {
    physician: {
      id: string;
      displayName?: string | null;
      email: string;
      role?: string | null;
    } & User_Key;
      isActive: boolean;
      profileVisibility: string;
      availableStates: string;
      preferredStates?: string | null;
      notAcceptingStates?: string | null;
      totalNpCapacity?: number | null;
      currentNpCount?: number | null;
      availableSpots?: number | null;
      primarySpecialty: string;
      secondarySpecialties?: string | null;
      supervisionModel: string;
      hourlyRate?: number | null;
      revenueSharePercentage?: number | null;
      minimumHoursRequired?: number | null;
      maximumHoursOffered?: number | null;
      responseTime?: string | null;
      preferredContactMethod?: string | null;
      yearsSupervising?: number | null;
      totalNpSupervised?: number | null;
      currentNpTestimonials?: string | null;
      isVerified?: boolean | null;
      isPremiumPhysician?: boolean | null;
      badges?: string | null;
      lastActiveAt?: TimestampString | null;
      createdAt: TimestampString;
  };
    npDirectory?: {
      np: {
        id: string;
        displayName?: string | null;
        email: string;
        role?: string | null;
      } & User_Key;
        isActive: boolean;
        profileVisibility: string;
        seekingStates: string;
        licensedStates: string;
        fpaStates?: string | null;
        cpaNeededStates?: string | null;
        hoursPerWeekAvailable?: number | null;
        startDateAvailability?: DateString | null;
        primarySpecialty: string;
        secondarySpecialties?: string | null;
        yearsExperience?: number | null;
        totalPatientsSeen?: number | null;
        preferredCompensationModel?: string | null;
        budgetRange?: string | null;
        lastActiveAt?: TimestampString | null;
        createdAt: TimestampString;
    };
}

export interface GetMyLicensesData {
  licenses: ({
    id: UUIDString;
    licenseNumber: string;
    licenseType: string;
    issueDate: DateString;
    expirationDate: DateString;
    verificationStatus: string;
    verificationDate?: TimestampString | null;
    fpaStatus?: string | null;
    rxAuthorityStatus?: string | null;
    state: {
      id: UUIDString;
      stateCode: string;
      stateName: string;
      licenseVerificationUrl?: string | null;
    } & State_Key;
  } & License_Key)[];
}

export interface GetMyProfileData {
  user?: {
    email: string;
    displayName?: string | null;
    role?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  };
}

export interface GetMyStateCapacitiesData {
  providerStateCapacities: ({
    id: UUIDString;
    state: {
      id: UUIDString;
      stateCode: string;
      stateName: string;
    } & State_Key;
      maxNpCapacity: number;
      currentNpCount: number;
      isAccepting: boolean;
      notes?: string | null;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & ProviderStateCapacity_Key)[];
}

export interface GetPhysicianStateCapacitiesData {
  providerStateCapacities: ({
    id: UUIDString;
    state: {
      id: UUIDString;
      stateCode: string;
      stateName: string;
    } & State_Key;
      maxNpCapacity: number;
      currentNpCount: number;
      isAccepting: boolean;
      notes?: string | null;
  } & ProviderStateCapacity_Key)[];
}

export interface GetPhysicianStateCapacitiesVariables {
  physicianId: string;
}

export interface GetProviderDirectoryProfileData {
  providerDirectory?: {
    physician: {
      id: string;
      displayName?: string | null;
      email: string;
    } & User_Key;
      isActive: boolean;
      profileVisibility: string;
      availableStates: string;
      preferredStates?: string | null;
      totalNpCapacity?: number | null;
      currentNpCount?: number | null;
      availableSpots?: number | null;
      primarySpecialty: string;
      secondarySpecialties?: string | null;
      supervisionModel: string;
      hourlyRate?: number | null;
      revenueSharePercentage?: number | null;
      minimumHoursRequired?: number | null;
      maximumHoursOffered?: number | null;
      responseTime?: string | null;
      preferredContactMethod?: string | null;
      yearsSupervising?: number | null;
      totalNpSupervised?: number | null;
      badges?: string | null;
      isPremiumPhysician?: boolean | null;
  };
    npDirectory?: {
      np: {
        id: string;
        displayName?: string | null;
        email: string;
      } & User_Key;
        isActive: boolean;
        profileVisibility: string;
        seekingStates: string;
        licensedStates: string;
        fpaStates?: string | null;
        cpaNeededStates?: string | null;
        hoursPerWeekAvailable?: number | null;
        startDateAvailability?: DateString | null;
        primarySpecialty: string;
        secondarySpecialties?: string | null;
        yearsExperience?: number | null;
        preferredCompensationModel?: string | null;
        budgetRange?: string | null;
    };
}

export interface GetProviderDirectoryProfileVariables {
  userId: string;
}

export interface GetQaMeetingsData {
  qualityAssuranceMeetings: ({
    id: UUIDString;
    meetingDate: TimestampString;
    notes?: string | null;
    meetingDocumentUrl?: string | null;
    meetingType?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    host: {
      id: string;
      displayName?: string | null;
      email: string;
      role?: string | null;
    } & User_Key;
      collaborationAgreement: {
        id: UUIDString;
        status: string;
        state: {
          stateCode: string;
          stateName: string;
          qaMeetingFrequency?: string | null;
          qaMeetingDurationMonths?: number | null;
        };
      } & CollaborationAgreement_Key;
  } & QualityAssuranceMeeting_Key)[];
}

export interface GetQaMeetingsVariables {
  agreementId: UUIDString;
}

export interface GetStateByCodeData {
  states: ({
    id: UUIDString;
    stateCode: string;
    stateName: string;
    fpaAvailable: boolean;
    fpaAutomaticWithLicense?: boolean | null;
    fpaRequiresApplication?: boolean | null;
    fpaHoursRequired?: number | null;
    fpaYearsRequired?: number | null;
    fpaWithinStateRequired?: boolean | null;
    cpaRequired?: boolean | null;
    physicianNpRatio?: string | null;
    boardFilingRequired?: boolean | null;
    boardPortalUrl?: string | null;
    licenseVerificationUrl?: string | null;
    complianceNotes?: string | null;
  } & State_Key)[];
}

export interface GetStateByCodeVariables {
  stateCode: string;
}

export interface GetStateByIdData {
  state?: {
    stateCode: string;
    stateName: string;
    fpaAvailable: boolean;
    paVerificationRequired: boolean;
    nursysCompatible: boolean;
    fpaAutomaticWithLicense?: boolean | null;
    fpaRequiresApplication?: boolean | null;
    fpaHoursRequired?: number | null;
    fpaYearsRequired?: number | null;
    cpaRequired?: boolean | null;
    physicianNpRatio?: string | null;
    boardFilingRequired?: boolean | null;
    boardFilingWho?: string | null;
    boardFilingFee?: number | null;
    boardPortalUrl?: string | null;
    licenseVerificationUrl?: string | null;
    complianceNotes?: string | null;
  };
}

export interface GetStateByIdVariables {
  id: UUIDString;
}

export interface GetStateRatioData {
  states: ({
    physicianNpRatio?: string | null;
    hasRatioLimit: boolean;
    ratioNote?: string | null;
  })[];
}

export interface GetStateRatioVariables {
  stateCode: string;
}

export interface GetUpcomingQaMeetingsData {
  collaborationAgreements: ({
    id: UUIDString;
    status: string;
    isActive: boolean;
    createdAt: TimestampString;
    boardApprovalDate?: DateString | null;
    npLicense: {
      user: {
        id: string;
        displayName?: string | null;
        email: string;
      } & User_Key;
    };
      physicianLicense: {
        user: {
          id: string;
          displayName?: string | null;
          email: string;
        } & User_Key;
      };
        state: {
          stateCode: string;
          stateName: string;
          qaMeetingFrequency?: string | null;
          qaMeetingDurationMonths?: number | null;
          complianceNotes?: string | null;
        };
  } & CollaborationAgreement_Key)[];
    qualityAssuranceMeetings: ({
      id: UUIDString;
      meetingDate: TimestampString;
      meetingType?: string | null;
      createdAt: TimestampString;
      collaborationAgreement: {
        id: UUIDString;
      } & CollaborationAgreement_Key;
    } & QualityAssuranceMeeting_Key)[];
}

export interface LicenseVerificationAttempt_Key {
  id: UUIDString;
  __typename?: 'LicenseVerificationAttempt_Key';
}

export interface License_Key {
  id: UUIDString;
  __typename?: 'License_Key';
}

export interface ListStatesData {
  states: ({
    id: UUIDString;
    stateCode: string;
    stateName: string;
    fpaAvailable: boolean;
    fpaAutomaticWithLicense?: boolean | null;
    fpaRequiresApplication?: boolean | null;
    fpaHoursRequired?: number | null;
    fpaYearsRequired?: number | null;
    fpaWithinStateRequired?: boolean | null;
    fpaCmeHoursRequired?: number | null;
    paVerificationRequired: boolean;
    cpaRequired?: boolean | null;
    boardFilingRequired?: boolean | null;
    licenseVerificationUrl?: string | null;
    complianceNotes?: string | null;
  } & State_Key)[];
}

export interface MarkMessageAsReadData {
  message_update?: Message_Key | null;
}

export interface MarkMessageAsReadVariables {
  messageId: UUIDString;
}

export interface Media_Key {
  id: UUIDString;
  __typename?: 'Media_Key';
}

export interface MeetingAttendee_Key {
  meetingId: UUIDString;
  attendeeId: string;
  __typename?: 'MeetingAttendee_Key';
}

export interface MessageAttachment_Key {
  id: UUIDString;
  __typename?: 'MessageAttachment_Key';
}

export interface MessageAuditLog_Key {
  id: UUIDString;
  __typename?: 'MessageAuditLog_Key';
}

export interface MessageReaction_Key {
  messageId: UUIDString;
  userId: string;
  __typename?: 'MessageReaction_Key';
}

export interface Message_Key {
  id: UUIDString;
  __typename?: 'Message_Key';
}

export interface NpDirectory_Key {
  npId: string;
  __typename?: 'NpDirectory_Key';
}

export interface ProviderDirectory_Key {
  physicianId: string;
  __typename?: 'ProviderDirectory_Key';
}

export interface ProviderStateCapacity_Key {
  id: UUIDString;
  __typename?: 'ProviderStateCapacity_Key';
}

export interface QualityAssuranceMeeting_Key {
  id: UUIDString;
  __typename?: 'QualityAssuranceMeeting_Key';
}

export interface ScheduleQaMeetingData {
  qualityAssuranceMeeting_insert: QualityAssuranceMeeting_Key;
}

export interface ScheduleQaMeetingVariables {
  agreementId: UUIDString;
  meetingDate: TimestampString;
  meetingType?: string | null;
  notes?: string | null;
}

export interface SearchNPsData {
  npDirectories: ({
    np: {
      id: string;
      displayName?: string | null;
      email: string;
    } & User_Key;
      isActive: boolean;
      seekingStates: string;
      licensedStates: string;
      fpaStates?: string | null;
      cpaNeededStates?: string | null;
      primarySpecialty: string;
      secondarySpecialties?: string | null;
      hoursPerWeekAvailable?: number | null;
      startDateAvailability?: DateString | null;
      yearsExperience?: number | null;
      preferredCompensationModel?: string | null;
      budgetRange?: string | null;
  })[];
}

export interface SearchNPsVariables {
  stateCode?: string | null;
  specialtyType?: string | null;
  needsCPA?: boolean | null;
}

export interface SearchPhysiciansData {
  providerDirectories: ({
    physician: {
      id: string;
      displayName?: string | null;
      email: string;
    } & User_Key;
      isActive: boolean;
      availableStates: string;
      primarySpecialty: string;
      secondarySpecialties?: string | null;
      totalNpCapacity?: number | null;
      currentNpCount?: number | null;
      availableSpots?: number | null;
      supervisionModel: string;
      hourlyRate?: number | null;
      revenueSharePercentage?: number | null;
      yearsSupervising?: number | null;
      responseTime?: string | null;
      badges?: string | null;
      isPremiumPhysician?: boolean | null;
  })[];
}

export interface SearchPhysiciansVariables {
  stateCode?: string | null;
  specialtyType?: string | null;
  availableForNewNPs?: boolean | null;
}

export interface SearchPhysiciansWithStateCapacityData {
  providerDirectories: ({
    physician: {
      id: string;
      displayName?: string | null;
      email: string;
    } & User_Key;
      isActive: boolean;
      availableStates: string;
      primarySpecialty: string;
      secondarySpecialties?: string | null;
      totalNpCapacity?: number | null;
      currentNpCount?: number | null;
      availableSpots?: number | null;
      supervisionModel: string;
      hourlyRate?: number | null;
      revenueSharePercentage?: number | null;
      yearsSupervising?: number | null;
      responseTime?: string | null;
      badges?: string | null;
      isPremiumPhysician?: boolean | null;
  })[];
}

export interface SearchPhysiciansWithStateCapacityVariables {
  stateCode?: string | null;
  specialtyType?: string | null;
  availableForNewNPs?: boolean | null;
}

export interface SeedStatesData {
  ak: State_Key;
  dc: State_Key;
  nh: State_Key;
  or: State_Key;
  ri: State_Key;
  ut: State_Key;
  wy: State_Key;
  ct: State_Key;
  il: State_Key;
  ma: State_Key;
  mi: State_Key;
  nj: State_Key;
  vt: State_Key;
  wi: State_Key;
  tx: State_Key;
  ca: State_Key;
}

export interface SendMessageData {
  message_insert: Message_Key;
}

export interface SendMessageVariables {
  conversationId: UUIDString;
  messageBody: string;
}

export interface SharedChart_Key {
  id: UUIDString;
  __typename?: 'SharedChart_Key';
}

export interface SignAgreementData {
  documentSignature_upsert: DocumentSignature_Key;
}

export interface SignAgreementVariables {
  agreementId: UUIDString;
  mediaId: UUIDString;
  signatureMethod: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface State_Key {
  id: UUIDString;
  __typename?: 'State_Key';
}

export interface SubmitChartReviewData {
  chartReview_insert: ChartReview_Key;
}

export interface SubmitChartReviewVariables {
  agreementId: UUIDString;
  reviewDate: DateString;
  isTimely: boolean;
  chartIdentifier?: string | null;
  notes?: string | null;
  reviewPercentage?: number | null;
  isControlledSubstanceChart?: boolean | null;
}

export interface TerminateAgreementData {
  collaborationAgreement_update?: CollaborationAgreement_Key | null;
}

export interface TerminateAgreementVariables {
  agreementId: UUIDString;
  terminationReason: string;
  terminationResponsibility?: string | null;
}

export interface UnlockConversationContactInfoData {
  conversation_update?: Conversation_Key | null;
}

export interface UnlockConversationContactInfoVariables {
  conversationId: UUIDString;
}

export interface UpdateChartReviewDocumentData {
  chartReview_update?: ChartReview_Key | null;
}

export interface UpdateChartReviewDocumentVariables {
  reviewId: UUIDString;
  notes?: string | null;
}

export interface UpdateLicenseFpaStatusData {
  license_update?: License_Key | null;
}

export interface UpdateLicenseFpaStatusVariables {
  licenseId: UUIDString;
  fpaStatus: string;
  fpaEligibilityDate?: DateString | null;
  supervisedHoursInState?: number | null;
  supervisedYearsInState?: number | null;
}

export interface UpdateLicenseVerificationData {
  license_update?: License_Key | null;
}

export interface UpdateLicenseVerificationVariables {
  licenseId: UUIDString;
  verificationStatus: string;
  verificationMethod?: string | null;
}

export interface UpdateMatchStatusData {
  directoryMatch_update?: DirectoryMatch_Key | null;
}

export interface UpdateMatchStatusVariables {
  matchId: UUIDString;
  status: string;
  declinedBy?: string | null;
  declineReason?: string | null;
}

export interface UpdateMessageBlockedData {
  message_update?: Message_Key | null;
}

export interface UpdateMessageBlockedVariables {
  messageId: UUIDString;
  originalBody: string;
  blockedContentType: string;
}

export interface UpdateNpDirectoryProfileData {
  npDirectory_update?: NpDirectory_Key | null;
}

export interface UpdateNpDirectoryProfileVariables {
  isActive?: boolean | null;
  profileVisibility?: string | null;
  seekingStates?: string | null;
  licensedStates?: string | null;
  cpaNeededStates?: string | null;
  primarySpecialty?: string | null;
  hoursPerWeekAvailable?: number | null;
  preferredCompensationModel?: string | null;
}

export interface UpdatePhysicianDirectoryProfileData {
  providerDirectory_update?: ProviderDirectory_Key | null;
}

export interface UpdatePhysicianDirectoryProfileVariables {
  availableForNewNPs?: boolean | null;
  maxNPs?: number | null;
  availableSpots?: number | null;
  currentNpCount?: number | null;
  isActive?: boolean | null;
  profileVisibility?: string | null;
  availableStates?: string | null;
  primarySpecialty?: string | null;
  supervisionModel?: string | null;
  hourlyRate?: number | null;
  revenueSharePercentage?: number | null;
}

export interface UpsertStateCapacityData {
  providerStateCapacity_upsert: ProviderStateCapacity_Key;
}

export interface UpsertStateCapacityVariables {
  stateId: UUIDString;
  maxNpCapacity: number;
  currentNpCount: number;
  isAccepting: boolean;
  notes?: string | null;
}

export interface UpsertUserProfileData {
  user_upsert: User_Key;
}

export interface UpsertUserProfileVariables {
  displayName?: string | null;
  role?: string | null;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'UpsertUserProfile' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertUserProfile(dc: DataConnect, vars?: UpsertUserProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertUserProfileData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertUserProfile' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertUserProfile(vars?: UpsertUserProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertUserProfileData>>;

/** Generated Node Admin SDK operation action function for the 'CreateLicense' Mutation. Allow users to execute without passing in DataConnect. */
export function createLicense(dc: DataConnect, vars: CreateLicenseVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateLicenseData>>;
/** Generated Node Admin SDK operation action function for the 'CreateLicense' Mutation. Allow users to pass in custom DataConnect instances. */
export function createLicense(vars: CreateLicenseVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateLicenseData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateLicenseVerification' Mutation. Allow users to execute without passing in DataConnect. */
export function updateLicenseVerification(dc: DataConnect, vars: UpdateLicenseVerificationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateLicenseVerificationData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateLicenseVerification' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateLicenseVerification(vars: UpdateLicenseVerificationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateLicenseVerificationData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateLicenseFpaStatus' Mutation. Allow users to execute without passing in DataConnect. */
export function updateLicenseFpaStatus(dc: DataConnect, vars: UpdateLicenseFpaStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateLicenseFpaStatusData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateLicenseFpaStatus' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateLicenseFpaStatus(vars: UpdateLicenseFpaStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateLicenseFpaStatusData>>;

/** Generated Node Admin SDK operation action function for the 'CreateConversation' Mutation. Allow users to execute without passing in DataConnect. */
export function createConversation(dc: DataConnect, vars: CreateConversationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateConversationData>>;
/** Generated Node Admin SDK operation action function for the 'CreateConversation' Mutation. Allow users to pass in custom DataConnect instances. */
export function createConversation(vars: CreateConversationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateConversationData>>;

/** Generated Node Admin SDK operation action function for the 'SendMessage' Mutation. Allow users to execute without passing in DataConnect. */
export function sendMessage(dc: DataConnect, vars: SendMessageVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SendMessageData>>;
/** Generated Node Admin SDK operation action function for the 'SendMessage' Mutation. Allow users to pass in custom DataConnect instances. */
export function sendMessage(vars: SendMessageVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SendMessageData>>;

/** Generated Node Admin SDK operation action function for the 'MarkMessageAsRead' Mutation. Allow users to execute without passing in DataConnect. */
export function markMessageAsRead(dc: DataConnect, vars: MarkMessageAsReadVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<MarkMessageAsReadData>>;
/** Generated Node Admin SDK operation action function for the 'MarkMessageAsRead' Mutation. Allow users to pass in custom DataConnect instances. */
export function markMessageAsRead(vars: MarkMessageAsReadVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<MarkMessageAsReadData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateMessageBlocked' Mutation. Allow users to execute without passing in DataConnect. */
export function updateMessageBlocked(dc: DataConnect, vars: UpdateMessageBlockedVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateMessageBlockedData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateMessageBlocked' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateMessageBlocked(vars: UpdateMessageBlockedVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateMessageBlockedData>>;

/** Generated Node Admin SDK operation action function for the 'CreateMessageAuditLog' Mutation. Allow users to execute without passing in DataConnect. */
export function createMessageAuditLog(dc: DataConnect, vars: CreateMessageAuditLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateMessageAuditLogData>>;
/** Generated Node Admin SDK operation action function for the 'CreateMessageAuditLog' Mutation. Allow users to pass in custom DataConnect instances. */
export function createMessageAuditLog(vars: CreateMessageAuditLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateMessageAuditLogData>>;

/** Generated Node Admin SDK operation action function for the 'CreatePhysicianDirectory' Mutation. Allow users to execute without passing in DataConnect. */
export function createPhysicianDirectory(dc: DataConnect, vars: CreatePhysicianDirectoryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreatePhysicianDirectoryData>>;
/** Generated Node Admin SDK operation action function for the 'CreatePhysicianDirectory' Mutation. Allow users to pass in custom DataConnect instances. */
export function createPhysicianDirectory(vars: CreatePhysicianDirectoryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreatePhysicianDirectoryData>>;

/** Generated Node Admin SDK operation action function for the 'CreateNpDirectory' Mutation. Allow users to execute without passing in DataConnect. */
export function createNpDirectory(dc: DataConnect, vars: CreateNpDirectoryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateNpDirectoryData>>;
/** Generated Node Admin SDK operation action function for the 'CreateNpDirectory' Mutation. Allow users to pass in custom DataConnect instances. */
export function createNpDirectory(vars: CreateNpDirectoryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateNpDirectoryData>>;

/** Generated Node Admin SDK operation action function for the 'UpdatePhysicianDirectoryProfile' Mutation. Allow users to execute without passing in DataConnect. */
export function updatePhysicianDirectoryProfile(dc: DataConnect, vars?: UpdatePhysicianDirectoryProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdatePhysicianDirectoryProfileData>>;
/** Generated Node Admin SDK operation action function for the 'UpdatePhysicianDirectoryProfile' Mutation. Allow users to pass in custom DataConnect instances. */
export function updatePhysicianDirectoryProfile(vars?: UpdatePhysicianDirectoryProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdatePhysicianDirectoryProfileData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateNpDirectoryProfile' Mutation. Allow users to execute without passing in DataConnect. */
export function updateNpDirectoryProfile(dc: DataConnect, vars?: UpdateNpDirectoryProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateNpDirectoryProfileData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateNpDirectoryProfile' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateNpDirectoryProfile(vars?: UpdateNpDirectoryProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateNpDirectoryProfileData>>;

/** Generated Node Admin SDK operation action function for the 'CreateDirectoryMatch' Mutation. Allow users to execute without passing in DataConnect. */
export function createDirectoryMatch(dc: DataConnect, vars: CreateDirectoryMatchVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateDirectoryMatchData>>;
/** Generated Node Admin SDK operation action function for the 'CreateDirectoryMatch' Mutation. Allow users to pass in custom DataConnect instances. */
export function createDirectoryMatch(vars: CreateDirectoryMatchVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateDirectoryMatchData>>;

/** Generated Node Admin SDK operation action function for the 'CreateDirectoryMatchByPhysician' Mutation. Allow users to execute without passing in DataConnect. */
export function createDirectoryMatchByPhysician(dc: DataConnect, vars: CreateDirectoryMatchByPhysicianVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateDirectoryMatchByPhysicianData>>;
/** Generated Node Admin SDK operation action function for the 'CreateDirectoryMatchByPhysician' Mutation. Allow users to pass in custom DataConnect instances. */
export function createDirectoryMatchByPhysician(vars: CreateDirectoryMatchByPhysicianVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateDirectoryMatchByPhysicianData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateMatchStatus' Mutation. Allow users to execute without passing in DataConnect. */
export function updateMatchStatus(dc: DataConnect, vars: UpdateMatchStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateMatchStatusData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateMatchStatus' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateMatchStatus(vars: UpdateMatchStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateMatchStatusData>>;

/** Generated Node Admin SDK operation action function for the 'CreateCollaborationAgreement' Mutation. Allow users to execute without passing in DataConnect. */
export function createCollaborationAgreement(dc: DataConnect, vars: CreateCollaborationAgreementVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateCollaborationAgreementData>>;
/** Generated Node Admin SDK operation action function for the 'CreateCollaborationAgreement' Mutation. Allow users to pass in custom DataConnect instances. */
export function createCollaborationAgreement(vars: CreateCollaborationAgreementVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateCollaborationAgreementData>>;

/** Generated Node Admin SDK operation action function for the 'SignAgreement' Mutation. Allow users to execute without passing in DataConnect. */
export function signAgreement(dc: DataConnect, vars: SignAgreementVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SignAgreementData>>;
/** Generated Node Admin SDK operation action function for the 'SignAgreement' Mutation. Allow users to pass in custom DataConnect instances. */
export function signAgreement(vars: SignAgreementVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SignAgreementData>>;

/** Generated Node Admin SDK operation action function for the 'ActivateAgreement' Mutation. Allow users to execute without passing in DataConnect. */
export function activateAgreement(dc: DataConnect, vars: ActivateAgreementVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ActivateAgreementData>>;
/** Generated Node Admin SDK operation action function for the 'ActivateAgreement' Mutation. Allow users to pass in custom DataConnect instances. */
export function activateAgreement(vars: ActivateAgreementVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ActivateAgreementData>>;

/** Generated Node Admin SDK operation action function for the 'TerminateAgreement' Mutation. Allow users to execute without passing in DataConnect. */
export function terminateAgreement(dc: DataConnect, vars: TerminateAgreementVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<TerminateAgreementData>>;
/** Generated Node Admin SDK operation action function for the 'TerminateAgreement' Mutation. Allow users to pass in custom DataConnect instances. */
export function terminateAgreement(vars: TerminateAgreementVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<TerminateAgreementData>>;

/** Generated Node Admin SDK operation action function for the 'UnlockConversationContactInfo' Mutation. Allow users to execute without passing in DataConnect. */
export function unlockConversationContactInfo(dc: DataConnect, vars: UnlockConversationContactInfoVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UnlockConversationContactInfoData>>;
/** Generated Node Admin SDK operation action function for the 'UnlockConversationContactInfo' Mutation. Allow users to pass in custom DataConnect instances. */
export function unlockConversationContactInfo(vars: UnlockConversationContactInfoVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UnlockConversationContactInfoData>>;

/** Generated Node Admin SDK operation action function for the 'SubmitChartReview' Mutation. Allow users to execute without passing in DataConnect. */
export function submitChartReview(dc: DataConnect, vars: SubmitChartReviewVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SubmitChartReviewData>>;
/** Generated Node Admin SDK operation action function for the 'SubmitChartReview' Mutation. Allow users to pass in custom DataConnect instances. */
export function submitChartReview(vars: SubmitChartReviewVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SubmitChartReviewData>>;

/** Generated Node Admin SDK operation action function for the 'ScheduleQaMeeting' Mutation. Allow users to execute without passing in DataConnect. */
export function scheduleQaMeeting(dc: DataConnect, vars: ScheduleQaMeetingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ScheduleQaMeetingData>>;
/** Generated Node Admin SDK operation action function for the 'ScheduleQaMeeting' Mutation. Allow users to pass in custom DataConnect instances. */
export function scheduleQaMeeting(vars: ScheduleQaMeetingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ScheduleQaMeetingData>>;

/** Generated Node Admin SDK operation action function for the 'CompleteQaMeeting' Mutation. Allow users to execute without passing in DataConnect. */
export function completeQaMeeting(dc: DataConnect, vars: CompleteQaMeetingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CompleteQaMeetingData>>;
/** Generated Node Admin SDK operation action function for the 'CompleteQaMeeting' Mutation. Allow users to pass in custom DataConnect instances. */
export function completeQaMeeting(vars: CompleteQaMeetingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CompleteQaMeetingData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateChartReviewDocument' Mutation. Allow users to execute without passing in DataConnect. */
export function updateChartReviewDocument(dc: DataConnect, vars: UpdateChartReviewDocumentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateChartReviewDocumentData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateChartReviewDocument' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateChartReviewDocument(vars: UpdateChartReviewDocumentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateChartReviewDocumentData>>;

/** Generated Node Admin SDK operation action function for the 'CreateMedia' Mutation. Allow users to execute without passing in DataConnect. */
export function createMedia(dc: DataConnect, vars: CreateMediaVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateMediaData>>;
/** Generated Node Admin SDK operation action function for the 'CreateMedia' Mutation. Allow users to pass in custom DataConnect instances. */
export function createMedia(vars: CreateMediaVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateMediaData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertStateCapacity' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertStateCapacity(dc: DataConnect, vars: UpsertStateCapacityVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertStateCapacityData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertStateCapacity' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertStateCapacity(vars: UpsertStateCapacityVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertStateCapacityData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteStateCapacity' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteStateCapacity(dc: DataConnect, vars: DeleteStateCapacityVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteStateCapacityData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteStateCapacity' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteStateCapacity(vars: DeleteStateCapacityVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteStateCapacityData>>;

/** Generated Node Admin SDK operation action function for the 'ListStates' Query. Allow users to execute without passing in DataConnect. */
export function listStates(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListStatesData>>;
/** Generated Node Admin SDK operation action function for the 'ListStates' Query. Allow users to pass in custom DataConnect instances. */
export function listStates(options?: OperationOptions): Promise<ExecuteOperationResponse<ListStatesData>>;

/** Generated Node Admin SDK operation action function for the 'GetStateByCode' Query. Allow users to execute without passing in DataConnect. */
export function getStateByCode(dc: DataConnect, vars: GetStateByCodeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetStateByCodeData>>;
/** Generated Node Admin SDK operation action function for the 'GetStateByCode' Query. Allow users to pass in custom DataConnect instances. */
export function getStateByCode(vars: GetStateByCodeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetStateByCodeData>>;

/** Generated Node Admin SDK operation action function for the 'GetStateById' Query. Allow users to execute without passing in DataConnect. */
export function getStateById(dc: DataConnect, vars: GetStateByIdVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetStateByIdData>>;
/** Generated Node Admin SDK operation action function for the 'GetStateById' Query. Allow users to pass in custom DataConnect instances. */
export function getStateById(vars: GetStateByIdVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetStateByIdData>>;

/** Generated Node Admin SDK operation action function for the 'GetMyProfile' Query. Allow users to execute without passing in DataConnect. */
export function getMyProfile(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyProfileData>>;
/** Generated Node Admin SDK operation action function for the 'GetMyProfile' Query. Allow users to pass in custom DataConnect instances. */
export function getMyProfile(options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyProfileData>>;

/** Generated Node Admin SDK operation action function for the 'GetMyLicenses' Query. Allow users to execute without passing in DataConnect. */
export function getMyLicenses(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyLicensesData>>;
/** Generated Node Admin SDK operation action function for the 'GetMyLicenses' Query. Allow users to pass in custom DataConnect instances. */
export function getMyLicenses(options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyLicensesData>>;

/** Generated Node Admin SDK operation action function for the 'GetLicenseWithFpaEligibility' Query. Allow users to execute without passing in DataConnect. */
export function getLicenseWithFpaEligibility(dc: DataConnect, vars: GetLicenseWithFpaEligibilityVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetLicenseWithFpaEligibilityData>>;
/** Generated Node Admin SDK operation action function for the 'GetLicenseWithFpaEligibility' Query. Allow users to pass in custom DataConnect instances. */
export function getLicenseWithFpaEligibility(vars: GetLicenseWithFpaEligibilityVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetLicenseWithFpaEligibilityData>>;

/** Generated Node Admin SDK operation action function for the 'GetMyConversations' Query. Allow users to execute without passing in DataConnect. */
export function getMyConversations(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyConversationsData>>;
/** Generated Node Admin SDK operation action function for the 'GetMyConversations' Query. Allow users to pass in custom DataConnect instances. */
export function getMyConversations(options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyConversationsData>>;

/** Generated Node Admin SDK operation action function for the 'GetConversationMessages' Query. Allow users to execute without passing in DataConnect. */
export function getConversationMessages(dc: DataConnect, vars: GetConversationMessagesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetConversationMessagesData>>;
/** Generated Node Admin SDK operation action function for the 'GetConversationMessages' Query. Allow users to pass in custom DataConnect instances. */
export function getConversationMessages(vars: GetConversationMessagesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetConversationMessagesData>>;

/** Generated Node Admin SDK operation action function for the 'GetConversationById' Query. Allow users to execute without passing in DataConnect. */
export function getConversationById(dc: DataConnect, vars: GetConversationByIdVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetConversationByIdData>>;
/** Generated Node Admin SDK operation action function for the 'GetConversationById' Query. Allow users to pass in custom DataConnect instances. */
export function getConversationById(vars: GetConversationByIdVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetConversationByIdData>>;

/** Generated Node Admin SDK operation action function for the 'CheckContactInfoUnlocked' Query. Allow users to execute without passing in DataConnect. */
export function checkContactInfoUnlocked(dc: DataConnect, vars: CheckContactInfoUnlockedVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CheckContactInfoUnlockedData>>;
/** Generated Node Admin SDK operation action function for the 'CheckContactInfoUnlocked' Query. Allow users to pass in custom DataConnect instances. */
export function checkContactInfoUnlocked(vars: CheckContactInfoUnlockedVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CheckContactInfoUnlockedData>>;

/** Generated Node Admin SDK operation action function for the 'SearchPhysicians' Query. Allow users to execute without passing in DataConnect. */
export function searchPhysicians(dc: DataConnect, vars?: SearchPhysiciansVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SearchPhysiciansData>>;
/** Generated Node Admin SDK operation action function for the 'SearchPhysicians' Query. Allow users to pass in custom DataConnect instances. */
export function searchPhysicians(vars?: SearchPhysiciansVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SearchPhysiciansData>>;

/** Generated Node Admin SDK operation action function for the 'SearchNPs' Query. Allow users to execute without passing in DataConnect. */
export function searchNPs(dc: DataConnect, vars?: SearchNPsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SearchNPsData>>;
/** Generated Node Admin SDK operation action function for the 'SearchNPs' Query. Allow users to pass in custom DataConnect instances. */
export function searchNPs(vars?: SearchNPsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SearchNPsData>>;

/** Generated Node Admin SDK operation action function for the 'GetProviderDirectoryProfile' Query. Allow users to execute without passing in DataConnect. */
export function getProviderDirectoryProfile(dc: DataConnect, vars: GetProviderDirectoryProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProviderDirectoryProfileData>>;
/** Generated Node Admin SDK operation action function for the 'GetProviderDirectoryProfile' Query. Allow users to pass in custom DataConnect instances. */
export function getProviderDirectoryProfile(vars: GetProviderDirectoryProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProviderDirectoryProfileData>>;

/** Generated Node Admin SDK operation action function for the 'GetMyDirectoryProfile' Query. Allow users to execute without passing in DataConnect. */
export function getMyDirectoryProfile(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyDirectoryProfileData>>;
/** Generated Node Admin SDK operation action function for the 'GetMyDirectoryProfile' Query. Allow users to pass in custom DataConnect instances. */
export function getMyDirectoryProfile(options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyDirectoryProfileData>>;

/** Generated Node Admin SDK operation action function for the 'GetDirectoryMatches' Query. Allow users to execute without passing in DataConnect. */
export function getDirectoryMatches(dc: DataConnect, vars: GetDirectoryMatchesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetDirectoryMatchesData>>;
/** Generated Node Admin SDK operation action function for the 'GetDirectoryMatches' Query. Allow users to pass in custom DataConnect instances. */
export function getDirectoryMatches(vars: GetDirectoryMatchesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetDirectoryMatchesData>>;

/** Generated Node Admin SDK operation action function for the 'GetMyAgreements' Query. Allow users to execute without passing in DataConnect. */
export function getMyAgreements(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyAgreementsData>>;
/** Generated Node Admin SDK operation action function for the 'GetMyAgreements' Query. Allow users to pass in custom DataConnect instances. */
export function getMyAgreements(options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyAgreementsData>>;

/** Generated Node Admin SDK operation action function for the 'GetAgreementById' Query. Allow users to execute without passing in DataConnect. */
export function getAgreementById(dc: DataConnect, vars: GetAgreementByIdVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetAgreementByIdData>>;
/** Generated Node Admin SDK operation action function for the 'GetAgreementById' Query. Allow users to pass in custom DataConnect instances. */
export function getAgreementById(vars: GetAgreementByIdVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetAgreementByIdData>>;

/** Generated Node Admin SDK operation action function for the 'GetAgreementSignatures' Query. Allow users to execute without passing in DataConnect. */
export function getAgreementSignatures(dc: DataConnect, vars: GetAgreementSignaturesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetAgreementSignaturesData>>;
/** Generated Node Admin SDK operation action function for the 'GetAgreementSignatures' Query. Allow users to pass in custom DataConnect instances. */
export function getAgreementSignatures(vars: GetAgreementSignaturesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetAgreementSignaturesData>>;

/** Generated Node Admin SDK operation action function for the 'CheckBothPartiesSigned' Query. Allow users to execute without passing in DataConnect. */
export function checkBothPartiesSigned(dc: DataConnect, vars: CheckBothPartiesSignedVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CheckBothPartiesSignedData>>;
/** Generated Node Admin SDK operation action function for the 'CheckBothPartiesSigned' Query. Allow users to pass in custom DataConnect instances. */
export function checkBothPartiesSigned(vars: CheckBothPartiesSignedVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CheckBothPartiesSignedData>>;

/** Generated Node Admin SDK operation action function for the 'GetChartReviews' Query. Allow users to execute without passing in DataConnect. */
export function getChartReviews(dc: DataConnect, vars: GetChartReviewsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetChartReviewsData>>;
/** Generated Node Admin SDK operation action function for the 'GetChartReviews' Query. Allow users to pass in custom DataConnect instances. */
export function getChartReviews(vars: GetChartReviewsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetChartReviewsData>>;

/** Generated Node Admin SDK operation action function for the 'GetQaMeetings' Query. Allow users to execute without passing in DataConnect. */
export function getQaMeetings(dc: DataConnect, vars: GetQaMeetingsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetQaMeetingsData>>;
/** Generated Node Admin SDK operation action function for the 'GetQaMeetings' Query. Allow users to pass in custom DataConnect instances. */
export function getQaMeetings(vars: GetQaMeetingsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetQaMeetingsData>>;

/** Generated Node Admin SDK operation action function for the 'GetComplianceStatus' Query. Allow users to execute without passing in DataConnect. */
export function getComplianceStatus(dc: DataConnect, vars: GetComplianceStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetComplianceStatusData>>;
/** Generated Node Admin SDK operation action function for the 'GetComplianceStatus' Query. Allow users to pass in custom DataConnect instances. */
export function getComplianceStatus(vars: GetComplianceStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetComplianceStatusData>>;

/** Generated Node Admin SDK operation action function for the 'GetUpcomingQaMeetings' Query. Allow users to execute without passing in DataConnect. */
export function getUpcomingQaMeetings(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUpcomingQaMeetingsData>>;
/** Generated Node Admin SDK operation action function for the 'GetUpcomingQaMeetings' Query. Allow users to pass in custom DataConnect instances. */
export function getUpcomingQaMeetings(options?: OperationOptions): Promise<ExecuteOperationResponse<GetUpcomingQaMeetingsData>>;

/** Generated Node Admin SDK operation action function for the 'GetActiveCpaCount' Query. Allow users to execute without passing in DataConnect. */
export function getActiveCpaCount(dc: DataConnect, vars: GetActiveCpaCountVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetActiveCpaCountData>>;
/** Generated Node Admin SDK operation action function for the 'GetActiveCpaCount' Query. Allow users to pass in custom DataConnect instances. */
export function getActiveCpaCount(vars: GetActiveCpaCountVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetActiveCpaCountData>>;

/** Generated Node Admin SDK operation action function for the 'GetStateRatio' Query. Allow users to execute without passing in DataConnect. */
export function getStateRatio(dc: DataConnect, vars: GetStateRatioVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetStateRatioData>>;
/** Generated Node Admin SDK operation action function for the 'GetStateRatio' Query. Allow users to pass in custom DataConnect instances. */
export function getStateRatio(vars: GetStateRatioVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetStateRatioData>>;

/** Generated Node Admin SDK operation action function for the 'GetMyStateCapacities' Query. Allow users to execute without passing in DataConnect. */
export function getMyStateCapacities(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyStateCapacitiesData>>;
/** Generated Node Admin SDK operation action function for the 'GetMyStateCapacities' Query. Allow users to pass in custom DataConnect instances. */
export function getMyStateCapacities(options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyStateCapacitiesData>>;

/** Generated Node Admin SDK operation action function for the 'GetPhysicianStateCapacities' Query. Allow users to execute without passing in DataConnect. */
export function getPhysicianStateCapacities(dc: DataConnect, vars: GetPhysicianStateCapacitiesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPhysicianStateCapacitiesData>>;
/** Generated Node Admin SDK operation action function for the 'GetPhysicianStateCapacities' Query. Allow users to pass in custom DataConnect instances. */
export function getPhysicianStateCapacities(vars: GetPhysicianStateCapacitiesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPhysicianStateCapacitiesData>>;

/** Generated Node Admin SDK operation action function for the 'SearchPhysiciansWithStateCapacity' Query. Allow users to execute without passing in DataConnect. */
export function searchPhysiciansWithStateCapacity(dc: DataConnect, vars?: SearchPhysiciansWithStateCapacityVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SearchPhysiciansWithStateCapacityData>>;
/** Generated Node Admin SDK operation action function for the 'SearchPhysiciansWithStateCapacity' Query. Allow users to pass in custom DataConnect instances. */
export function searchPhysiciansWithStateCapacity(vars?: SearchPhysiciansWithStateCapacityVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SearchPhysiciansWithStateCapacityData>>;

/** Generated Node Admin SDK operation action function for the 'SeedStates' Mutation. Allow users to execute without passing in DataConnect. */
export function seedStates(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<SeedStatesData>>;
/** Generated Node Admin SDK operation action function for the 'SeedStates' Mutation. Allow users to pass in custom DataConnect instances. */
export function seedStates(options?: OperationOptions): Promise<ExecuteOperationResponse<SeedStatesData>>;

