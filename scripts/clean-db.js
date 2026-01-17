#!/usr/bin/env node

/**
 * Clean all data from Data Connect and Firebase Auth
 * Usage: node scripts/clean-db.js [--auth] [--data] [--prod]
 *   --auth  Clean only Firebase Auth
 *   --data  Clean only Data Connect
 *   --prod  Target production (default: emulator)
 *   (no flags = clean both on emulator)
 */

const admin = require('firebase-admin');
const { execSync } = require('child_process');

const PROJECT_ID = 'cpa-app-9c58f';
const REGION = 'us-east4';
const SERVICE_ID = 'cpa-app-9c58f-2-service';

const IS_PRODUCTION = process.argv.includes('--prod');

const DATA_CONNECT_EMULATOR = `http://localhost:9399/v1alpha/projects/${PROJECT_ID}/locations/${REGION}/services/${SERVICE_ID}:executeGraphql`;
const DATA_CONNECT_PRODUCTION = `https://firebasedataconnect.googleapis.com/v1alpha/projects/${PROJECT_ID}/locations/${REGION}/services/${SERVICE_ID}:executeGraphql`;

const DATA_CONNECT_URL = IS_PRODUCTION ? DATA_CONNECT_PRODUCTION : DATA_CONNECT_EMULATOR;

let accessToken = null;

// Connect to Auth emulator (only if not production)
if (!IS_PRODUCTION) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
}

if (!admin.apps.length) {
  admin.initializeApp({ projectId: PROJECT_ID });
}

async function getAccessToken() {
  if (!IS_PRODUCTION) return null;
  try {
    return execSync('gcloud auth print-access-token', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error('Failed to get access token. Run: gcloud auth login');
    process.exit(1);
  }
}

async function executeGraphQL(operation) {
  const headers = { 'Content-Type': 'application/json' };

  if (IS_PRODUCTION) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    headers['x-mantle-admin'] = 'all';
  }

  const response = await fetch(DATA_CONNECT_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: operation }),
  });
  const result = await response.json();
  if (result.errors?.length > 0 && !result.errors[0].message.includes('Cannot query field')) {
    throw new Error(result.errors[0].message);
  }
  return result.data;
}

async function cleanAuth() {
  console.log('🔐 Cleaning Firebase Auth...');
  const auth = admin.auth();

  let deleted = 0;
  let nextPageToken;

  do {
    const result = await auth.listUsers(100, nextPageToken);
    const testUsers = result.users.filter(u => u.email?.includes('test.finn.dev'));

    if (testUsers.length > 0) {
      const uids = testUsers.map(u => u.uid);
      await auth.deleteUsers(uids);
      deleted += uids.length;
    }

    nextPageToken = result.pageToken;
  } while (nextPageToken);

  console.log(`  ✓ Deleted ${deleted} Auth users`);
}

async function cleanDataConnect() {
  console.log('🗄️  Cleaning Data Connect...');

  const tables = [
    { name: 'messages', query: 'messages { id }', delete: 'message_delete' },
    { name: 'conversations', query: 'conversations { id }', delete: 'conversation_delete' },
    { name: 'collaborationAgreements', query: 'collaborationAgreements { id }', delete: 'collaborationAgreement_delete' },
    { name: 'npDirectories', query: 'npDirectories { _id: id }', delete: 'npDirectory_delete', idField: '_id' },
    { name: 'providerDirectories', query: 'providerDirectories { _id: id }', delete: 'providerDirectory_delete', idField: '_id' },
    { name: 'licenses', query: 'licenses { id }', delete: 'license_delete' },
    { name: 'users', query: 'users { id }', delete: 'user_delete' },
    { name: 'states', query: 'states { id }', delete: 'state_delete' },
  ];

  for (const table of tables) {
    try {
      const data = await executeGraphQL(`query { ${table.query} }`);
      const items = data[table.name] || [];

      for (const item of items) {
        const id = item[table.idField || 'id'];
        await executeGraphQL(`mutation { ${table.delete}(id: "${id}") }`);
      }

      console.log(`  ✓ Deleted ${items.length} ${table.name}`);
    } catch (e) {
      console.log(`  ⚠ ${table.name}: ${e.message}`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const cleanAuthOnly = args.includes('--auth');
  const cleanDataOnly = args.includes('--data');
  const cleanBoth = !cleanAuthOnly && !cleanDataOnly;

  const envLabel = IS_PRODUCTION ? '🔴 PRODUCTION' : '🟢 LOCAL EMULATOR';

  console.log('\n🧹 Database Cleanup');
  console.log(`   Environment: ${envLabel}\n`);

  // Production safety check
  if (IS_PRODUCTION) {
    console.log('⚠️  WARNING: You are about to DELETE PRODUCTION DATA!');
    console.log('   Press Ctrl+C within 5 seconds to cancel...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('🔑 Getting access token...');
    accessToken = await getAccessToken();
    console.log('  ✓ Token acquired\n');
  }

  if (cleanBoth || cleanAuthOnly) {
    await cleanAuth();
  }

  if (cleanBoth || cleanDataOnly) {
    await cleanDataConnect();
  }

  console.log('\n✅ Cleanup complete!\n');
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
