import { auth, dc } from "./firebase";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { upsertUserProfile, createPhysicianDirectory, createNpDirectory } from "@dataconnect/generated";

export async function signUpUser(email: string, password: string, displayName: string, role: string) {
    // 1. Create User in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // 2. Update Auth Profile (Display Name)
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
    }

    // 3. Sync with Data Connect (User Table)
    // The 'dc' instance is initialized with the app that has the auth instance.
    // Data Connect SDK automatically picks up the ID token from Firebase Auth.
    if (!dc) {
        console.error("Data Connect instance is not initialized.");
        return userCredential.user;
    }

    try {
        await upsertUserProfile(dc, { displayName, role });
        console.log("User synced to Data Connect successfully");

        // Create directory profile so the user appears in the directory immediately
        if (role === "PHYSICIAN") {
            await createPhysicianDirectory(dc, {
                availableStates: "CA,TX,NY,FL", // Default states, user can update later
                specialtyType: "Family Medicine",
                maxNPs: 5,
                currentNPCount: 0,
                availableForNewNPs: true,
                supervisionModel: "collaborative",
            });
            console.log("Physician directory profile created successfully");
        } else if (role === "NP") {
            await createNpDirectory(dc, {
                seekingStates: "CA,TX,NY,FL", // Default states, user can update later
                licensedStates: "CA",
                specialtyType: "Family Medicine",
                needsCPA: true,
                cpaNeededStates: "CA,TX,NY,FL",
            });
            console.log("NP directory profile created successfully");
        }
    } catch (error) {
        console.error("Failed to sync user to Data Connect:", error);
        // Note: Use a more robust error handling approach in production (e.g. queueing, informing user)
        // We treat this as non-fatal for Auth, but fatal for App Logic.
    }

    return userCredential.user;
}

export async function signInWithGoogle(role?: string) {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Sync with Data Connect if a role is provided (registration context)
    // Or just to ensure the user exists in our DB (login context)
    // If role is undefined, we assume the user might already exist or we default to something safely if needed,
    // but typically for login we might just want to upsert with existing data or skip if we assume they registered.
    // However, if it's their first time logging in with Google without explicitly "registering" via our form,
    // they might not have a profile row.
    // Ideally, we should check if they exist, or just upsert.
    // For now, if role is passed, we upsert. If not, we still might want to upsert to ensure consistency.

    if (role && dc) {
        try {
            await upsertUserProfile(dc, { displayName: user.displayName || "Google User", role });

            // Create directory profile so the user appears in the directory immediately
            if (role === "PHYSICIAN") {
                await createPhysicianDirectory(dc, {
                    availableStates: "CA,TX,NY,FL",
                    specialtyType: "Family Medicine",
                    maxNPs: 5,
                    currentNPCount: 0,
                    availableForNewNPs: true,
                    supervisionModel: "collaborative",
                });
                console.log("Physician directory profile created successfully");
            } else if (role === "NP") {
                await createNpDirectory(dc, {
                    seekingStates: "CA,TX,NY,FL",
                    licensedStates: "CA",
                    specialtyType: "Family Medicine",
                    needsCPA: true,
                    cpaNeededStates: "CA,TX,NY,FL",
                });
                console.log("NP directory profile created successfully");
            }
        } catch (error) {
            console.error("Failed to sync Google user to Data Connect:", error);
        }
    }

    return user;
}
