import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const DATA_CONNECT_EMULATOR = 'http://localhost:9399';

// Initialize Firebase Admin SDK
const adminApp = initializeApp({
  projectId: 'cpa-app-9c58f',
});

// Connect to emulators
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

console.log('Firebase Admin SDK initialized for emulators');

async function captureUserUID(email) {
  const auth = getAuth(adminApp);

  // Poll for user
  let user;
  let attempts = 0;
  const maxAttempts = 40; // Increased to 40 attempts (20 seconds)

  while (!user && attempts < maxAttempts) {
    try {
      user = await auth.getUserByEmail(email);
      console.log(`Found user ${email} with UID: ${user.uid}`);
      break;
    } catch (e) {
      attempts++;
      if (attempts % 5 === 0) {
        console.log(`Still looking for user... attempt ${attempts}/${maxAttempts}`);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  if (!user) {
    throw new Error(`User ${email} not found in Firebase Auth after ${maxAttempts} attempts`);
  }

  return { uid: user.uid, email: user.email };
}

async function executeDataConnectMutation(mutation, variables) {
  const response = await fetch(`${DATA_CONNECT_EMULATOR}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-mantle-admin': 'all',
    },
    body: JSON.stringify({
      query: mutation,
      variables,
    }),
  });

  const result = await response.json();

  if (result.errors) {
    console.error('GraphQL Errors:', JSON.stringify(result.errors, null, 2));
    throw new Error(`GraphQL mutation failed: ${result.errors[0]?.message}`);
  }

  return result.data;
}

async function seedNPData(npUid) {
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
    email: 'testnp@example.com',
    displayName: 'Sarah Johnson',
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

// Main execution
async function main() {
  try {
    const npUser = await captureUserUID('testnp@example.com');
    await seedNPData(npUser.uid);
    console.log('✅ NP data seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
