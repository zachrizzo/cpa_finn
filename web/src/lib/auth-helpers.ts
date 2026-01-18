import { auth, dc } from "./firebase";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { upsertUserProfile, createPhysicianDirectory, createNpDirectory } from "@dataconnect/generated";

const DEFAULT_DIRECTORY_CONFIG = {
    physician: {
        availableStates: "CA,TX,NY,FL",
        specialtyType: "Family Medicine",
        maxNPs: 5,
        currentNPCount: 0,
        availableForNewNPs: true,
        supervisionModel: "collaborative",
    },
    np: {
        seekingStates: "CA,TX,NY,FL",
        licensedStates: "CA",
        specialtyType: "Family Medicine",
        needsCPA: true,
        cpaNeededStates: "CA,TX,NY,FL",
    },
} as const;

async function createDirectoryProfile(role: string): Promise<void> {
    if (!dc) return;

    if (role === "PHYSICIAN") {
        await createPhysicianDirectory(dc, DEFAULT_DIRECTORY_CONFIG.physician);
        console.log("Physician directory profile created successfully");
    } else if (role === "NP") {
        await createNpDirectory(dc, DEFAULT_DIRECTORY_CONFIG.np);
        console.log("NP directory profile created successfully");
    }
}

async function syncUserToDataConnect(displayName: string, role: string): Promise<void> {
    if (!dc) {
        console.error("Data Connect instance is not initialized.");
        return;
    }

    await upsertUserProfile(dc, { displayName, role });
    console.log("User synced to Data Connect successfully");
    await createDirectoryProfile(role);
}

export async function signUpUser(
    email: string,
    password: string,
    displayName: string,
    role: string
) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
    }

    try {
        await syncUserToDataConnect(displayName, role);
    } catch (error) {
        console.error("Failed to sync user to Data Connect:", error);
    }

    return userCredential.user;
}

export async function signInWithGoogle(role?: string) {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (role) {
        try {
            await syncUserToDataConnect(user.displayName || "Google User", role);
        } catch (error) {
            console.error("Failed to sync Google user to Data Connect:", error);
        }
    }

    return user;
}
