// Example Playwright Test Using Seeding Infrastructure
// This file demonstrates how to use the seeding helpers in a real test

import { test, expect } from '@playwright/test';
import { initializeAdminSDK, captureUserUID, deleteTestUser } from './helpers/auth-helpers.js';
import { seedNPData, seedPhysicianData, seedCollaborationData } from './helpers/seed-helpers.js';
import { TEST_DATA } from './helpers/test-data.js';

test.describe('Collaboration Workflow - Full Example', () => {
  let npUid: string;
  let physicianUid: string;
  let agreementId: string;

  // Initialize Admin SDK once for all tests
  test.beforeAll(async () => {
    await initializeAdminSDK();
  });

  // Setup: Register users and seed data before each test
  test.beforeEach(async ({ page, browser }) => {
    // ============================================================
    // STEP 1: Register NP User via UI
    // ============================================================
    console.log('Registering NP user...');
    await page.goto('http://localhost:5173/signup');
    await page.fill('[name="email"]', TEST_DATA.NP_EMAIL);
    await page.fill('[name="password"]', TEST_DATA.NP_PASSWORD);
    await page.fill('[name="displayName"]', TEST_DATA.NP_NAME);
    await page.click('button[type="submit"]');

    // Wait for registration to complete
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // ============================================================
    // STEP 2: Capture NP UID and Seed Data
    // ============================================================
    console.log('Capturing NP UID and seeding data...');
    const npUser = await captureUserUID(TEST_DATA.NP_EMAIL);
    npUid = npUser.uid;
    await seedNPData(npUid);
    console.log(`NP user created with UID: ${npUid}`);

    // ============================================================
    // STEP 3: Register Physician User in Separate Context
    // ============================================================
    console.log('Registering Physician user...');
    const physicianContext = await browser.newContext();
    const physicianPage = await physicianContext.newPage();

    await physicianPage.goto('http://localhost:5173/signup');
    await physicianPage.fill('[name="email"]', TEST_DATA.PHYSICIAN_EMAIL);
    await physicianPage.fill('[name="password"]', TEST_DATA.PHYSICIAN_PASSWORD);
    await physicianPage.fill('[name="displayName"]', TEST_DATA.PHYSICIAN_NAME);
    await physicianPage.click('button[type="submit"]');

    await physicianPage.waitForURL('**/dashboard', { timeout: 10000 });

    // ============================================================
    // STEP 4: Capture Physician UID and Seed Data
    // ============================================================
    console.log('Capturing Physician UID and seeding data...');
    const physicianUser = await captureUserUID(TEST_DATA.PHYSICIAN_EMAIL);
    physicianUid = physicianUser.uid;
    await seedPhysicianData(physicianUid);
    console.log(`Physician user created with UID: ${physicianUid}`);

    // Close physician context
    await physicianContext.close();

    // ============================================================
    // STEP 5: Seed Collaboration Data
    // ============================================================
    console.log('Seeding collaboration data...');
    agreementId = await seedCollaborationData(npUid, physicianUid);
    console.log(`Collaboration agreement created with ID: ${agreementId}`);
  });

  // Cleanup: Delete test users after each test
  test.afterEach(async () => {
    console.log('Cleaning up test users...');
    await deleteTestUser(TEST_DATA.NP_EMAIL);
    await deleteTestUser(TEST_DATA.PHYSICIAN_EMAIL);
    console.log('Cleanup complete');
  });

  // ============================================================
  // ACTUAL TESTS
  // ============================================================

  test('NP should see collaboration agreement in dashboard', async ({ page }) => {
    // Login as NP
    await page.goto('http://localhost:5173/login');
    await page.fill('[name="email"]', TEST_DATA.NP_EMAIL);
    await page.fill('[name="password"]', TEST_DATA.NP_PASSWORD);
    await page.click('button[type="submit"]');

    // Navigate to agreements page
    await page.goto('http://localhost:5173/agreements');

    // Verify agreement is visible
    await expect(page.locator(`[data-agreement-id="${agreementId}"]`)).toBeVisible();

    // Verify agreement details
    await expect(page.locator(`[data-agreement-id="${agreementId}"]`))
      .toContainText('Dr. Michael Smith');
    await expect(page.locator(`[data-agreement-id="${agreementId}"]`))
      .toContainText('Texas');
    await expect(page.locator(`[data-agreement-id="${agreementId}"]`))
      .toContainText('active');
  });

  test('NP should see chart reviews for the agreement', async ({ page }) => {
    // Login as NP
    await page.goto('http://localhost:5173/login');
    await page.fill('[name="email"]', TEST_DATA.NP_EMAIL);
    await page.fill('[name="password"]', TEST_DATA.NP_PASSWORD);
    await page.click('button[type="submit"]');

    // Navigate to agreement details
    await page.goto(`http://localhost:5173/agreements/${agreementId}`);

    // Verify chart review exists
    await expect(page.locator('[data-testid="chart-reviews"]')).toBeVisible();
    await expect(page.locator('[data-testid="chart-review-item"]')).toHaveCount(1);

    // Verify chart review details
    await expect(page.locator('[data-testid="chart-review-item"]'))
      .toContainText('Sample chart review');
    await expect(page.locator('[data-testid="chart-review-percentage"]'))
      .toContainText('10.0%');
  });

  test('NP should see QA meetings for the agreement', async ({ page }) => {
    // Login as NP
    await page.goto('http://localhost:5173/login');
    await page.fill('[name="email"]', TEST_DATA.NP_EMAIL);
    await page.fill('[name="password"]', TEST_DATA.NP_PASSWORD);
    await page.click('button[type="submit"]');

    // Navigate to agreement details
    await page.goto(`http://localhost:5173/agreements/${agreementId}`);

    // Verify QA meeting exists
    await expect(page.locator('[data-testid="qa-meetings"]')).toBeVisible();
    await expect(page.locator('[data-testid="qa-meeting-item"]')).toHaveCount(1);

    // Verify QA meeting details
    await expect(page.locator('[data-testid="qa-meeting-item"]'))
      .toContainText('Sample QA meeting');
    await expect(page.locator('[data-testid="qa-meeting-type"]'))
      .toContainText('monthly');
  });

  test('NP should see conversation with physician', async ({ page }) => {
    // Login as NP
    await page.goto('http://localhost:5173/login');
    await page.fill('[name="email"]', TEST_DATA.NP_EMAIL);
    await page.fill('[name="password"]', TEST_DATA.NP_PASSWORD);
    await page.click('button[type="submit"]');

    // Navigate to messages
    await page.goto('http://localhost:5173/messages');

    // Verify conversation exists
    await expect(page.locator('[data-testid="conversation-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="conversation-item"]')).toHaveCount(1);

    // Verify conversation shows physician name
    await expect(page.locator('[data-testid="conversation-item"]'))
      .toContainText('Dr. Michael Smith');

    // Open conversation and verify messages
    await page.click('[data-testid="conversation-item"]');

    await expect(page.locator('[data-testid="message-item"]')).toHaveCount(2);
    await expect(page.locator('[data-testid="message-item"]').first())
      .toContainText('Hello Dr. Smith, looking forward to our collaboration!');
    await expect(page.locator('[data-testid="message-item"]').last())
      .toContainText('Welcome! Let me know if you have any questions');
  });

  test('Physician should see collaboration agreement in dashboard', async ({ browser }) => {
    // Create new context for physician
    const physicianContext = await browser.newContext();
    const physicianPage = await physicianContext.newPage();

    // Login as Physician
    await physicianPage.goto('http://localhost:5173/login');
    await physicianPage.fill('[name="email"]', TEST_DATA.PHYSICIAN_EMAIL);
    await physicianPage.fill('[name="password"]', TEST_DATA.PHYSICIAN_PASSWORD);
    await physicianPage.click('button[type="submit"]');

    // Navigate to agreements page
    await physicianPage.goto('http://localhost:5173/agreements');

    // Verify agreement is visible
    await expect(physicianPage.locator(`[data-agreement-id="${agreementId}"]`)).toBeVisible();

    // Verify agreement details
    await expect(physicianPage.locator(`[data-agreement-id="${agreementId}"]`))
      .toContainText('Sarah Johnson');
    await expect(physicianPage.locator(`[data-agreement-id="${agreementId}"]`))
      .toContainText('Texas');

    // Cleanup
    await physicianContext.close();
  });
});

// ============================================================
// SIMPLER EXAMPLE: Just NP User
// ============================================================

test.describe('NP Profile - Simple Example', () => {
  let npUid: string;

  test.beforeAll(async () => {
    await initializeAdminSDK();
  });

  test.beforeEach(async ({ page }) => {
    // Register NP user
    await page.goto('http://localhost:5173/signup');
    await page.fill('[name="email"]', TEST_DATA.NP_EMAIL);
    await page.fill('[name="password"]', TEST_DATA.NP_PASSWORD);
    await page.click('button[type="submit"]');

    // Capture UID and seed
    const npUser = await captureUserUID(TEST_DATA.NP_EMAIL);
    npUid = npUser.uid;
    await seedNPData(npUid);
  });

  test.afterEach(async () => {
    await deleteTestUser(TEST_DATA.NP_EMAIL);
  });

  test('NP should see directory profile', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('[name="email"]', TEST_DATA.NP_EMAIL);
    await page.fill('[name="password"]', TEST_DATA.NP_PASSWORD);
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:5173/profile');

    await expect(page.locator('[data-testid="profile-name"]'))
      .toContainText('Sarah Johnson');
    await expect(page.locator('[data-testid="profile-specialty"]'))
      .toContainText('Family Medicine');
    await expect(page.locator('[data-testid="profile-states"]'))
      .toContainText('TX');
  });
});
