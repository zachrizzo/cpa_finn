import { initializeAdminSDK, getAdminApp } from './auth-helpers.js';
import { TEST_DATA } from './test-data.js';

// Import the generated SDK functions from the main app
// We'll use direct HTTP calls to Data Connect emulator instead
const DATA_CONNECT_EMULATOR = 'http://localhost:9399';

interface GraphQLResponse {
  data?: any;
  errors?: Array<{ message: string }>;
}

async function executeDataConnectMutation(mutation: string, variables: any): Promise<any> {
  const response = await fetch(`${DATA_CONNECT_EMULATOR}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-mantle-admin': 'all', // Admin access for seeding
    },
    body: JSON.stringify({
      query: mutation,
      variables,
    }),
  });

  const result = await response.json() as GraphQLResponse;

  if (result.errors) {
    console.error('GraphQL Errors:', JSON.stringify(result.errors, null, 2));
    throw new Error(`GraphQL mutation failed: ${result.errors[0]?.message}`);
  }

  return result.data;
}

export async function seedNPData(npUid: string): Promise<void> {
  await initializeAdminSDK();

  console.log(`Seeding NP data for UID: ${npUid}`);

  // 1. Upsert User Profile
  await executeDataConnectMutation(`
    mutation UpsertNPProfile($uid: String!, $email: String!, $displayName: String!, $role: String!) {
      user_upsert(data: {
        id: $uid
        email: $email
        displayName: $displayName
        role: $role
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      })
    }
  `, {
    uid: npUid,
    email: TEST_DATA.NP_EMAIL,
    displayName: TEST_DATA.NP_NAME,
    role: 'NP',
  });

  console.log('✓ NP user profile created');

  // 2. Create NP Directory Profile
  await executeDataConnectMutation(`
    mutation CreateNPDirectory($npId: String!) {
      npDirectory_insert(data: {
        npId: $npId
        isActive: true
        profileVisibility: "public"
        seekingStates: "TX,CA,IL"
        licensedStates: "TX,CA"
        cpaNeededStates: "TX"
        primarySpecialty: "Family Medicine"
        hoursPerWeekAvailable: 40
        yearsExperience: 5
        preferredCompensationModel: "hourly"
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
        lastActiveAt_expr: "request.time"
      })
    }
  `, { npId: npUid });

  console.log('✓ NP directory profile created');
}

export async function seedPhysicianData(physicianUid: string): Promise<void> {
  await initializeAdminSDK();

  console.log(`Seeding Physician data for UID: ${physicianUid}`);

  // 1. Upsert User Profile
  await executeDataConnectMutation(`
    mutation UpsertPhysicianProfile($uid: String!, $email: String!, $displayName: String!, $role: String!) {
      user_upsert(data: {
        id: $uid
        email: $email
        displayName: $displayName
        role: $role
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      })
    }
  `, {
    uid: physicianUid,
    email: TEST_DATA.PHYSICIAN_EMAIL,
    displayName: TEST_DATA.PHYSICIAN_NAME,
    role: 'PHYSICIAN',
  });

  console.log('✓ Physician user profile created');

  // 2. Create Physician Directory Profile
  await executeDataConnectMutation(`
    mutation CreatePhysicianDirectory($physicianId: String!) {
      providerDirectory_insert(data: {
        physicianId: $physicianId
        isActive: true
        profileVisibility: "public"
        availableStates: "TX,CA,IL"
        preferredStates: "TX,CA"
        totalNpCapacity: 7
        currentNpCount: 2
        availableSpots: 5
        primarySpecialty: "Family Medicine"
        supervisionModel: "collaborative"
        hourlyRate: 150.0
        yearsSupervising: 10
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
        lastActiveAt_expr: "request.time"
      })
    }
  `, { physicianId: physicianUid });

  console.log('✓ Physician directory profile created');
}

export async function seedCollaborationData(npUid: string, physicianUid: string): Promise<string> {
  await initializeAdminSDK();

  console.log(`Seeding collaboration data between NP (${npUid}) and Physician (${physicianUid})`);

  // 1. Get Texas state ID
  const stateResult = await executeDataConnectMutation(`
    query GetTexasState {
      states(where: { stateCode: { eq: "TX" } }, limit: 1) {
        id
        stateCode
        stateName
      }
    }
  `, {});

  const txState = stateResult.states[0];
  if (!txState) {
    throw new Error('Texas state not found in database. Run state seeding first.');
  }
  const txStateId = txState.id;
  console.log(`✓ Found Texas state: ${txStateId}`);

  // 2. Create NP License
  const npLicenseResult = await executeDataConnectMutation(`
    mutation CreateNPLicense($userId: String!, $stateId: UUID!) {
      license_insert(data: {
        userId: $userId
        stateId: $stateId
        licenseNumber: "NP123456TX"
        licenseType: "NP"
        issueDate: "2020-01-01"
        expirationDate: "2025-12-31"
        verificationStatus: "verified"
        supervisedHoursInState: 5000
        supervisedYearsInState: 4
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      })
    }
  `, { userId: npUid, stateId: txStateId });

  const npLicenseId = npLicenseResult.license_insert.id;
  console.log(`✓ NP license created: ${npLicenseId}`);

  // 3. Create Physician License
  const physicianLicenseResult = await executeDataConnectMutation(`
    mutation CreatePhysicianLicense($userId: String!, $stateId: UUID!) {
      license_insert(data: {
        userId: $userId
        stateId: $stateId
        licenseNumber: "MD789012TX"
        licenseType: "MD"
        issueDate: "2010-01-01"
        expirationDate: "2026-12-31"
        verificationStatus: "verified"
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      })
    }
  `, { userId: physicianUid, stateId: txStateId });

  const physicianLicenseId = physicianLicenseResult.license_insert.id;
  console.log(`✓ Physician license created: ${physicianLicenseId}`);

  // 4. Create Collaboration Agreement
  const agreementResult = await executeDataConnectMutation(`
    mutation CreateAgreement($npLicenseId: UUID!, $physicianLicenseId: UUID!, $stateId: UUID!) {
      collaborationAgreement_insert(data: {
        npLicenseId: $npLicenseId
        physicianLicenseId: $physicianLicenseId
        stateId: $stateId
        status: "active"
        isActive: true
        agreementText: "Sample collaboration agreement for testing purposes."
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
        activatedAt_expr: "request.time"
      })
    }
  `, {
    npLicenseId,
    physicianLicenseId,
    stateId: txStateId,
  });

  const agreementId = agreementResult.collaborationAgreement_insert.id;
  console.log(`✓ Collaboration agreement created: ${agreementId}`);

  // 5. Create Chart Review
  await executeDataConnectMutation(`
    mutation CreateChartReview($agreementId: UUID!, $reviewerId: String!) {
      chartReview_insert(data: {
        collaborationAgreementId: $agreementId
        reviewerId: $reviewerId
        reviewDate: "2024-12-01"
        isTimely: true
        reviewPercentage: 10.0
        notes: "Sample chart review - all protocols followed correctly."
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      })
    }
  `, {
    agreementId,
    reviewerId: physicianUid,
  });

  console.log(`✓ Chart review created`);

  // 6. Create QA Meeting
  await executeDataConnectMutation(`
    mutation CreateQAMeeting($agreementId: UUID!, $hostId: String!) {
      qualityAssuranceMeeting_insert(data: {
        collaborationAgreementId: $agreementId
        hostId: $hostId
        meetingDate: "2024-12-15T10:00:00Z"
        meetingType: "monthly"
        notes: "Sample QA meeting - discussed updated protocols and patient safety measures."
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      })
    }
  `, {
    agreementId,
    hostId: physicianUid,
  });

  console.log(`✓ QA meeting created`);

  // 7. Create Conversation
  const conversationResult = await executeDataConnectMutation(`
    mutation CreateConversation($npUserId: String!, $physicianUserId: String!, $agreementId: UUID!) {
      conversation_insert(data: {
        conversationId: "conv-test-123"
        npUserId: $npUserId
        physicianUserId: $physicianUserId
        collaborationAgreementId: $agreementId
        status: "active"
        contactInfoUnlocked: true
        unreadCountNp: 0
        unreadCountPhysician: 0
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
        lastMessageAt_expr: "request.time"
      })
    }
  `, {
    npUserId: npUid,
    physicianUserId: physicianUid,
    agreementId,
  });

  const conversationId = conversationResult.conversation_insert.id;
  console.log(`✓ Conversation created: ${conversationId}`);

  // 8. Create Messages
  await executeDataConnectMutation(`
    mutation CreateMessage($conversationId: UUID!, $senderId: String!, $body: String!) {
      message_insert(data: {
        conversationId: $conversationId
        senderId: $senderId
        messageType: "text"
        messageBody: $body
        containsBlockedContent: false
        deletedBySender: false
        deletedByRecipient: false
        deliveredAt_expr: "request.time"
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      })
    }
  `, {
    conversationId,
    senderId: npUid,
    body: 'Hello Dr. Smith, looking forward to our collaboration!',
  });

  await executeDataConnectMutation(`
    mutation CreateMessage($conversationId: UUID!, $senderId: String!, $body: String!) {
      message_insert(data: {
        conversationId: $conversationId
        senderId: $senderId
        messageType: "text"
        messageBody: $body
        containsBlockedContent: false
        deletedBySender: false
        deletedByRecipient: false
        deliveredAt_expr: "request.time"
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      })
    }
  `, {
    conversationId,
    senderId: physicianUid,
    body: 'Welcome! Let me know if you have any questions about our practice.',
  });

  console.log(`✓ Messages created`);
  console.log(`✅ Collaboration data seeding complete!`);

  return agreementId;
}
