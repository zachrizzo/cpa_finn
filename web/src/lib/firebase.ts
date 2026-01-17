import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getDataConnect, type DataConnect, connectDataConnectEmulator } from "firebase/data-connect";
import { connectorConfig } from "@dataconnect/generated";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate required environment variables in development
if (process.env.NODE_ENV === 'development') {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  ];
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      console.warn(`Missing required environment variable: ${varName}`);
    }
  }
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);
const storage = getStorage(app);

// Set to true to use local emulators instead of production Firebase
const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === 'true';

// Connect to emulators only if explicitly enabled
if (typeof window !== 'undefined' && useEmulators) {
  try {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFunctionsEmulator(functions, "localhost", 5001);
    connectStorageEmulator(storage, "localhost", 9199);
    console.log("Connected to Firebase emulators (Auth, Functions, Storage)");
  } catch {
    console.log("Emulators already connected");
  }
}

// Initialize Data Connect
let dc: DataConnect | undefined;
try {
  dc = getDataConnect(app, connectorConfig);
  if (typeof window !== 'undefined' && useEmulators) {
    try {
      connectDataConnectEmulator(dc, 'localhost', 9399);
      console.log("Connected to Data Connect emulator");
    } catch {
      console.log("Data Connect emulator already connected");
    }
  }
} catch (e) {
  console.warn("Data Connect not initialized (SDK not generated?)", e);
}

// Helper to ensure dc is defined (throws error if not)
function getDc(): DataConnect {
  if (!dc) {
    throw new Error("Data Connect not initialized. Please ensure the SDK is generated.");
  }
  return dc;
}

export { app, auth, functions, storage, dc, getDc };
