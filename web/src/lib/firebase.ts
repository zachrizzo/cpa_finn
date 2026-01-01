import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getDataConnect, type DataConnect, connectDataConnectEmulator } from "firebase/data-connect";
import { connectorConfig } from "@dataconnect/generated"; // This will be generated

const firebaseConfig = {
    apiKey: "AIzaSyC-E1H_Ou8Ti2KK1dzixjzeH18PuHGjvJw",
    authDomain: "cpa-app-9c58f.firebaseapp.com",
    projectId: "cpa-app-9c58f",
    storageBucket: "cpa-app-9c58f.firebasestorage.app",
    messagingSenderId: "517949856134",
    appId: "1:517949856134:web:ffeded224b031149cef407",
    measurementId: "G-FLBV8B1GG0"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);

// Set to true to use local emulators instead of production Firebase
// You can also set NEXT_PUBLIC_USE_EMULATORS=true in your .env.local file
const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === 'true';

// Connect to emulators only if explicitly enabled
if (typeof window !== 'undefined' && useEmulators) {
    try {
        connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
        connectFunctionsEmulator(functions, "localhost", 5001);
        console.log("Connected to Firebase emulators (Auth, Functions)");
    } catch (e) {
        // Emulators already connected
        console.log("Emulators already connected");
    }
}

// Initialize Data Connect
// We use a try-catch because the generated SDK might not be there yet during initial setup
let dc: DataConnect | undefined;
try {
    dc = getDataConnect(app, connectorConfig);
    // Connect to Data Connect emulator only if explicitly enabled
    if (typeof window !== 'undefined' && useEmulators) {
        try {
            connectDataConnectEmulator(dc, 'localhost', 9399);
            console.log("Connected to Data Connect emulator");
        } catch (e) {
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

export { app, auth, functions, dc, getDc };
