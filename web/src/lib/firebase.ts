import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getDataConnect, type DataConnect, connectDataConnectEmulator } from "firebase/data-connect";
import { connectorConfig } from "@dataconnect/generated";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
] as const;

function validateEnvironment(): void {
  if (process.env.NODE_ENV !== "development") return;

  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      console.warn(`Missing required environment variable: ${varName}`);
    }
  }
}

validateEnvironment();

// Initialize Firebase app (singleton pattern)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);
const storage = getStorage(app);

const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === "true";
const isClient = typeof window !== "undefined";

function connectEmulators(): void {
  if (!isClient || !useEmulators) return;

  try {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFunctionsEmulator(functions, "localhost", 5001);
    connectStorageEmulator(storage, "localhost", 9199);
    console.log("Connected to Firebase emulators (Auth, Functions, Storage)");
  } catch {
    console.log("Emulators already connected");
  }
}

connectEmulators();

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
