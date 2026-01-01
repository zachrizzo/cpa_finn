import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App | undefined;

export async function initializeAdminSDK(): Promise<void> {
  if (adminApp) {
    return; // Already initialized
  }

  // Initialize Firebase Admin SDK
  adminApp = initializeApp({
    projectId: 'cpa-app-9c58f',
  });

  // Connect to emulators
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'; // If needed

  console.log('Firebase Admin SDK initialized for emulators');
}

export async function captureUserUID(email: string): Promise<{ uid: string; email: string }> {
  if (!adminApp) {
    await initializeAdminSDK();
  }

  const auth = getAuth(adminApp!);

  // Poll for user (may take a moment to sync after registration)
  let user;
  let attempts = 0;
  const maxAttempts = 20; // 10 seconds total (500ms * 20)

  while (!user && attempts < maxAttempts) {
    try {
      user = await auth.getUserByEmail(email);
      console.log(`Found user ${email} with UID: ${user.uid}`);
      break;
    } catch (e) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  if (!user) {
    throw new Error(`User ${email} not found in Firebase Auth after ${maxAttempts} attempts`);
  }

  return { uid: user.uid, email: user.email! };
}

export async function deleteTestUser(email: string): Promise<void> {
  if (!adminApp) {
    await initializeAdminSDK();
  }

  const auth = getAuth(adminApp!);
  try {
    const user = await auth.getUserByEmail(email);
    await auth.deleteUser(user.uid);
    console.log(`Deleted test user: ${email}`);
  } catch (e) {
    console.log(`User ${email} not found for deletion (may have been already deleted)`);
  }
}

export function getAdminApp(): App {
  if (!adminApp) {
    throw new Error('Admin SDK not initialized. Call initializeAdminSDK() first.');
  }
  return adminApp;
}
