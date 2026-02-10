import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getDataConnect, type DataConnect, connectDataConnectEmulator } from "firebase/data-connect";
import { connectorConfig } from "@dataconnect/generated";

const firebaseConfig = {
  // Trim to guard against accidental trailing newlines/spaces in env vars (common when copy/pasting).
  // Firebase Auth will otherwise throw "Illegal url for new iframe" due to `%0A` in the iframe URL.
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim(),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim(),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim(),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim(),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim(),
};

const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
] as const;

function validateEnvironment(): void {
  // Skip validation when using emulators - env vars not strictly required
  const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === "true";
  if (useEmulators || process.env.NODE_ENV !== "development") return;

  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      console.debug(`Missing environment variable: ${varName}`);
    }
  }
}

validateEnvironment();

// Initialize Firebase app (singleton pattern)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);
const storage = getStorage(app);

const isClient = typeof window !== "undefined";
// Never point production builds at localhost emulators; it's an easy footgun and breaks auth in prod.
const useEmulators =
  process.env.NEXT_PUBLIC_USE_EMULATORS === "true" && process.env.NODE_ENV !== "production";

// Track if emulators are connected to avoid double connection
let emulatorsConnected = false;

function connectEmulators(): void {
  if (!isClient || !useEmulators || emulatorsConnected) return;

  try {
    // Check if already connected by looking at the auth config
    if (!(auth as unknown as { config?: { emulator?: unknown } }).config?.emulator) {
      connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    }
    connectFunctionsEmulator(functions, "localhost", 5001);
    connectStorageEmulator(storage, "localhost", 9199);
    emulatorsConnected = true;
    console.log("Connected to Firebase emulators (Auth, Functions, Storage)");
  } catch (error) {
    // Only log if it's not a "already connected" error
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (!errorMessage.includes("already")) {
      console.warn("Error connecting to emulators:", errorMessage);
    } else {
      emulatorsConnected = true;
      console.log("Emulators already connected");
    }
  }
}

// Connect immediately if on client
if (isClient) {
  connectEmulators();
}

// Initialize Data Connect
let dc: DataConnect | undefined;

function initializeDataConnect(): void {
  try {
    dc = getDataConnect(app, connectorConfig);
    if (isClient && useEmulators) {
      try {
        connectDataConnectEmulator(dc, "localhost", 9399);
        console.log("Connected to Data Connect emulator");
      } catch {
        console.log("Data Connect emulator already connected");
      }
    }
  } catch (e) {
    console.warn("Data Connect not initialized (SDK not generated?)", e);
  }
}

initializeDataConnect();

/**
 * Get the Data Connect instance, throwing if not initialized
 */
export function getDc(): DataConnect {
  if (!dc) {
    throw new Error("Data Connect not initialized. Please ensure the SDK is generated.");
  }
  return dc;
}

export { app, auth, functions, storage, dc };
