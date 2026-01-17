#!/usr/bin/env node

const AuthSeeder = require('./seed/auth-seeder');
const fs = require('fs');
const path = require('path');

// =============================================================================
// ENVIRONMENT CONFIGURATION
// =============================================================================

const PROJECT_ID = 'cpa-app-9c58f';
const REGION = 'us-east4';
const SERVICE_ID = 'cpa-app-9c58f-2-service';

// Check for --prod flag
const IS_PRODUCTION = process.argv.includes('--prod');

// Data Connect endpoints
const DATA_CONNECT_EMULATOR = `http://localhost:9399/v1alpha/projects/${PROJECT_ID}/locations/${REGION}/services/${SERVICE_ID}:executeGraphql`;
const DATA_CONNECT_PRODUCTION = `https://firebasedataconnect.googleapis.com/v1alpha/projects/${PROJECT_ID}/locations/${REGION}/services/${SERVICE_ID}:executeGraphql`;

const DATA_CONNECT_URL = IS_PRODUCTION ? DATA_CONNECT_PRODUCTION : DATA_CONNECT_EMULATOR;
const STATES_DATA_PATH = path.join(__dirname, 'seed/data/states.json');

// For production, we need to get an access token
let accessToken = null;

async function getAccessToken() {
  if (!IS_PRODUCTION) return null;

  const { execSync } = require('child_process');
  try {
    // Get token from gcloud CLI - try multiple paths
    const gcloudPaths = [
      'gcloud',
      '/opt/homebrew/share/google-cloud-sdk/bin/gcloud',
      '/usr/local/google-cloud-sdk/bin/gcloud',
      `${process.env.HOME}/google-cloud-sdk/bin/gcloud`
    ];

    for (const gcloudPath of gcloudPaths) {
      try {
        const token = execSync(`${gcloudPath} auth print-access-token`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
        return token;
      } catch (e) {
        continue; // Try next path
      }
    }
    throw new Error('gcloud not found in any expected location');
  } catch (error) {
    console.error('Failed to get access token. Make sure you are logged in with: gcloud auth login');
    process.exit(1);
  }
}

// =============================================================================
// SEED DATA CONFIGURATION
// =============================================================================

const NP_SPECIALTIES = [
  'Family Medicine',
  'Internal Medicine',
  'Pediatrics',
  'Geriatrics',
  'Women\'s Health',
  'Psychiatric Mental Health',
  'Adult-Gerontology Primary Care',
  'Adult-Gerontology Acute Care',
  'Emergency Medicine',
  'Oncology',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Palliative Care'
];

const PHYSICIAN_SPECIALTIES = [
  'Internal Medicine',
  'Family Medicine',
  'Cardiology',
  'Pulmonology',
  'Gastroenterology',
  'Nephrology',
  'Endocrinology',
  'Rheumatology',
  'Infectious Disease',
  'Geriatric Medicine',
  'Oncology',
  'Hematology',
  'Neurology',
  'Dermatology',
  'Psychiatry'
];

const SUPERVISION_MODELS = ['collaborative', 'supervisory', 'delegated', 'hybrid'];
const COMPENSATION_MODELS = ['hourly', 'monthly', 'per_chart', 'hybrid'];
const AGREEMENT_STATUSES = ['draft', 'pending', 'active', 'active', 'active', 'active', 'expired', 'terminated'];

const CONVERSATION_MESSAGES = [
  // Introductory messages
  { type: 'intro_np', messages: [
    'Hello! I saw your profile and I\'m interested in a collaboration agreement. Do you have availability?',
    'Hi there! I\'m looking for a collaborating physician in your state. Would you be open to discussing?',
    'Good morning! I\'m an NP seeking collaboration. I noticed you have experience in my specialty.',
    'Hello Dr.! I found your profile on FINN and would love to discuss potential collaboration.',
    'Hi! I\'m reaching out about collaboration opportunities. Are you currently accepting new NPs?',
    'Greetings! I noticed you specialize in my area of practice. Would you be interested in collaborating?',
    'Hello! I am looking for a supervising physician for my practice. Your profile caught my attention.',
    'Hi there! I recently obtained my license in your state and am seeking collaboration.'
  ]},
  { type: 'intro_physician', messages: [
    'Hello! Thanks for reaching out. I\'d be happy to discuss collaboration.',
    'Hi there! Yes, I do have availability for new collaboration agreements.',
    'Welcome! I\'m always interested in connecting with qualified NPs.',
    'Hello! I saw your credentials - very impressive. Let\'s talk.',
    'Thanks for contacting me. I\'m currently accepting new collaborations.',
    'Great to hear from you! I have been looking for NPs to work with in your area.',
    'Hi! Your background looks excellent. I am definitely open to discussing terms.',
    'Thank you for your message. I would be glad to explore collaboration opportunities.'
  ]},
  // Discussion messages
  { type: 'discussion_np', messages: [
    'I have about 5 years of experience in primary care. What\'s your typical supervision model?',
    'Can you tell me more about your chart review process?',
    'What are your expectations for communication frequency?',
    'I\'m currently seeing about 20 patients per day. Does that fit your capacity?',
    'What\'s your availability for consultations when I have complex cases?',
    'Do you have experience with telehealth collaborations?',
    'What states are you licensed in currently?',
    'I\'m particularly interested in your experience with chronic disease management.',
    'My patient population is primarily geriatric. Is that within your area of expertise?',
    'I work in an urgent care setting. Would that be a good fit for collaboration?',
    'What documentation systems do you typically use?',
    'How do you handle after-hours consultations?',
    'I am planning to expand my practice. Can you accommodate growth?',
    'What is your preferred method of communication for non-urgent matters?'
  ]},
  { type: 'discussion_physician', messages: [
    'I typically do monthly chart reviews of 10% of patient encounters.',
    'My collaboration model is quite flexible - we can discuss what works best.',
    'I prefer weekly check-ins initially, then move to as-needed once we establish rapport.',
    'I\'m available for consults during business hours and can respond to urgent matters within 2 hours.',
    'I\'ve been supervising NPs for over 10 years now with great success.',
    'We can arrange quarterly in-person or video meetings for quality review.',
    'I use a shared EMR system which makes chart review efficient.',
    'Happy to mentor on complex cases - that\'s one of my favorite parts of collaboration.',
    'My supervision approach is supportive rather than restrictive.',
    'I believe in empowering NPs while maintaining appropriate oversight.',
    'We can customize the collaboration agreement to fit your specific practice needs.',
    'I have experience with both in-person and remote supervision arrangements.',
    'Chart reviews can be done asynchronously, which works well for busy schedules.',
    'I am comfortable with a range of supervision models depending on your experience level.'
  ]},
  // Scheduling messages
  { type: 'scheduling', messages: [
    'Can we schedule a call to discuss details?',
    'Would you be available for a video call this week?',
    'Let\'s set up a time to go over the specifics.',
    'I\'m free Monday or Wednesday afternoon if you\'d like to connect.',
    'How about we do a 30-minute intro call?',
    'I can send you my availability - what works for you?',
    'Would a phone call or video meeting work better for you?',
    'Let me know some times that work and I will send a calendar invite.',
    'Are you available sometime next week for a brief discussion?',
    'I am flexible on timing - just let me know what works best.'
  ]},
  // Follow-up messages
  { type: 'followup', messages: [
    'Thanks for the call yesterday - I think this could be a great fit!',
    'I\'ve reviewed the agreement draft. Looks good to me.',
    'Just following up on our conversation. Any questions on your end?',
    'The documentation you sent was very helpful, thank you.',
    'I\'m excited to move forward with this collaboration.',
    'Let me know if you need any additional information from me.',
    'I have sent over the requested documents. Please confirm receipt.',
    'Looking forward to working together!',
    'Thank you for your patience during the setup process.',
    'Everything is progressing nicely. Should be finalized soon.'
  ]},
  // Administrative messages
  { type: 'admin', messages: [
    'I\'ve uploaded my license verification to my profile.',
    'My DEA registration is current through next year.',
    'I\'ll send over my malpractice insurance details.',
    'The board filing has been submitted on my end.',
    'I\'ve signed the agreement - please check your dashboard.',
    'Everything is in order for the compliance review.',
    'I have updated my credentials in the system.',
    'Just completed the required documentation.',
    'All my certifications are uploaded and current.',
    'The background check has been completed.'
  ]}
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateLicenseNumber(type, stateCode, index) {
  const prefix = type === 'np' ? 'NP' : 'MD';
  return `${prefix}-${stateCode}-${String(index).padStart(5, '0')}`;
}

function generateExpirationDate(yearsFromNow) {
  const date = new Date();
  date.setFullYear(date.getFullYear() + yearsFromNow);
  return date.toISOString().split('T')[0];
}

function generateIssueDate(yearsAgo) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - yearsAgo);
  return date.toISOString().split('T')[0];
}

function generateStateCombinations(states, count) {
  const shuffled = [...states].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, states.length)).map(s => s.stateCode).join(',');
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Progress bar helper
function printProgress(current, total, label) {
  const percentage = Math.round((current / total) * 100);
  const barLength = 30;
  const filled = Math.round((current / total) * barLength);
  const bar = '='.repeat(filled) + '-'.repeat(barLength - filled);
  process.stdout.write(`\r  [${bar}] ${percentage}% ${label} (${current}/${total})`);
}

// =============================================================================
// GRAPHQL OPERATIONS
// =============================================================================

async function executeGraphQL(operation, variables = {}, debug = false) {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Add auth headers based on environment
  if (IS_PRODUCTION) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    headers['x-mantle-admin'] = 'all'; // Admin access for emulator
  }

  const response = await fetch(DATA_CONNECT_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: operation,
      variables,
    }),
  });

  const result = await response.json();

  if (debug) {
    console.log('GraphQL Response:', JSON.stringify(result, null, 2));
  }

  if (result.errors && result.errors.length > 0) {
    console.error('GraphQL Errors:', JSON.stringify(result.errors, null, 2));
    throw new Error(`GraphQL operation failed: ${result.errors[0]?.message}`);
  }

  return result.data;
}

async function cleanDataConnect() {
  console.log('Cleaning Data Connect data...');

  // Delete in order to respect foreign key constraints
  // First delete entities that reference others

  // 1. Delete messages (batch query and delete)
  try {
    const messages = await executeGraphQL(`query { messages { id } }`);
    const msgIds = messages.messages || [];
    if (msgIds.length > 0) {
      // Delete in batches of 50
      for (let i = 0; i < msgIds.length; i += 50) {
        const batch = msgIds.slice(i, i + 50);
        await Promise.all(batch.map(msg =>
          executeGraphQL(`mutation { message_delete(id: "${msg.id}") }`)
        ));
      }
    }
    console.log(`  - Deleted ${msgIds.length} messages`);
  } catch (e) {
    console.log(`  * Messages cleanup skipped: ${e.message}`);
  }

  // 2. Delete conversations
  try {
    const conversations = await executeGraphQL(`query { conversations { id } }`);
    const convIds = conversations.conversations || [];
    for (let i = 0; i < convIds.length; i += 50) {
      const batch = convIds.slice(i, i + 50);
      await Promise.all(batch.map(conv =>
        executeGraphQL(`mutation { conversation_delete(id: "${conv.id}") }`)
      ));
    }
    console.log(`  - Deleted ${convIds.length} conversations`);
  } catch (e) {
    console.log(`  * Conversations cleanup skipped: ${e.message}`);
  }

  // 3. Delete collaboration agreements
  try {
    const agreements = await executeGraphQL(`query { collaborationAgreements { id } }`);
    const agrIds = agreements.collaborationAgreements || [];
    for (let i = 0; i < agrIds.length; i += 50) {
      const batch = agrIds.slice(i, i + 50);
      await Promise.all(batch.map(agr =>
        executeGraphQL(`mutation { collaborationAgreement_delete(id: "${agr.id}") }`)
      ));
    }
    console.log(`  - Deleted ${agrIds.length} agreements`);
  } catch (e) {
    console.log(`  * Agreements cleanup skipped: ${e.message}`);
  }

  // 4. Delete directory profiles
  try {
    const npDirs = await executeGraphQL(`query { npDirectories { id } }`);
    const npDirIds = npDirs.npDirectories || [];
    for (let i = 0; i < npDirIds.length; i += 50) {
      const batch = npDirIds.slice(i, i + 50);
      await Promise.all(batch.map(dir =>
        executeGraphQL(`mutation { npDirectory_delete(id: "${dir.id}") }`)
      ));
    }
    console.log(`  - Deleted ${npDirIds.length} NP directories`);
  } catch (e) {
    console.log(`  * NP directories cleanup skipped: ${e.message}`);
  }

  try {
    const providerDirs = await executeGraphQL(`query { providerDirectories { id } }`);
    const provDirIds = providerDirs.providerDirectories || [];
    for (let i = 0; i < provDirIds.length; i += 50) {
      const batch = provDirIds.slice(i, i + 50);
      await Promise.all(batch.map(dir =>
        executeGraphQL(`mutation { providerDirectory_delete(id: "${dir.id}") }`)
      ));
    }
    console.log(`  - Deleted ${provDirIds.length} provider directories`);
  } catch (e) {
    console.log(`  * Provider directories cleanup skipped: ${e.message}`);
  }

  // 5. Delete licenses
  try {
    const licenses = await executeGraphQL(`query { licenses { id } }`);
    const licIds = licenses.licenses || [];
    for (let i = 0; i < licIds.length; i += 50) {
      const batch = licIds.slice(i, i + 50);
      await Promise.all(batch.map(lic =>
        executeGraphQL(`mutation { license_delete(id: "${lic.id}") }`)
      ));
    }
    console.log(`  - Deleted ${licIds.length} licenses`);
  } catch (e) {
    console.log(`  * Licenses cleanup skipped: ${e.message}`);
  }

  // 6. Delete users
  try {
    const users = await executeGraphQL(`query { users { id } }`);
    const userIds = users.users || [];
    for (let i = 0; i < userIds.length; i += 50) {
      const batch = userIds.slice(i, i + 50);
      await Promise.all(batch.map(user =>
        executeGraphQL(`mutation { user_delete(id: "${user.id}") }`)
      ));
    }
    console.log(`  - Deleted ${userIds.length} users`);
  } catch (e) {
    console.log(`  * Users cleanup skipped: ${e.message}`);
  }

  console.log('');
}

// =============================================================================
// SEEDING FUNCTIONS
// =============================================================================

async function seedStates() {
  console.log('Seeding states...');
  const statesData = JSON.parse(fs.readFileSync(STATES_DATA_PATH, 'utf8'));

  // Seed states in parallel batches
  const batchSize = 10;
  for (let i = 0; i < statesData.length; i += batchSize) {
    const batch = statesData.slice(i, Math.min(i + batchSize, statesData.length));
    await Promise.all(batch.map(state =>
      executeGraphQL(`
        mutation InsertState(
          $stateCode: String!
          $stateName: String!
          $fpaAvailable: Boolean!
          $paVerificationRequired: Boolean!
          $nursysCompatible: Boolean!
          $cpaRequired: Boolean
          $physicianNpRatio: String
          $hasRatioLimit: Boolean!
          $boardFilingRequired: Boolean
          $boardFilingPathway: String!
          $licenseVerificationUrl: String
          $complianceNotes: String
          $fpaAutomaticWithLicense: Boolean
          $fpaRequiresApplication: Boolean
          $fpaHoursRequired: Int
          $fpaYearsRequired: Int
          $fpaWithinStateRequired: Boolean
          $chartReviewFrequency: String
          $chartReviewPercentage: Float
          $qaMeetingFrequency: String
          $boardFilingWho: String
          $boardFilingFee: Float
          $boardPortalUrl: String
          $ratioIsFte: Boolean
        ) {
          state_insert(data: {
            stateCode: $stateCode
            stateName: $stateName
            fpaAvailable: $fpaAvailable
            paVerificationRequired: $paVerificationRequired
            nursysCompatible: $nursysCompatible
            cpaRequired: $cpaRequired
            physicianNpRatio: $physicianNpRatio
            hasRatioLimit: $hasRatioLimit
            boardFilingRequired: $boardFilingRequired
            boardFilingPathway: $boardFilingPathway
            licenseVerificationUrl: $licenseVerificationUrl
            complianceNotes: $complianceNotes
            fpaAutomaticWithLicense: $fpaAutomaticWithLicense
            fpaRequiresApplication: $fpaRequiresApplication
            fpaHoursRequired: $fpaHoursRequired
            fpaYearsRequired: $fpaYearsRequired
            fpaWithinStateRequired: $fpaWithinStateRequired
            chartReviewFrequency: $chartReviewFrequency
            chartReviewPercentage: $chartReviewPercentage
            qaMeetingFrequency: $qaMeetingFrequency
            boardFilingWho: $boardFilingWho
            boardFilingFee: $boardFilingFee
            boardPortalUrl: $boardPortalUrl
            ratioIsFte: $ratioIsFte
          })
        }
      `, state)
    ));
    printProgress(Math.min(i + batchSize, statesData.length), statesData.length, 'states');
  }
  console.log('');

  return statesData;
}

async function seedUser(userData) {
  await executeGraphQL(`
    mutation UpsertUser($id: String!, $email: String!, $displayName: String!, $role: String!) {
      user_upsert(data: {
        id: $id
        email: $email
        displayName: $displayName
        role: $role
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      })
    }
  `, {
    id: userData.uid,
    email: userData.email,
    displayName: userData.displayName,
    role: userData.role,
  });
}

async function getStateId(stateCode) {
  const result = await executeGraphQL(`
    query GetState($stateCode: String!) {
      states(where: { stateCode: { eq: $stateCode } }, limit: 1) {
        id
        stateCode
      }
    }
  `, { stateCode });

  if (!result || !result.states || result.states.length === 0) {
    return null;
  }

  return result.states[0].id;
}

async function seedLicense(userId, stateId, licenseData) {
  const result = await executeGraphQL(`
    mutation CreateLicense(
      $userId: String!
      $stateId: UUID!
      $licenseNumber: String!
      $licenseType: String!
      $issueDate: Date!
      $expirationDate: Date!
      $verificationStatus: String!
      $supervisedHoursInState: Int
      $supervisedYearsInState: Int
    ) {
      license_insert(data: {
        userId: $userId
        stateId: $stateId
        licenseNumber: $licenseNumber
        licenseType: $licenseType
        issueDate: $issueDate
        expirationDate: $expirationDate
        verificationStatus: $verificationStatus
        supervisedHoursInState: $supervisedHoursInState
        supervisedYearsInState: $supervisedYearsInState
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      })
    }
  `, {
    userId,
    stateId,
    ...licenseData
  });
  return result.license_insert.id;
}

async function seedCollaborationAgreement(npLicenseId, physicianLicenseId, stateId, status = 'active') {
  const result = await executeGraphQL(`
    mutation CreateAgreement($npLicenseId: UUID!, $physicianLicenseId: UUID!, $stateId: UUID!, $status: String!) {
      collaborationAgreement_insert(data: {
        npLicenseId: $npLicenseId
        physicianLicenseId: $physicianLicenseId
        stateId: $stateId
        status: $status
        isActive: true
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      })
    }
  `, { npLicenseId, physicianLicenseId, stateId, status });
  return result.collaborationAgreement_insert.id;
}

async function seedConversation(npUserId, physicianUserId, agreementId = null) {
  const result = await executeGraphQL(`
    mutation CreateConversation($npUserId: String!, $physicianUserId: String!, $agreementId: UUID) {
      conversation_insert(data: {
        conversationId_expr: "uuidV4()"
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
  `, { npUserId, physicianUserId, agreementId });
  return result.conversation_insert.id;
}

async function seedMessage(conversationId, senderId, messageBody) {
  await executeGraphQL(`
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
  `, { conversationId, senderId, body: messageBody });
}

async function seedNpDirectory(npId, statesData, specialtyIndex) {
  const seekingStates = generateStateCombinations(statesData, randomInt(2, 5));
  const licensedStates = generateStateCombinations(statesData, randomInt(1, 4));
  const cpaNeededStates = generateStateCombinations(statesData.filter(s => s.cpaRequired), randomInt(1, 3));

  await executeGraphQL(`
    mutation CreateNPDirectory(
      $npId: String!
      $seekingStates: String!
      $licensedStates: String!
      $cpaNeededStates: String!
      $primarySpecialty: String!
      $hoursPerWeekAvailable: Int!
      $yearsExperience: Int!
      $preferredCompensationModel: String!
    ) {
      npDirectory_insert(data: {
        npId: $npId
        isActive: true
        profileVisibility: "public"
        seekingStates: $seekingStates
        licensedStates: $licensedStates
        cpaNeededStates: $cpaNeededStates
        primarySpecialty: $primarySpecialty
        hoursPerWeekAvailable: $hoursPerWeekAvailable
        yearsExperience: $yearsExperience
        preferredCompensationModel: $preferredCompensationModel
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
        lastActiveAt_expr: "request.time"
      })
    }
  `, {
    npId,
    seekingStates,
    licensedStates,
    cpaNeededStates,
    primarySpecialty: NP_SPECIALTIES[specialtyIndex % NP_SPECIALTIES.length],
    hoursPerWeekAvailable: randomChoice([20, 24, 30, 32, 36, 40]),
    yearsExperience: randomInt(2, 20),
    preferredCompensationModel: randomChoice(COMPENSATION_MODELS)
  });
}

async function seedPhysicianDirectory(physicianId, statesData, specialtyIndex) {
  const availableStates = generateStateCombinations(statesData, randomInt(2, 6));
  const preferredStates = generateStateCombinations(statesData, randomInt(1, 4));
  const totalCapacity = randomInt(4, 12);
  const currentCount = randomInt(0, Math.min(4, totalCapacity - 1));

  await executeGraphQL(`
    mutation CreatePhysicianDirectory(
      $physicianId: String!
      $availableStates: String!
      $preferredStates: String!
      $totalNpCapacity: Int!
      $currentNpCount: Int!
      $availableSpots: Int!
      $primarySpecialty: String!
      $supervisionModel: String!
      $hourlyRate: Float!
      $yearsSupervising: Int!
    ) {
      providerDirectory_insert(data: {
        physicianId: $physicianId
        isActive: true
        profileVisibility: "public"
        availableStates: $availableStates
        preferredStates: $preferredStates
        totalNpCapacity: $totalNpCapacity
        currentNpCount: $currentNpCount
        availableSpots: $availableSpots
        primarySpecialty: $primarySpecialty
        supervisionModel: $supervisionModel
        hourlyRate: $hourlyRate
        yearsSupervising: $yearsSupervising
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
        lastActiveAt_expr: "request.time"
      })
    }
  `, {
    physicianId,
    availableStates,
    preferredStates,
    totalNpCapacity: totalCapacity,
    currentNpCount: currentCount,
    availableSpots: totalCapacity - currentCount,
    primarySpecialty: PHYSICIAN_SPECIALTIES[specialtyIndex % PHYSICIAN_SPECIALTIES.length],
    supervisionModel: randomChoice(SUPERVISION_MODELS),
    hourlyRate: randomFloat(100, 300),
    yearsSupervising: randomInt(3, 25)
  });
}

// =============================================================================
// MASSIVE SCALE BULK SEEDING FUNCTIONS
// =============================================================================

async function seedAllUsers(users) {
  console.log('Seeding users in Data Connect...');
  const userEntries = Object.entries(users);
  const batchSize = 20;

  for (let i = 0; i < userEntries.length; i += batchSize) {
    const batch = userEntries.slice(i, Math.min(i + batchSize, userEntries.length));
    await Promise.all(batch.map(([key, user]) => seedUser(user)));
    printProgress(Math.min(i + batchSize, userEntries.length), userEntries.length, 'users');
  }
  console.log('');
}

async function seedAllLicenses(users, stateIds, statesData, isMassive = false) {
  console.log('Seeding licenses...');
  const licenseIds = {};
  let licenseCounter = 1;

  // Get all NPs and physicians
  const nps = Object.entries(users).filter(([key]) => key.startsWith('np'));
  const physicians = Object.entries(users).filter(([key]) => key.startsWith('physician'));
  const stateCodes = Object.keys(stateIds);

  // Target: 2-4 licenses per user for massive, 1-3 for normal
  const minLicenses = isMassive ? 2 : 1;
  const maxLicensesNp = isMassive ? 4 : 3;
  const maxLicensesMd = isMassive ? 5 : 4;

  const licenseTasks = [];

  // Prepare all NP license tasks
  for (const [key, user] of nps) {
    const numLicenses = randomInt(minLicenses, maxLicensesNp);
    const selectedStates = shuffleArray(stateCodes).slice(0, numLicenses);

    for (const stateCode of selectedStates) {
      if (!stateIds[stateCode]) continue;
      const licenseKey = `${key}_${stateCode.toLowerCase()}`;
      const yearsAgo = randomInt(2, 12);

      licenseTasks.push({
        licenseKey,
        userId: user.uid,
        stateId: stateIds[stateCode],
        licenseData: {
          licenseNumber: generateLicenseNumber('np', stateCode, licenseCounter++),
          licenseType: 'Nurse Practitioner (NP)',
          issueDate: generateIssueDate(yearsAgo),
          expirationDate: generateExpirationDate(randomInt(1, 3)),
          verificationStatus: randomChoice(['verified', 'verified', 'verified', 'pending']),
          supervisedHoursInState: randomInt(2000, 10000),
          supervisedYearsInState: randomInt(2, Math.min(yearsAgo, 8))
        }
      });
    }
  }

  // Prepare all physician license tasks
  for (const [key, user] of physicians) {
    const numLicenses = randomInt(minLicenses, maxLicensesMd);
    const selectedStates = shuffleArray(stateCodes).slice(0, numLicenses);

    for (const stateCode of selectedStates) {
      if (!stateIds[stateCode]) continue;
      const licenseKey = `${key}_${stateCode.toLowerCase()}`;

      licenseTasks.push({
        licenseKey,
        userId: user.uid,
        stateId: stateIds[stateCode],
        licenseData: {
          licenseNumber: generateLicenseNumber('md', stateCode, licenseCounter++),
          licenseType: 'Medical Doctor (MD)',
          issueDate: generateIssueDate(randomInt(5, 25)),
          expirationDate: generateExpirationDate(randomInt(1, 4)),
          verificationStatus: 'verified'
        }
      });
    }
  }

  // Execute license creation in parallel batches
  const batchSize = 20;
  for (let i = 0; i < licenseTasks.length; i += batchSize) {
    const batch = licenseTasks.slice(i, Math.min(i + batchSize, licenseTasks.length));
    const results = await Promise.all(batch.map(async (task) => {
      const licenseId = await seedLicense(task.userId, task.stateId, task.licenseData);
      return { key: task.licenseKey, id: licenseId };
    }));

    for (const result of results) {
      licenseIds[result.key] = result.id;
    }
    printProgress(Math.min(i + batchSize, licenseTasks.length), licenseTasks.length, 'licenses');
  }
  console.log('');

  console.log(`  Total: ${Object.keys(licenseIds).length} licenses created`);
  return licenseIds;
}

async function seedAllAgreements(users, licenseIds, stateIds, isMassive = false) {
  console.log('Seeding collaboration agreements...');
  const agreementIds = {};

  const nps = Object.entries(users).filter(([key]) => key.startsWith('np'));
  const physicians = Object.entries(users).filter(([key]) => key.startsWith('physician'));
  const stateCodes = Object.keys(stateIds);

  // Target: 100+ agreements for massive scale
  const targetAgreements = isMassive ? 120 : 12;
  const agreementTasks = [];

  // Generate agreement pairs
  // Strategy: Each NP can have 1-3 agreements, each physician can supervise 1-4 NPs
  const shuffledNps = shuffleArray(nps);
  const shuffledPhysicians = shuffleArray(physicians);

  let agreementCount = 0;
  const usedPairs = new Set();

  // First pass: ensure primary test users have agreements
  const primaryPairs = [
    { np: 'np1', physician: 'physician1' },
    { np: 'np2', physician: 'physician2' },
    { np: 'np1', physician: 'physician2' },
    { np: 'np2', physician: 'physician1' },
  ];

  for (const pair of primaryPairs) {
    if (users[pair.np] && users[pair.physician]) {
      // Find a common state
      const npLicenseKeys = Object.keys(licenseIds).filter(k => k.startsWith(`${pair.np}_`));
      const physicianLicenseKeys = Object.keys(licenseIds).filter(k => k.startsWith(`${pair.physician}_`));

      const npStates = npLicenseKeys.map(k => k.split('_')[1]);
      const physicianStates = physicianLicenseKeys.map(k => k.split('_')[1]);
      const commonStates = npStates.filter(s => physicianStates.includes(s));

      if (commonStates.length > 0) {
        const state = randomChoice(commonStates);
        const pairKey = `${pair.np}_${pair.physician}_${state}`;

        if (!usedPairs.has(pairKey)) {
          usedPairs.add(pairKey);
          agreementTasks.push({
            key: pairKey,
            npLicenseKey: `${pair.np}_${state}`,
            physicianLicenseKey: `${pair.physician}_${state}`,
            stateCode: state.toUpperCase(),
            status: randomChoice(AGREEMENT_STATUSES)
          });
          agreementCount++;
        }
      }
    }
  }

  // Second pass: Generate remaining agreements randomly
  // Calculate maximum possible combinations to prevent infinite loop
  const maxPossibleCombinations = nps.length * physicians.length * stateCodes.length;
  const maxIterations = Math.max(targetAgreements * 10, maxPossibleCombinations * 2);
  let iterations = 0;

  while (agreementCount < targetAgreements && iterations < maxIterations) {
    iterations++;
    const [npKey, npUser] = randomChoice(shuffledNps);
    const [physicianKey, physicianUser] = randomChoice(shuffledPhysicians);

    // Find common licensed states
    const npLicenseKeys = Object.keys(licenseIds).filter(k => k.startsWith(`${npKey}_`));
    const physicianLicenseKeys = Object.keys(licenseIds).filter(k => k.startsWith(`${physicianKey}_`));

    if (npLicenseKeys.length === 0 || physicianLicenseKeys.length === 0) continue;

    const npStates = npLicenseKeys.map(k => k.split('_')[1]);
    const physicianStates = physicianLicenseKeys.map(k => k.split('_')[1]);
    const commonStates = npStates.filter(s => physicianStates.includes(s));

    if (commonStates.length === 0) continue;

    const state = randomChoice(commonStates);
    const pairKey = `${npKey}_${physicianKey}_${state}`;

    if (usedPairs.has(pairKey)) continue;
    usedPairs.add(pairKey);

    agreementTasks.push({
      key: pairKey,
      npLicenseKey: `${npKey}_${state}`,
      physicianLicenseKey: `${physicianKey}_${state}`,
      stateCode: state.toUpperCase(),
      status: randomChoice(AGREEMENT_STATUSES)
    });
    agreementCount++;
  }

  if (agreementCount < targetAgreements) {
    console.log(`  Note: Only ${agreementCount} unique agreements possible (target was ${targetAgreements})`);
  }

  // Execute agreement creation in parallel batches
  const batchSize = 20;
  for (let i = 0; i < agreementTasks.length; i += batchSize) {
    const batch = agreementTasks.slice(i, Math.min(i + batchSize, agreementTasks.length));
    const results = await Promise.all(batch.map(async (task) => {
      const npLicenseId = licenseIds[task.npLicenseKey];
      const physicianLicenseId = licenseIds[task.physicianLicenseKey];
      const stateId = stateIds[task.stateCode];

      if (!npLicenseId || !physicianLicenseId || !stateId) {
        return null;
      }

      const agreementId = await seedCollaborationAgreement(npLicenseId, physicianLicenseId, stateId, task.status);
      return { key: task.key, id: agreementId };
    }));

    for (const result of results) {
      if (result) {
        agreementIds[result.key] = result.id;
      }
    }
    printProgress(Math.min(i + batchSize, agreementTasks.length), agreementTasks.length, 'agreements');
  }
  console.log('');

  console.log(`  Total: ${Object.keys(agreementIds).length} agreements created`);
  return agreementIds;
}

async function seedAllDirectories(users, statesData, isMassive = false) {
  console.log('Seeding directory profiles...');

  const nps = Object.entries(users).filter(([key]) => key.startsWith('np'));
  const physicians = Object.entries(users).filter(([key]) => key.startsWith('physician'));

  // Create NP directories in batches
  const batchSize = 15;
  for (let i = 0; i < nps.length; i += batchSize) {
    const batch = nps.slice(i, Math.min(i + batchSize, nps.length));
    await Promise.all(batch.map(([key, user], batchIdx) =>
      seedNpDirectory(user.uid, statesData, i + batchIdx)
    ));
    printProgress(Math.min(i + batchSize, nps.length), nps.length, 'NP directories');
  }
  console.log('');

  // Create Physician directories in batches
  for (let i = 0; i < physicians.length; i += batchSize) {
    const batch = physicians.slice(i, Math.min(i + batchSize, physicians.length));
    await Promise.all(batch.map(([key, user], batchIdx) =>
      seedPhysicianDirectory(user.uid, statesData, i + batchIdx)
    ));
    printProgress(Math.min(i + batchSize, physicians.length), physicians.length, 'Physician directories');
  }
  console.log('');

  console.log(`  Total: ${nps.length} NP directories, ${physicians.length} physician directories`);
}

async function seedAllConversations(users, agreementIds, isMassive = false) {
  console.log('Seeding conversations and messages...');

  const nps = Object.entries(users).filter(([key]) => key.startsWith('np'));
  const physicians = Object.entries(users).filter(([key]) => key.startsWith('physician'));

  // Target: 100+ conversations with 500-1000 messages
  const targetConversations = isMassive ? 120 : 13;
  const minMessages = isMassive ? 4 : 3;
  const maxMessages = isMassive ? 12 : 15;

  const conversationTasks = [];
  const usedPairs = new Set();

  // First: Create conversations for existing agreements
  for (const [agreementKey, agreementId] of Object.entries(agreementIds)) {
    const parts = agreementKey.split('_');
    const npKey = parts[0];
    const physicianKey = parts[1];
    const pairKey = `${npKey}_${physicianKey}`;

    if (usedPairs.has(pairKey)) continue;
    usedPairs.add(pairKey);

    if (users[npKey] && users[physicianKey]) {
      conversationTasks.push({
        npUserId: users[npKey].uid,
        physicianUserId: users[physicianKey].uid,
        agreementId: agreementId,
        messageCount: randomInt(minMessages, maxMessages),
        hasAgreement: true
      });
    }
  }

  // Second: Create additional conversations without agreements
  let attempts = 0;
  while (conversationTasks.length < targetConversations && attempts < targetConversations * 3) {
    attempts++;
    const [npKey, npUser] = randomChoice(nps);
    const [physicianKey, physicianUser] = randomChoice(physicians);
    const pairKey = `${npKey}_${physicianKey}`;

    if (usedPairs.has(pairKey)) continue;
    usedPairs.add(pairKey);

    conversationTasks.push({
      npUserId: npUser.uid,
      physicianUserId: physicianUser.uid,
      agreementId: null,
      messageCount: randomInt(minMessages, maxMessages),
      hasAgreement: false
    });
  }

  // Execute conversation and message creation
  let totalMessages = 0;
  const batchSize = 10;

  for (let i = 0; i < conversationTasks.length; i += batchSize) {
    const batch = conversationTasks.slice(i, Math.min(i + batchSize, conversationTasks.length));

    await Promise.all(batch.map(async (task) => {
      const convId = await seedConversation(task.npUserId, task.physicianUserId, task.agreementId);
      const messageCount = await generateConversationMessages(
        convId,
        task.npUserId,
        task.physicianUserId,
        task.messageCount,
        task.hasAgreement
      );
      totalMessages += messageCount;
    }));

    printProgress(Math.min(i + batchSize, conversationTasks.length), conversationTasks.length, 'conversations');
  }
  console.log('');

  console.log(`  Total: ${conversationTasks.length} conversations, ${totalMessages} messages`);
  return conversationTasks.length;
}

async function generateConversationMessages(conversationId, npUserId, physicianUserId, targetCount, hasAgreement) {
  let messageCount = 0;
  const messages = [];

  // Start with intro messages
  const introNp = randomChoice(CONVERSATION_MESSAGES.find(m => m.type === 'intro_np').messages);
  messages.push({ senderId: npUserId, body: introNp });
  messageCount++;

  if (targetCount > 1) {
    const introPhysician = randomChoice(CONVERSATION_MESSAGES.find(m => m.type === 'intro_physician').messages);
    messages.push({ senderId: physicianUserId, body: introPhysician });
    messageCount++;
  }

  // Add discussion messages
  while (messageCount < targetCount - 2) {
    const isNpTurn = messageCount % 2 === 0;
    const type = isNpTurn ? 'discussion_np' : 'discussion_physician';
    const senderId = isNpTurn ? npUserId : physicianUserId;
    const msgPool = CONVERSATION_MESSAGES.find(m => m.type === type).messages;

    messages.push({ senderId, body: randomChoice(msgPool) });
    messageCount++;
  }

  // Add scheduling or follow-up messages near the end
  if (messageCount < targetCount) {
    const schedulingMsg = randomChoice(CONVERSATION_MESSAGES.find(m => m.type === 'scheduling').messages);
    messages.push({ senderId: randomChoice([npUserId, physicianUserId]), body: schedulingMsg });
    messageCount++;
  }

  // If has agreement, add admin message at the end
  if (hasAgreement && messageCount < targetCount) {
    const adminMsg = randomChoice(CONVERSATION_MESSAGES.find(m => m.type === 'admin').messages);
    messages.push({ senderId: randomChoice([npUserId, physicianUserId]), body: adminMsg });
    messageCount++;
  } else if (messageCount < targetCount) {
    const followupMsg = randomChoice(CONVERSATION_MESSAGES.find(m => m.type === 'followup').messages);
    messages.push({ senderId: randomChoice([npUserId, physicianUserId]), body: followupMsg });
    messageCount++;
  }

  // Send all messages in parallel batches
  const batchSize = 5;
  for (let i = 0; i < messages.length; i += batchSize) {
    const batch = messages.slice(i, Math.min(i + batchSize, messages.length));
    await Promise.all(batch.map(msg =>
      seedMessage(conversationId, msg.senderId, msg.body)
    ));
  }

  return messageCount;
}

// =============================================================================
// MAIN FUNCTION
// =============================================================================

async function main() {
  const args = process.argv.slice(2);
  const profileName = args.find(arg => !arg.startsWith('--')) || 'full';
  const cleanFirst = args.includes('--clean');
  const isMassive = profileName === 'massive';

  const envLabel = IS_PRODUCTION ? '🔴 PRODUCTION' : '🟢 LOCAL EMULATOR';

  console.log('\n========================================================');
  console.log('  Firebase Auth + Data Connect Seeding');
  console.log('========================================================');
  console.log(`  Environment: ${envLabel}`);
  console.log(`  Profile: ${profileName}${isMassive ? ' (MASSIVE SCALE)' : ''}`);
  console.log(`  Clean: ${cleanFirst}`);
  console.log('========================================================\n');

  // Production safety check
  if (IS_PRODUCTION) {
    if (cleanFirst) {
      console.log('⚠️  WARNING: You are about to CLEAN PRODUCTION DATA!');
      console.log('   This will DELETE all test users and their data.');
      console.log('   Press Ctrl+C within 5 seconds to cancel...\n');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // Get access token for production
    console.log('🔑 Getting access token...');
    accessToken = await getAccessToken();
    console.log('  ✓ Token acquired\n');
  }

  const startTime = Date.now();

  // Step 1: Initialize Auth Seeder
  const authSeeder = new AuthSeeder({ useEmulator: !IS_PRODUCTION });
  await authSeeder.initialize();

  // Step 2: Clean existing data if requested
  if (cleanFirst) {
    console.log('Cleaning existing test users...');
    await authSeeder.deleteAllTestUsers();
    console.log('');
    await cleanDataConnect();
  }

  // Step 3: Create Auth users and capture UIDs
  console.log('Creating Firebase Auth users...');
  const userMapping = await authSeeder.seedUsers(profileName);
  console.log(`Created ${userMapping.size} users\n`);

  if (userMapping.size === 0) {
    console.log('No users to seed. Done.');
    return;
  }

  const users = authSeeder.exportMapping();

  // Step 4: Seed states
  const statesData = await seedStates();
  console.log('');

  // Step 5: Seed users in Data Connect
  await seedAllUsers(users);

  // Step 6: Get state IDs
  console.log('Fetching state IDs...');
  const stateIds = {};
  const stateBatchSize = 10;
  for (let i = 0; i < statesData.length; i += stateBatchSize) {
    const batch = statesData.slice(i, Math.min(i + stateBatchSize, statesData.length));
    const results = await Promise.all(batch.map(async (state) => {
      const id = await getStateId(state.stateCode);
      return { code: state.stateCode, id };
    }));
    for (const result of results) {
      if (result.id) {
        stateIds[result.code] = result.id;
      }
    }
  }
  console.log(`  Found ${Object.keys(stateIds).length} state IDs\n`);

  // Step 7: Seed licenses (bulk)
  const licenseIds = await seedAllLicenses(users, stateIds, statesData, isMassive);
  console.log('');

  // Step 8: Seed collaboration agreements (bulk)
  const agreementIds = await seedAllAgreements(users, licenseIds, stateIds, isMassive);
  console.log('');

  // Step 9: Seed directory profiles (bulk)
  await seedAllDirectories(users, statesData, isMassive);
  console.log('');

  // Step 10: Seed conversations and messages (bulk)
  await seedAllConversations(users, agreementIds, isMassive);
  console.log('');

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);

  // Summary
  console.log('========================================================');
  console.log('  Seeding Complete!');
  console.log('========================================================');
  console.log(`  Duration: ${duration}s\n`);

  // Stats summary
  const npCount = Object.keys(users).filter(k => k.startsWith('np')).length;
  const physicianCount = Object.keys(users).filter(k => k.startsWith('physician')).length;

  console.log('  Seed Data Summary:');
  console.log('  ------------------');
  console.log(`  Users:                 ${npCount + physicianCount} (${npCount} NPs, ${physicianCount} Physicians)`);
  console.log(`  States:                ${statesData.length}`);
  console.log(`  Licenses:              ${Object.keys(licenseIds).length}`);
  console.log(`  Agreements:            ${Object.keys(agreementIds).length}`);
  console.log(`  NP Directories:        ${npCount}`);
  console.log(`  Physician Directories: ${physicianCount}`);
  console.log('');

  // Test credentials (only show first few for massive)
  console.log('  Test Credentials (password: testpass123):');
  console.log('  ------------------------------------------');
  const userList = Object.entries(users);
  const showCount = isMassive ? 6 : userList.length;

  for (let i = 0; i < Math.min(showCount, userList.length); i++) {
    const [key, user] = userList[i];
    console.log(`  ${user.email.padEnd(30)} | ${user.role.padEnd(10)} | ${user.displayName}`);
  }

  if (isMassive && userList.length > showCount) {
    console.log(`  ... and ${userList.length - showCount} more users`);
  }
  console.log('');

  // Save credentials to file for easy reference
  const credentialsPath = path.join(__dirname, 'seed', 'credentials.json');
  const credentials = {
    generatedAt: new Date().toISOString(),
    password: 'testpass123',
    profile: profileName,
    users: userList.map(([key, user]) => ({
      key,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      uid: user.uid
    }))
  };
  fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));
  console.log(`  Credentials saved to: scripts/seed/credentials.json`);
  console.log(`  Run 'npm run users' to list all test accounts`);
  console.log('');
  console.log('========================================================\n');
}

main().catch(error => {
  console.error('\n[ERROR] Seeding failed:', error.message);
  console.error(error.stack);
  process.exit(1);
});
