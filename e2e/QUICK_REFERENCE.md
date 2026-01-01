# FINN E2E Seeding - Quick Reference

## Quick Start

### 1. Import the helpers
```typescript
import { initializeAdminSDK, captureUserUID, deleteTestUser } from './helpers/auth-helpers.js';
import { seedNPData, seedPhysicianData, seedCollaborationData } from './helpers/seed-helpers.js';
import { TEST_DATA } from './helpers/test-data.js';
```

### 2. Initialize Admin SDK (once per test suite)
```typescript
test.beforeAll(async () => {
  await initializeAdminSDK();
});
```

### 3. Basic Seeding Pattern
```typescript
test.beforeEach(async ({ page }) => {
  // 1. Register user via UI
  await page.goto('http://localhost:5173/signup');
  await page.fill('[name="email"]', TEST_DATA.NP_EMAIL);
  await page.fill('[name="password"]', TEST_DATA.NP_PASSWORD);
  await page.click('button[type="submit"]');

  // 2. Capture UID from Firebase Auth
  const { uid } = await captureUserUID(TEST_DATA.NP_EMAIL);

  // 3. Seed data via Data Connect
  await seedNPData(uid);
});
```

### 4. Cleanup
```typescript
test.afterEach(async () => {
  await deleteTestUser(TEST_DATA.NP_EMAIL);
});
```

## Available Functions

### Auth Helpers

| Function | Purpose | Returns |
|----------|---------|---------|
| `initializeAdminSDK()` | Initialize Firebase Admin SDK | Promise<void> |
| `captureUserUID(email)` | Get user UID after registration | Promise<{uid, email}> |
| `deleteTestUser(email)` | Delete test user | Promise<void> |
| `getAdminApp()` | Get admin app instance | App |

### Seed Helpers

| Function | Purpose | Returns |
|----------|---------|---------|
| `seedNPData(npUid)` | Seed NP profile and directory | Promise<void> |
| `seedPhysicianData(physicianUid)` | Seed Physician profile and directory | Promise<void> |
| `seedCollaborationData(npUid, physicianUid)` | Seed complete collaboration workflow | Promise<string> (agreement ID) |

### Test Data

```typescript
TEST_DATA.NP_EMAIL         // 'testnp@example.com'
TEST_DATA.NP_PASSWORD      // 'testpass123'
TEST_DATA.NP_NAME          // 'Sarah Johnson'

TEST_DATA.PHYSICIAN_EMAIL  // 'testphysician@example.com'
TEST_DATA.PHYSICIAN_PASSWORD // 'testpass123'
TEST_DATA.PHYSICIAN_NAME   // 'Dr. Michael Smith'

TEST_DATA.NP_LICENSE_TX    // { number, type, issueDate, ... }
TEST_DATA.PHYSICIAN_LICENSE_TX // { number, type, issueDate, ... }

TEST_DATA.NP_DIRECTORY     // { seekingStates, specialty, ... }
TEST_DATA.PHYSICIAN_DIRECTORY // { availableStates, specialty, ... }

TEST_DATA.STATES.TEXAS     // 'TX'
TEST_DATA.STATES.CALIFORNIA // 'CA'
TEST_DATA.STATES.ILLINOIS  // 'IL'
```

## Seeded Data Breakdown

### seedNPData(npUid)
- ✅ User profile (upsert)
- ✅ NP directory profile

### seedPhysicianData(physicianUid)
- ✅ User profile (upsert)
- ✅ Physician directory profile

### seedCollaborationData(npUid, physicianUid)
- ✅ Texas state lookup
- ✅ NP license in Texas
- ✅ Physician license in Texas
- ✅ Collaboration agreement
- ✅ Chart review (1 sample)
- ✅ QA meeting (1 sample)
- ✅ Conversation
- ✅ Messages (2 bidirectional)

## Common Patterns

### Full Collaboration Test Setup
```typescript
let npUid: string;
let physicianUid: string;
let agreementId: string;

test.beforeAll(async () => {
  await initializeAdminSDK();
});

test.beforeEach(async ({ page }) => {
  // Register NP
  await page.goto('http://localhost:5173/signup');
  await page.fill('[name="email"]', TEST_DATA.NP_EMAIL);
  await page.fill('[name="password"]', TEST_DATA.NP_PASSWORD);
  await page.click('button[type="submit"]');
  const npUser = await captureUserUID(TEST_DATA.NP_EMAIL);
  npUid = npUser.uid;
  await seedNPData(npUid);

  // Register Physician (in new context)
  const physicianContext = await browser.newContext();
  const physicianPage = await physicianContext.newPage();
  await physicianPage.goto('http://localhost:5173/signup');
  await physicianPage.fill('[name="email"]', TEST_DATA.PHYSICIAN_EMAIL);
  await physicianPage.fill('[name="password"]', TEST_DATA.PHYSICIAN_PASSWORD);
  await physicianPage.click('button[type="submit"]');
  const physicianUser = await captureUserUID(TEST_DATA.PHYSICIAN_EMAIL);
  physicianUid = physicianUser.uid;
  await seedPhysicianData(physicianUid);
  await physicianContext.close();

  // Seed collaboration
  agreementId = await seedCollaborationData(npUid, physicianUid);
});

test.afterEach(async () => {
  await deleteTestUser(TEST_DATA.NP_EMAIL);
  await deleteTestUser(TEST_DATA.PHYSICIAN_EMAIL);
});
```

### Test with Seeded Data
```typescript
test('should display collaboration agreement', async ({ page }) => {
  // Login as NP
  await page.goto('http://localhost:5173/login');
  await page.fill('[name="email"]', TEST_DATA.NP_EMAIL);
  await page.fill('[name="password"]', TEST_DATA.NP_PASSWORD);
  await page.click('button[type="submit"]');

  // Navigate to agreements
  await page.goto('http://localhost:5173/agreements');

  // Verify agreement exists
  await expect(page.locator(`[data-agreement-id="${agreementId}"]`)).toBeVisible();
});
```

## Testing the Seeding

### Run standalone test
```bash
cd /Volumes/4TB-Z/programming/CPA_app_FINN/e2e
npx tsx helpers/test-seeding.ts
```

### Prerequisites
1. Firebase emulators running:
   ```bash
   firebase emulators:start
   ```
2. Emulators accessible at:
   - Auth: localhost:9099
   - Data Connect: localhost:9399

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "User not found" | Wait longer - captureUserUID has 10s retry built-in |
| "GraphQL mutation failed" | Check Data Connect emulator is running on :9399 |
| "State not found" | Ensure states are seeded in database first |
| TypeScript errors | Run `npm install` to ensure dependencies are installed |

## File Locations

```
/Volumes/4TB-Z/programming/CPA_app_FINN/e2e/
├── helpers/
│   ├── auth-helpers.ts       # Firebase Admin SDK functions
│   ├── seed-helpers.ts       # Data Connect seeding functions
│   ├── test-data.ts          # Test data constants
│   └── test-seeding.ts       # Standalone test script
├── tests/
│   └── np-workflow.spec.ts   # Example Playwright test
├── SEEDING_README.md         # Full documentation
├── QUICK_REFERENCE.md        # This file
└── IMPLEMENTATION_SUMMARY.md # Implementation details
```

## Next Steps

1. Copy this pattern to your test files
2. Customize test data as needed
3. Add more seeding functions for other entities
4. Run your Playwright tests!

---

For full documentation, see `SEEDING_README.md`
