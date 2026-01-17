import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

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

interface UpsertUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
  operationName: string;
}
export const upsertUserProfileRef: UpsertUserProfileRef;

export function upsertUserProfile(vars?: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;
export function upsertUserProfile(dc: DataConnect, vars?: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

interface CreateLicenseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLicenseVariables): MutationRef<CreateLicenseData, CreateLicenseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateLicenseVariables): MutationRef<CreateLicenseData, CreateLicenseVariables>;
  operationName: string;
}
export const createLicenseRef: CreateLicenseRef;

export function createLicense(vars: CreateLicenseVariables): MutationPromise<CreateLicenseData, CreateLicenseVariables>;
export function createLicense(dc: DataConnect, vars: CreateLicenseVariables): MutationPromise<CreateLicenseData, CreateLicenseVariables>;

interface UpdateLicenseVerificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLicenseVerificationVariables): MutationRef<UpdateLicenseVerificationData, UpdateLicenseVerificationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateLicenseVerificationVariables): MutationRef<UpdateLicenseVerificationData, UpdateLicenseVerificationVariables>;
  operationName: string;
}
export const updateLicenseVerificationRef: UpdateLicenseVerificationRef;

export function updateLicenseVerification(vars: UpdateLicenseVerificationVariables): MutationPromise<UpdateLicenseVerificationData, UpdateLicenseVerificationVariables>;
export function updateLicenseVerification(dc: DataConnect, vars: UpdateLicenseVerificationVariables): MutationPromise<UpdateLicenseVerificationData, UpdateLicenseVerificationVariables>;

interface UpdateLicenseFpaStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLicenseFpaStatusVariables): MutationRef<UpdateLicenseFpaStatusData, UpdateLicenseFpaStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateLicenseFpaStatusVariables): MutationRef<UpdateLicenseFpaStatusData, UpdateLicenseFpaStatusVariables>;
  operationName: string;
}
export const updateLicenseFpaStatusRef: UpdateLicenseFpaStatusRef;

export function updateLicenseFpaStatus(vars: UpdateLicenseFpaStatusVariables): MutationPromise<UpdateLicenseFpaStatusData, UpdateLicenseFpaStatusVariables>;
export function updateLicenseFpaStatus(dc: DataConnect, vars: UpdateLicenseFpaStatusVariables): MutationPromise<UpdateLicenseFpaStatusData, UpdateLicenseFpaStatusVariables>;

interface CreateConversationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateConversationVariables): MutationRef<CreateConversationData, CreateConversationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateConversationVariables): MutationRef<CreateConversationData, CreateConversationVariables>;
  operationName: string;
}
export const createConversationRef: CreateConversationRef;

export function createConversation(vars: CreateConversationVariables): MutationPromise<CreateConversationData, CreateConversationVariables>;
export function createConversation(dc: DataConnect, vars: CreateConversationVariables): MutationPromise<CreateConversationData, CreateConversationVariables>;

interface SendMessageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SendMessageVariables): MutationRef<SendMessageData, SendMessageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SendMessageVariables): MutationRef<SendMessageData, SendMessageVariables>;
  operationName: string;
}
export const sendMessageRef: SendMessageRef;

export function sendMessage(vars: SendMessageVariables): MutationPromise<SendMessageData, SendMessageVariables>;
export function sendMessage(dc: DataConnect, vars: SendMessageVariables): MutationPromise<SendMessageData, SendMessageVariables>;

interface MarkMessageAsReadRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkMessageAsReadVariables): MutationRef<MarkMessageAsReadData, MarkMessageAsReadVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkMessageAsReadVariables): MutationRef<MarkMessageAsReadData, MarkMessageAsReadVariables>;
  operationName: string;
}
export const markMessageAsReadRef: MarkMessageAsReadRef;

export function markMessageAsRead(vars: MarkMessageAsReadVariables): MutationPromise<MarkMessageAsReadData, MarkMessageAsReadVariables>;
export function markMessageAsRead(dc: DataConnect, vars: MarkMessageAsReadVariables): MutationPromise<MarkMessageAsReadData, MarkMessageAsReadVariables>;

interface UpdateMessageBlockedRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMessageBlockedVariables): MutationRef<UpdateMessageBlockedData, UpdateMessageBlockedVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateMessageBlockedVariables): MutationRef<UpdateMessageBlockedData, UpdateMessageBlockedVariables>;
  operationName: string;
}
export const updateMessageBlockedRef: UpdateMessageBlockedRef;

export function updateMessageBlocked(vars: UpdateMessageBlockedVariables): MutationPromise<UpdateMessageBlockedData, UpdateMessageBlockedVariables>;
export function updateMessageBlocked(dc: DataConnect, vars: UpdateMessageBlockedVariables): MutationPromise<UpdateMessageBlockedData, UpdateMessageBlockedVariables>;

interface CreateMessageAuditLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMessageAuditLogVariables): MutationRef<CreateMessageAuditLogData, CreateMessageAuditLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateMessageAuditLogVariables): MutationRef<CreateMessageAuditLogData, CreateMessageAuditLogVariables>;
  operationName: string;
}
export const createMessageAuditLogRef: CreateMessageAuditLogRef;

export function createMessageAuditLog(vars: CreateMessageAuditLogVariables): MutationPromise<CreateMessageAuditLogData, CreateMessageAuditLogVariables>;
export function createMessageAuditLog(dc: DataConnect, vars: CreateMessageAuditLogVariables): MutationPromise<CreateMessageAuditLogData, CreateMessageAuditLogVariables>;

interface CreatePhysicianDirectoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePhysicianDirectoryVariables): MutationRef<CreatePhysicianDirectoryData, CreatePhysicianDirectoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePhysicianDirectoryVariables): MutationRef<CreatePhysicianDirectoryData, CreatePhysicianDirectoryVariables>;
  operationName: string;
}
export const createPhysicianDirectoryRef: CreatePhysicianDirectoryRef;

export function createPhysicianDirectory(vars: CreatePhysicianDirectoryVariables): MutationPromise<CreatePhysicianDirectoryData, CreatePhysicianDirectoryVariables>;
export function createPhysicianDirectory(dc: DataConnect, vars: CreatePhysicianDirectoryVariables): MutationPromise<CreatePhysicianDirectoryData, CreatePhysicianDirectoryVariables>;

interface CreateNpDirectoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNpDirectoryVariables): MutationRef<CreateNpDirectoryData, CreateNpDirectoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNpDirectoryVariables): MutationRef<CreateNpDirectoryData, CreateNpDirectoryVariables>;
  operationName: string;
}
export const createNpDirectoryRef: CreateNpDirectoryRef;

export function createNpDirectory(vars: CreateNpDirectoryVariables): MutationPromise<CreateNpDirectoryData, CreateNpDirectoryVariables>;
export function createNpDirectory(dc: DataConnect, vars: CreateNpDirectoryVariables): MutationPromise<CreateNpDirectoryData, CreateNpDirectoryVariables>;

interface UpdatePhysicianDirectoryProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdatePhysicianDirectoryProfileVariables): MutationRef<UpdatePhysicianDirectoryProfileData, UpdatePhysicianDirectoryProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdatePhysicianDirectoryProfileVariables): MutationRef<UpdatePhysicianDirectoryProfileData, UpdatePhysicianDirectoryProfileVariables>;
  operationName: string;
}
export const updatePhysicianDirectoryProfileRef: UpdatePhysicianDirectoryProfileRef;

export function updatePhysicianDirectoryProfile(vars?: UpdatePhysicianDirectoryProfileVariables): MutationPromise<UpdatePhysicianDirectoryProfileData, UpdatePhysicianDirectoryProfileVariables>;
export function updatePhysicianDirectoryProfile(dc: DataConnect, vars?: UpdatePhysicianDirectoryProfileVariables): MutationPromise<UpdatePhysicianDirectoryProfileData, UpdatePhysicianDirectoryProfileVariables>;

interface UpdateNpDirectoryProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateNpDirectoryProfileVariables): MutationRef<UpdateNpDirectoryProfileData, UpdateNpDirectoryProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdateNpDirectoryProfileVariables): MutationRef<UpdateNpDirectoryProfileData, UpdateNpDirectoryProfileVariables>;
  operationName: string;
}
export const updateNpDirectoryProfileRef: UpdateNpDirectoryProfileRef;

export function updateNpDirectoryProfile(vars?: UpdateNpDirectoryProfileVariables): MutationPromise<UpdateNpDirectoryProfileData, UpdateNpDirectoryProfileVariables>;
export function updateNpDirectoryProfile(dc: DataConnect, vars?: UpdateNpDirectoryProfileVariables): MutationPromise<UpdateNpDirectoryProfileData, UpdateNpDirectoryProfileVariables>;

interface CreateDirectoryMatchRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDirectoryMatchVariables): MutationRef<CreateDirectoryMatchData, CreateDirectoryMatchVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateDirectoryMatchVariables): MutationRef<CreateDirectoryMatchData, CreateDirectoryMatchVariables>;
  operationName: string;
}
export const createDirectoryMatchRef: CreateDirectoryMatchRef;

export function createDirectoryMatch(vars: CreateDirectoryMatchVariables): MutationPromise<CreateDirectoryMatchData, CreateDirectoryMatchVariables>;
export function createDirectoryMatch(dc: DataConnect, vars: CreateDirectoryMatchVariables): MutationPromise<CreateDirectoryMatchData, CreateDirectoryMatchVariables>;

interface CreateDirectoryMatchByPhysicianRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDirectoryMatchByPhysicianVariables): MutationRef<CreateDirectoryMatchByPhysicianData, CreateDirectoryMatchByPhysicianVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateDirectoryMatchByPhysicianVariables): MutationRef<CreateDirectoryMatchByPhysicianData, CreateDirectoryMatchByPhysicianVariables>;
  operationName: string;
}
export const createDirectoryMatchByPhysicianRef: CreateDirectoryMatchByPhysicianRef;

export function createDirectoryMatchByPhysician(vars: CreateDirectoryMatchByPhysicianVariables): MutationPromise<CreateDirectoryMatchByPhysicianData, CreateDirectoryMatchByPhysicianVariables>;
export function createDirectoryMatchByPhysician(dc: DataConnect, vars: CreateDirectoryMatchByPhysicianVariables): MutationPromise<CreateDirectoryMatchByPhysicianData, CreateDirectoryMatchByPhysicianVariables>;

interface UpdateMatchStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMatchStatusVariables): MutationRef<UpdateMatchStatusData, UpdateMatchStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateMatchStatusVariables): MutationRef<UpdateMatchStatusData, UpdateMatchStatusVariables>;
  operationName: string;
}
export const updateMatchStatusRef: UpdateMatchStatusRef;

export function updateMatchStatus(vars: UpdateMatchStatusVariables): MutationPromise<UpdateMatchStatusData, UpdateMatchStatusVariables>;
export function updateMatchStatus(dc: DataConnect, vars: UpdateMatchStatusVariables): MutationPromise<UpdateMatchStatusData, UpdateMatchStatusVariables>;

interface CreateCollaborationAgreementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCollaborationAgreementVariables): MutationRef<CreateCollaborationAgreementData, CreateCollaborationAgreementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCollaborationAgreementVariables): MutationRef<CreateCollaborationAgreementData, CreateCollaborationAgreementVariables>;
  operationName: string;
}
export const createCollaborationAgreementRef: CreateCollaborationAgreementRef;

export function createCollaborationAgreement(vars: CreateCollaborationAgreementVariables): MutationPromise<CreateCollaborationAgreementData, CreateCollaborationAgreementVariables>;
export function createCollaborationAgreement(dc: DataConnect, vars: CreateCollaborationAgreementVariables): MutationPromise<CreateCollaborationAgreementData, CreateCollaborationAgreementVariables>;

interface SignAgreementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SignAgreementVariables): MutationRef<SignAgreementData, SignAgreementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SignAgreementVariables): MutationRef<SignAgreementData, SignAgreementVariables>;
  operationName: string;
}
export const signAgreementRef: SignAgreementRef;

export function signAgreement(vars: SignAgreementVariables): MutationPromise<SignAgreementData, SignAgreementVariables>;
export function signAgreement(dc: DataConnect, vars: SignAgreementVariables): MutationPromise<SignAgreementData, SignAgreementVariables>;

interface ActivateAgreementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ActivateAgreementVariables): MutationRef<ActivateAgreementData, ActivateAgreementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ActivateAgreementVariables): MutationRef<ActivateAgreementData, ActivateAgreementVariables>;
  operationName: string;
}
export const activateAgreementRef: ActivateAgreementRef;

export function activateAgreement(vars: ActivateAgreementVariables): MutationPromise<ActivateAgreementData, ActivateAgreementVariables>;
export function activateAgreement(dc: DataConnect, vars: ActivateAgreementVariables): MutationPromise<ActivateAgreementData, ActivateAgreementVariables>;

interface TerminateAgreementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: TerminateAgreementVariables): MutationRef<TerminateAgreementData, TerminateAgreementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: TerminateAgreementVariables): MutationRef<TerminateAgreementData, TerminateAgreementVariables>;
  operationName: string;
}
export const terminateAgreementRef: TerminateAgreementRef;

export function terminateAgreement(vars: TerminateAgreementVariables): MutationPromise<TerminateAgreementData, TerminateAgreementVariables>;
export function terminateAgreement(dc: DataConnect, vars: TerminateAgreementVariables): MutationPromise<TerminateAgreementData, TerminateAgreementVariables>;

interface UnlockConversationContactInfoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UnlockConversationContactInfoVariables): MutationRef<UnlockConversationContactInfoData, UnlockConversationContactInfoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UnlockConversationContactInfoVariables): MutationRef<UnlockConversationContactInfoData, UnlockConversationContactInfoVariables>;
  operationName: string;
}
export const unlockConversationContactInfoRef: UnlockConversationContactInfoRef;

export function unlockConversationContactInfo(vars: UnlockConversationContactInfoVariables): MutationPromise<UnlockConversationContactInfoData, UnlockConversationContactInfoVariables>;
export function unlockConversationContactInfo(dc: DataConnect, vars: UnlockConversationContactInfoVariables): MutationPromise<UnlockConversationContactInfoData, UnlockConversationContactInfoVariables>;

interface SubmitChartReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SubmitChartReviewVariables): MutationRef<SubmitChartReviewData, SubmitChartReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SubmitChartReviewVariables): MutationRef<SubmitChartReviewData, SubmitChartReviewVariables>;
  operationName: string;
}
export const submitChartReviewRef: SubmitChartReviewRef;

export function submitChartReview(vars: SubmitChartReviewVariables): MutationPromise<SubmitChartReviewData, SubmitChartReviewVariables>;
export function submitChartReview(dc: DataConnect, vars: SubmitChartReviewVariables): MutationPromise<SubmitChartReviewData, SubmitChartReviewVariables>;

interface ScheduleQaMeetingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ScheduleQaMeetingVariables): MutationRef<ScheduleQaMeetingData, ScheduleQaMeetingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ScheduleQaMeetingVariables): MutationRef<ScheduleQaMeetingData, ScheduleQaMeetingVariables>;
  operationName: string;
}
export const scheduleQaMeetingRef: ScheduleQaMeetingRef;

export function scheduleQaMeeting(vars: ScheduleQaMeetingVariables): MutationPromise<ScheduleQaMeetingData, ScheduleQaMeetingVariables>;
export function scheduleQaMeeting(dc: DataConnect, vars: ScheduleQaMeetingVariables): MutationPromise<ScheduleQaMeetingData, ScheduleQaMeetingVariables>;

interface CompleteQaMeetingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CompleteQaMeetingVariables): MutationRef<CompleteQaMeetingData, CompleteQaMeetingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CompleteQaMeetingVariables): MutationRef<CompleteQaMeetingData, CompleteQaMeetingVariables>;
  operationName: string;
}
export const completeQaMeetingRef: CompleteQaMeetingRef;

export function completeQaMeeting(vars: CompleteQaMeetingVariables): MutationPromise<CompleteQaMeetingData, CompleteQaMeetingVariables>;
export function completeQaMeeting(dc: DataConnect, vars: CompleteQaMeetingVariables): MutationPromise<CompleteQaMeetingData, CompleteQaMeetingVariables>;

interface UpdateChartReviewDocumentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateChartReviewDocumentVariables): MutationRef<UpdateChartReviewDocumentData, UpdateChartReviewDocumentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateChartReviewDocumentVariables): MutationRef<UpdateChartReviewDocumentData, UpdateChartReviewDocumentVariables>;
  operationName: string;
}
export const updateChartReviewDocumentRef: UpdateChartReviewDocumentRef;

export function updateChartReviewDocument(vars: UpdateChartReviewDocumentVariables): MutationPromise<UpdateChartReviewDocumentData, UpdateChartReviewDocumentVariables>;
export function updateChartReviewDocument(dc: DataConnect, vars: UpdateChartReviewDocumentVariables): MutationPromise<UpdateChartReviewDocumentData, UpdateChartReviewDocumentVariables>;

interface CreateMediaRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMediaVariables): MutationRef<CreateMediaData, CreateMediaVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateMediaVariables): MutationRef<CreateMediaData, CreateMediaVariables>;
  operationName: string;
}
export const createMediaRef: CreateMediaRef;

export function createMedia(vars: CreateMediaVariables): MutationPromise<CreateMediaData, CreateMediaVariables>;
export function createMedia(dc: DataConnect, vars: CreateMediaVariables): MutationPromise<CreateMediaData, CreateMediaVariables>;

interface UpsertStateCapacityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertStateCapacityVariables): MutationRef<UpsertStateCapacityData, UpsertStateCapacityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertStateCapacityVariables): MutationRef<UpsertStateCapacityData, UpsertStateCapacityVariables>;
  operationName: string;
}
export const upsertStateCapacityRef: UpsertStateCapacityRef;

export function upsertStateCapacity(vars: UpsertStateCapacityVariables): MutationPromise<UpsertStateCapacityData, UpsertStateCapacityVariables>;
export function upsertStateCapacity(dc: DataConnect, vars: UpsertStateCapacityVariables): MutationPromise<UpsertStateCapacityData, UpsertStateCapacityVariables>;

interface DeleteStateCapacityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteStateCapacityVariables): MutationRef<DeleteStateCapacityData, DeleteStateCapacityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteStateCapacityVariables): MutationRef<DeleteStateCapacityData, DeleteStateCapacityVariables>;
  operationName: string;
}
export const deleteStateCapacityRef: DeleteStateCapacityRef;

export function deleteStateCapacity(vars: DeleteStateCapacityVariables): MutationPromise<DeleteStateCapacityData, DeleteStateCapacityVariables>;
export function deleteStateCapacity(dc: DataConnect, vars: DeleteStateCapacityVariables): MutationPromise<DeleteStateCapacityData, DeleteStateCapacityVariables>;

interface ListStatesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListStatesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListStatesData, undefined>;
  operationName: string;
}
export const listStatesRef: ListStatesRef;

export function listStates(): QueryPromise<ListStatesData, undefined>;
export function listStates(dc: DataConnect): QueryPromise<ListStatesData, undefined>;

interface GetStateByCodeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStateByCodeVariables): QueryRef<GetStateByCodeData, GetStateByCodeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStateByCodeVariables): QueryRef<GetStateByCodeData, GetStateByCodeVariables>;
  operationName: string;
}
export const getStateByCodeRef: GetStateByCodeRef;

export function getStateByCode(vars: GetStateByCodeVariables): QueryPromise<GetStateByCodeData, GetStateByCodeVariables>;
export function getStateByCode(dc: DataConnect, vars: GetStateByCodeVariables): QueryPromise<GetStateByCodeData, GetStateByCodeVariables>;

interface GetStateByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStateByIdVariables): QueryRef<GetStateByIdData, GetStateByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStateByIdVariables): QueryRef<GetStateByIdData, GetStateByIdVariables>;
  operationName: string;
}
export const getStateByIdRef: GetStateByIdRef;

export function getStateById(vars: GetStateByIdVariables): QueryPromise<GetStateByIdData, GetStateByIdVariables>;
export function getStateById(dc: DataConnect, vars: GetStateByIdVariables): QueryPromise<GetStateByIdData, GetStateByIdVariables>;

interface GetMyProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
  operationName: string;
}
export const getMyProfileRef: GetMyProfileRef;

export function getMyProfile(): QueryPromise<GetMyProfileData, undefined>;
export function getMyProfile(dc: DataConnect): QueryPromise<GetMyProfileData, undefined>;

interface GetMyLicensesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyLicensesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyLicensesData, undefined>;
  operationName: string;
}
export const getMyLicensesRef: GetMyLicensesRef;

export function getMyLicenses(): QueryPromise<GetMyLicensesData, undefined>;
export function getMyLicenses(dc: DataConnect): QueryPromise<GetMyLicensesData, undefined>;

interface GetLicenseWithFpaEligibilityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLicenseWithFpaEligibilityVariables): QueryRef<GetLicenseWithFpaEligibilityData, GetLicenseWithFpaEligibilityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLicenseWithFpaEligibilityVariables): QueryRef<GetLicenseWithFpaEligibilityData, GetLicenseWithFpaEligibilityVariables>;
  operationName: string;
}
export const getLicenseWithFpaEligibilityRef: GetLicenseWithFpaEligibilityRef;

export function getLicenseWithFpaEligibility(vars: GetLicenseWithFpaEligibilityVariables): QueryPromise<GetLicenseWithFpaEligibilityData, GetLicenseWithFpaEligibilityVariables>;
export function getLicenseWithFpaEligibility(dc: DataConnect, vars: GetLicenseWithFpaEligibilityVariables): QueryPromise<GetLicenseWithFpaEligibilityData, GetLicenseWithFpaEligibilityVariables>;

interface GetMyConversationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyConversationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyConversationsData, undefined>;
  operationName: string;
}
export const getMyConversationsRef: GetMyConversationsRef;

export function getMyConversations(): QueryPromise<GetMyConversationsData, undefined>;
export function getMyConversations(dc: DataConnect): QueryPromise<GetMyConversationsData, undefined>;

interface GetConversationMessagesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetConversationMessagesVariables): QueryRef<GetConversationMessagesData, GetConversationMessagesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetConversationMessagesVariables): QueryRef<GetConversationMessagesData, GetConversationMessagesVariables>;
  operationName: string;
}
export const getConversationMessagesRef: GetConversationMessagesRef;

export function getConversationMessages(vars: GetConversationMessagesVariables): QueryPromise<GetConversationMessagesData, GetConversationMessagesVariables>;
export function getConversationMessages(dc: DataConnect, vars: GetConversationMessagesVariables): QueryPromise<GetConversationMessagesData, GetConversationMessagesVariables>;

interface GetConversationByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetConversationByIdVariables): QueryRef<GetConversationByIdData, GetConversationByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetConversationByIdVariables): QueryRef<GetConversationByIdData, GetConversationByIdVariables>;
  operationName: string;
}
export const getConversationByIdRef: GetConversationByIdRef;

export function getConversationById(vars: GetConversationByIdVariables): QueryPromise<GetConversationByIdData, GetConversationByIdVariables>;
export function getConversationById(dc: DataConnect, vars: GetConversationByIdVariables): QueryPromise<GetConversationByIdData, GetConversationByIdVariables>;

interface CheckContactInfoUnlockedRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CheckContactInfoUnlockedVariables): QueryRef<CheckContactInfoUnlockedData, CheckContactInfoUnlockedVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CheckContactInfoUnlockedVariables): QueryRef<CheckContactInfoUnlockedData, CheckContactInfoUnlockedVariables>;
  operationName: string;
}
export const checkContactInfoUnlockedRef: CheckContactInfoUnlockedRef;

export function checkContactInfoUnlocked(vars: CheckContactInfoUnlockedVariables): QueryPromise<CheckContactInfoUnlockedData, CheckContactInfoUnlockedVariables>;
export function checkContactInfoUnlocked(dc: DataConnect, vars: CheckContactInfoUnlockedVariables): QueryPromise<CheckContactInfoUnlockedData, CheckContactInfoUnlockedVariables>;

interface SearchPhysiciansRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: SearchPhysiciansVariables): QueryRef<SearchPhysiciansData, SearchPhysiciansVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: SearchPhysiciansVariables): QueryRef<SearchPhysiciansData, SearchPhysiciansVariables>;
  operationName: string;
}
export const searchPhysiciansRef: SearchPhysiciansRef;

export function searchPhysicians(vars?: SearchPhysiciansVariables): QueryPromise<SearchPhysiciansData, SearchPhysiciansVariables>;
export function searchPhysicians(dc: DataConnect, vars?: SearchPhysiciansVariables): QueryPromise<SearchPhysiciansData, SearchPhysiciansVariables>;

interface SearchNPsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: SearchNPsVariables): QueryRef<SearchNPsData, SearchNPsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: SearchNPsVariables): QueryRef<SearchNPsData, SearchNPsVariables>;
  operationName: string;
}
export const searchNPsRef: SearchNPsRef;

export function searchNPs(vars?: SearchNPsVariables): QueryPromise<SearchNPsData, SearchNPsVariables>;
export function searchNPs(dc: DataConnect, vars?: SearchNPsVariables): QueryPromise<SearchNPsData, SearchNPsVariables>;

interface GetProviderDirectoryProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProviderDirectoryProfileVariables): QueryRef<GetProviderDirectoryProfileData, GetProviderDirectoryProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProviderDirectoryProfileVariables): QueryRef<GetProviderDirectoryProfileData, GetProviderDirectoryProfileVariables>;
  operationName: string;
}
export const getProviderDirectoryProfileRef: GetProviderDirectoryProfileRef;

export function getProviderDirectoryProfile(vars: GetProviderDirectoryProfileVariables): QueryPromise<GetProviderDirectoryProfileData, GetProviderDirectoryProfileVariables>;
export function getProviderDirectoryProfile(dc: DataConnect, vars: GetProviderDirectoryProfileVariables): QueryPromise<GetProviderDirectoryProfileData, GetProviderDirectoryProfileVariables>;

interface GetMyDirectoryProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyDirectoryProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyDirectoryProfileData, undefined>;
  operationName: string;
}
export const getMyDirectoryProfileRef: GetMyDirectoryProfileRef;

export function getMyDirectoryProfile(): QueryPromise<GetMyDirectoryProfileData, undefined>;
export function getMyDirectoryProfile(dc: DataConnect): QueryPromise<GetMyDirectoryProfileData, undefined>;

interface GetDirectoryMatchesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDirectoryMatchesVariables): QueryRef<GetDirectoryMatchesData, GetDirectoryMatchesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetDirectoryMatchesVariables): QueryRef<GetDirectoryMatchesData, GetDirectoryMatchesVariables>;
  operationName: string;
}
export const getDirectoryMatchesRef: GetDirectoryMatchesRef;

export function getDirectoryMatches(vars: GetDirectoryMatchesVariables): QueryPromise<GetDirectoryMatchesData, GetDirectoryMatchesVariables>;
export function getDirectoryMatches(dc: DataConnect, vars: GetDirectoryMatchesVariables): QueryPromise<GetDirectoryMatchesData, GetDirectoryMatchesVariables>;

interface GetMyAgreementsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyAgreementsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyAgreementsData, undefined>;
  operationName: string;
}
export const getMyAgreementsRef: GetMyAgreementsRef;

export function getMyAgreements(): QueryPromise<GetMyAgreementsData, undefined>;
export function getMyAgreements(dc: DataConnect): QueryPromise<GetMyAgreementsData, undefined>;

interface GetAgreementByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAgreementByIdVariables): QueryRef<GetAgreementByIdData, GetAgreementByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAgreementByIdVariables): QueryRef<GetAgreementByIdData, GetAgreementByIdVariables>;
  operationName: string;
}
export const getAgreementByIdRef: GetAgreementByIdRef;

export function getAgreementById(vars: GetAgreementByIdVariables): QueryPromise<GetAgreementByIdData, GetAgreementByIdVariables>;
export function getAgreementById(dc: DataConnect, vars: GetAgreementByIdVariables): QueryPromise<GetAgreementByIdData, GetAgreementByIdVariables>;

interface GetAgreementSignaturesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAgreementSignaturesVariables): QueryRef<GetAgreementSignaturesData, GetAgreementSignaturesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAgreementSignaturesVariables): QueryRef<GetAgreementSignaturesData, GetAgreementSignaturesVariables>;
  operationName: string;
}
export const getAgreementSignaturesRef: GetAgreementSignaturesRef;

export function getAgreementSignatures(vars: GetAgreementSignaturesVariables): QueryPromise<GetAgreementSignaturesData, GetAgreementSignaturesVariables>;
export function getAgreementSignatures(dc: DataConnect, vars: GetAgreementSignaturesVariables): QueryPromise<GetAgreementSignaturesData, GetAgreementSignaturesVariables>;

interface CheckBothPartiesSignedRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CheckBothPartiesSignedVariables): QueryRef<CheckBothPartiesSignedData, CheckBothPartiesSignedVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CheckBothPartiesSignedVariables): QueryRef<CheckBothPartiesSignedData, CheckBothPartiesSignedVariables>;
  operationName: string;
}
export const checkBothPartiesSignedRef: CheckBothPartiesSignedRef;

export function checkBothPartiesSigned(vars: CheckBothPartiesSignedVariables): QueryPromise<CheckBothPartiesSignedData, CheckBothPartiesSignedVariables>;
export function checkBothPartiesSigned(dc: DataConnect, vars: CheckBothPartiesSignedVariables): QueryPromise<CheckBothPartiesSignedData, CheckBothPartiesSignedVariables>;

interface GetChartReviewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetChartReviewsVariables): QueryRef<GetChartReviewsData, GetChartReviewsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetChartReviewsVariables): QueryRef<GetChartReviewsData, GetChartReviewsVariables>;
  operationName: string;
}
export const getChartReviewsRef: GetChartReviewsRef;

export function getChartReviews(vars: GetChartReviewsVariables): QueryPromise<GetChartReviewsData, GetChartReviewsVariables>;
export function getChartReviews(dc: DataConnect, vars: GetChartReviewsVariables): QueryPromise<GetChartReviewsData, GetChartReviewsVariables>;

interface GetQaMeetingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQaMeetingsVariables): QueryRef<GetQaMeetingsData, GetQaMeetingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetQaMeetingsVariables): QueryRef<GetQaMeetingsData, GetQaMeetingsVariables>;
  operationName: string;
}
export const getQaMeetingsRef: GetQaMeetingsRef;

export function getQaMeetings(vars: GetQaMeetingsVariables): QueryPromise<GetQaMeetingsData, GetQaMeetingsVariables>;
export function getQaMeetings(dc: DataConnect, vars: GetQaMeetingsVariables): QueryPromise<GetQaMeetingsData, GetQaMeetingsVariables>;

interface GetComplianceStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetComplianceStatusVariables): QueryRef<GetComplianceStatusData, GetComplianceStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetComplianceStatusVariables): QueryRef<GetComplianceStatusData, GetComplianceStatusVariables>;
  operationName: string;
}
export const getComplianceStatusRef: GetComplianceStatusRef;

export function getComplianceStatus(vars: GetComplianceStatusVariables): QueryPromise<GetComplianceStatusData, GetComplianceStatusVariables>;
export function getComplianceStatus(dc: DataConnect, vars: GetComplianceStatusVariables): QueryPromise<GetComplianceStatusData, GetComplianceStatusVariables>;

interface GetUpcomingQaMeetingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUpcomingQaMeetingsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUpcomingQaMeetingsData, undefined>;
  operationName: string;
}
export const getUpcomingQaMeetingsRef: GetUpcomingQaMeetingsRef;

export function getUpcomingQaMeetings(): QueryPromise<GetUpcomingQaMeetingsData, undefined>;
export function getUpcomingQaMeetings(dc: DataConnect): QueryPromise<GetUpcomingQaMeetingsData, undefined>;

interface GetActiveCpaCountRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActiveCpaCountVariables): QueryRef<GetActiveCpaCountData, GetActiveCpaCountVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetActiveCpaCountVariables): QueryRef<GetActiveCpaCountData, GetActiveCpaCountVariables>;
  operationName: string;
}
export const getActiveCpaCountRef: GetActiveCpaCountRef;

export function getActiveCpaCount(vars: GetActiveCpaCountVariables): QueryPromise<GetActiveCpaCountData, GetActiveCpaCountVariables>;
export function getActiveCpaCount(dc: DataConnect, vars: GetActiveCpaCountVariables): QueryPromise<GetActiveCpaCountData, GetActiveCpaCountVariables>;

interface GetStateRatioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStateRatioVariables): QueryRef<GetStateRatioData, GetStateRatioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStateRatioVariables): QueryRef<GetStateRatioData, GetStateRatioVariables>;
  operationName: string;
}
export const getStateRatioRef: GetStateRatioRef;

export function getStateRatio(vars: GetStateRatioVariables): QueryPromise<GetStateRatioData, GetStateRatioVariables>;
export function getStateRatio(dc: DataConnect, vars: GetStateRatioVariables): QueryPromise<GetStateRatioData, GetStateRatioVariables>;

interface GetMyStateCapacitiesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyStateCapacitiesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyStateCapacitiesData, undefined>;
  operationName: string;
}
export const getMyStateCapacitiesRef: GetMyStateCapacitiesRef;

export function getMyStateCapacities(): QueryPromise<GetMyStateCapacitiesData, undefined>;
export function getMyStateCapacities(dc: DataConnect): QueryPromise<GetMyStateCapacitiesData, undefined>;

interface GetPhysicianStateCapacitiesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPhysicianStateCapacitiesVariables): QueryRef<GetPhysicianStateCapacitiesData, GetPhysicianStateCapacitiesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPhysicianStateCapacitiesVariables): QueryRef<GetPhysicianStateCapacitiesData, GetPhysicianStateCapacitiesVariables>;
  operationName: string;
}
export const getPhysicianStateCapacitiesRef: GetPhysicianStateCapacitiesRef;

export function getPhysicianStateCapacities(vars: GetPhysicianStateCapacitiesVariables): QueryPromise<GetPhysicianStateCapacitiesData, GetPhysicianStateCapacitiesVariables>;
export function getPhysicianStateCapacities(dc: DataConnect, vars: GetPhysicianStateCapacitiesVariables): QueryPromise<GetPhysicianStateCapacitiesData, GetPhysicianStateCapacitiesVariables>;

interface SearchPhysiciansWithStateCapacityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: SearchPhysiciansWithStateCapacityVariables): QueryRef<SearchPhysiciansWithStateCapacityData, SearchPhysiciansWithStateCapacityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: SearchPhysiciansWithStateCapacityVariables): QueryRef<SearchPhysiciansWithStateCapacityData, SearchPhysiciansWithStateCapacityVariables>;
  operationName: string;
}
export const searchPhysiciansWithStateCapacityRef: SearchPhysiciansWithStateCapacityRef;

export function searchPhysiciansWithStateCapacity(vars?: SearchPhysiciansWithStateCapacityVariables): QueryPromise<SearchPhysiciansWithStateCapacityData, SearchPhysiciansWithStateCapacityVariables>;
export function searchPhysiciansWithStateCapacity(dc: DataConnect, vars?: SearchPhysiciansWithStateCapacityVariables): QueryPromise<SearchPhysiciansWithStateCapacityData, SearchPhysiciansWithStateCapacityVariables>;

interface SeedStatesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<SeedStatesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<SeedStatesData, undefined>;
  operationName: string;
}
export const seedStatesRef: SeedStatesRef;

export function seedStates(): MutationPromise<SeedStatesData, undefined>;
export function seedStates(dc: DataConnect): MutationPromise<SeedStatesData, undefined>;

