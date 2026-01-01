# FINN E2E Testing - Seeding Infrastructure

## Overview

This document describes the seeding infrastructure implemented for FINN Playwright E2E tests. The seeding system uses Firebase Admin SDK to create test users and the Data Connect GraphQL API to seed comprehensive test data.

## Architecture

### Components

1. **auth-helpers.ts** - Firebase Admin SDK initialization and user management
2. **seed-helpers.ts** - Data Connect GraphQL mutations for seeding
3. **test-data.ts** - Centralized test data constants
4. **test-seeding.ts** - Standalone test script to verify seeding

## Files Implemented

### 1. auth-helpers.ts (73 lines)

**Exported Functions:**
- `initializeAdminSDK()` - Initialize Firebase Admin SDK for emulators
- `captureUserUID(email)` - Poll for user UID after registration
- `deleteTestUser(email)` - Clean up test users
- `getAdminApp()` - Get initialized admin app instance

**Key Features:**
- Automatic emulator connection (Auth: localhost:9099, Firestore: localhost:8080)
- Retry logic for user capture (20 attempts, 500ms intervals)
- Singleton pattern for admin app

### 2. seed-helpers.ts (341 lines)

**Exported Functions:**
- `seedNPData(npUid)` - Seed NP user profile and directory
- `seedPhysicianData(physicianUid)` - Seed Physician user profile and directory
- `seedCollaborationData(npUid, physicianUid)` - Seed complete collaboration workflow

**Internal Function:**
- `executeDataConnectMutation(mutation, variables)` - Execute GraphQL mutations against Data Connect emulator

**Key Features:**
- Direct HTTP calls to Data Connect emulator (http://localhost:9399)
- Admin header (`x-mantle-admin: all`) to bypass auth rules
- Comprehensive error handling with detailed logging
- Returns agreement ID for further testing

**Seeded Data:**
- User profiles (NP and Physician)
- Directory profiles (NP and Physician)
- State lookups (Texas)
- Licenses (NP and Physician in TX)
- Collaboration agreements
- Chart reviews
- QA meetings
- Conversations
- Messages

### 3. test-data.ts (58 lines)

**Exported Constant:**
- `TEST_DATA` - Comprehensive test data object

**Data Structure:**
```typescript
{
  // User credentials
  NP_EMAIL, NP_PASSWORD, NP_NAME
  PHYSICIAN_EMAIL, PHYSICIAN_PASSWORD, PHYSICIAN_NAME

  // License data
  NP_LICENSE_TX: { number, type, issueDate, expirationDate, supervisedHours, supervisedYears }
  PHYSICIAN_LICENSE_TX: { number, type, issueDate, expirationDate }

  // Directory data
  NP_DIRECTORY: { seekingStates, licensedStates, cpaNeededStates, specialty, ... }
  PHYSICIAN_DIRECTORY: { availableStates, preferredStates, specialty, capacity, ... }

  // States
  STATES: { TEXAS, CALIFORNIA, ILLINOIS }
}
```

### 4. test-seeding.ts (35 lines)

Standalone test script to verify seeding functionality.

**Usage:**
```bash
npx tsx helpers/test-seeding.ts
```

## Usage in Playwright Tests

### Basic Pattern

```typescript
import { test, expect } from '@playwright/test';
import { initializeAdminSDK, captureUserUID, deleteTestUser } from './helpers/auth-helpers.js';
import { seedNPData, seedPhysicianData, seedCollaborationData } from './helpers/seed-helpers.js';
import { TEST_DATA } from './helpers/test-data.js';

test.describe('Collaboration Workflow', () => {
  let npUid: string;
  let physicianUid: string;

  test.beforeAll(async () => {
    await initializeAdminSDK();
  });

  test.beforeEach(async ({ page }) => {
    // Register NP user via UI
    await page.goto('http://localhost:5173/signup');
    await page.fill('[name="email"]', TEST_DATA.NP_EMAIL);
    await page.fill('[name="password"]', TEST_DATA.NP_PASSWORD);
    await page.click('button[type="submit"]');

    // Capture UID and seed data
    const npUser = await captureUserUID(TEST_DATA.NP_EMAIL);
    npUid = npUser.uid;
    await seedNPData(npUid);

    // Same for Physician...
    // ...

    // Seed collaboration
    await seedCollaborationData(npUid, physicianUid);
  });

  test.afterEach(async () => {
    await deleteTestUser(TEST_DATA.NP_EMAIL);
    await deleteTestUser(TEST_DATA.PHYSICIAN_EMAIL);
  });

  test('should display collaboration details', async ({ page }) => {
    // Test implementation
  });
});
```

## Data Connect GraphQL Patterns

### Mutation Structure

All mutations use this pattern:
```graphql
mutation Name($var: Type!) {
  table_operation(data: {
    field: $var
    createdAt_expr: "request.time"
    updatedAt_expr: "request.time"
  })
}
```

### Admin Access

The `x-mantle-admin: all` header bypasses auth rules, allowing seeding without authentication.

### Timestamp Expressions

All timestamps use `request.time` expression for server-side timestamp generation.

## Testing the Seeding Infrastructure

### Prerequisites

1. Firebase emulators running:
   ```bash
   firebase emulators:start
   ```

2. Emulator endpoints:
   - Auth: localhost:9099
   - Data Connect: localhost:9399
   - Firestore: localhost:8080 (optional)

### Run Test Script

```bash
cd /Volumes/4TB-Z/programming/CPA_app_FINN/e2e
npx tsx helpers/test-seeding.ts
```

### Expected Output

```
=== Testing Seeding Infrastructure ===

Firebase Admin SDK initialized for emulators
✓ Admin SDK initialized

Testing NP data seeding...
Seeding NP data for UID: 00000000-0000-0000-0000-000000000001
✓ NP user profile created
✓ NP directory profile created
✓ NP seeding complete

Testing Physician data seeding...
Seeding Physician data for UID: 00000000-0000-0000-0000-000000000002
✓ Physician user profile created
✓ Physician directory profile created
✓ Physician seeding complete

Testing collaboration data seeding...
Seeding collaboration data between NP (...) and Physician (...)
✓ Found Texas state: [state-id]
✓ NP license created: [license-id]
✓ Physician license created: [license-id]
✓ Collaboration agreement created: [agreement-id]
✓ Chart review created
✓ QA meeting created
✓ Conversation created: [conversation-id]
✓ Messages created
✅ Collaboration data seeding complete!
✓ Collaboration seeding complete (Agreement ID: [agreement-id])

=== All Seeding Tests Passed! ===
```

## TypeScript Compilation

All files compile without errors:
```bash
npx tsc --noEmit
```

## Troubleshooting

### Common Issues

1. **User not found after registration**
   - The `captureUserUID()` function has built-in retry logic (20 attempts, 500ms intervals)
   - Ensure Firebase Auth emulator is running on localhost:9099

2. **GraphQL mutation errors**
   - Check Data Connect emulator is running on localhost:9399
   - Verify schema matches the mutation structure
   - Check logs for detailed GraphQL error messages

3. **State not found error**
   - Ensure states are seeded in the database before running collaboration seeding
   - Run state seeding first if needed

4. **TypeScript errors**
   - All mutations properly typed with `GraphQLResponse` interface
   - Ensure dependencies are installed: `npm install`

## Next Steps

1. Implement full Playwright test suite using this seeding infrastructure
2. Add cleanup utilities for test isolation
3. Add more comprehensive test data scenarios
4. Add state seeding utility if needed

## Summary

- ✅ Full implementation of auth-helpers.ts with Admin SDK
- ✅ Full implementation of seed-helpers.ts with comprehensive seeding
- ✅ Complete test data constants in test-data.ts
- ✅ Test script for verification (test-seeding.ts)
- ✅ All TypeScript files compile without errors
- ✅ Proper error handling and logging throughout
- ✅ Ready for integration with Playwright tests
