import { onCall, HttpsError } from "firebase-functions/v2/https";
import {
    getProviderDirectoryProfile,
    getActiveCpaCount,
    getStateRatio,
    updatePhysicianDirectoryProfile
} from "./dataconnect-admin-generated";

/**
 * Cloud Function to check if a physician has capacity to accept a new NP
 * in a specific state based on state ratio limits and current CPA count.
 */
export const checkPhysicianCapacity = onCall(async (request) => {
    const { physicianId, stateCode } = request.data;

    // Validate input
    if (!physicianId || !stateCode) {
        throw new HttpsError(
            "invalid-argument",
            "physicianId and stateCode are required"
        );
    }

    try {
        // 1. Get physician's directory profile
        const physicianResult = await getProviderDirectoryProfile({ userId: physicianId });
        const physicianProfile = physicianResult.data?.providerDirectory;

        if (!physicianProfile) {
            return {
                available: false,
                currentCount: 0,
                maxCount: 0,
                reason: "Physician does not have an active directory profile",
                stateRatio: "N/A",
            };
        }

        // Check if physician is available in this state
        const availableStates = physicianProfile.availableStates?.split(",") || [];
        if (!availableStates.includes(stateCode)) {
            return {
                available: false,
                currentCount: physicianProfile.currentNpCount || 0,
                maxCount: physicianProfile.totalNpCapacity || 0,
                reason: `Physician is not available in ${stateCode}`,
                stateRatio: "N/A",
            };
        }

        // 2. Get count of active CPAs for this physician in this state
        const cpaResult = await getActiveCpaCount({ physicianId, stateCode });
        const currentCount = cpaResult.data?.collaborationAgreements?.length || 0;

        // 3. Get state's ratio limit
        const stateResult = await getStateRatio({ stateCode });
        const stateData = stateResult.data?.states?.[0];

        if (!stateData) {
            throw new HttpsError("not-found", `State ${stateCode} not found`);
        }

        // 4. Check if under capacity
        const hasRatioLimit = stateData.hasRatioLimit;
        const stateRatio = stateData.physicianNpRatio || "No limit";

        let maxCount = physicianProfile.totalNpCapacity || 0;
        let available = false;
        let reason = "";

        if (!hasRatioLimit) {
            // No state ratio limit, only check physician's self-imposed capacity
            available = currentCount < maxCount;
            reason = available
                ? `Physician has ${maxCount - currentCount} spots available (no state ratio limit)`
                : `Physician at capacity (${currentCount}/${maxCount}), ${stateCode} has no ratio limit`;
        } else {
            // Parse ratio limit (e.g., "1:4" means 1 physician can supervise up to 4 NPs)
            const ratioMatch = stateRatio.match(/1:(\d+)/);
            const stateMaxNPs = ratioMatch ? parseInt(ratioMatch[1]) : 0;

            // Use the more restrictive limit
            maxCount = Math.min(maxCount, stateMaxNPs);
            available = currentCount < maxCount;

            if (available) {
                reason = `Physician has ${maxCount - currentCount} spots available (State limit: ${stateRatio}, Physician capacity: ${physicianProfile.totalNpCapacity})`;
            } else {
                if (currentCount >= stateMaxNPs) {
                    reason = `Physician at state ratio limit (${currentCount}/${stateMaxNPs} for ${stateCode})`;
                } else {
                    reason = `Physician at capacity (${currentCount}/${maxCount})`;
                }
            }
        }

        return {
            available,
            currentCount,
            maxCount,
            reason,
            stateRatio,
        };

    } catch (error: any) {
        console.error("Error checking physician capacity:", error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError(
            "internal",
            `Failed to check physician capacity: ${error.message}`
        );
    }
});

/**
 * Cloud Function to update physician capacity after a CPA is created or terminated
 */
export const updatePhysicianCapacity = onCall(async (request) => {
    const { physicianId, increment } = request.data;

    if (!physicianId || increment === undefined) {
        throw new HttpsError(
            "invalid-argument",
            "physicianId and increment are required"
        );
    }

    try {
        // Get current profile
        const result = await getProviderDirectoryProfile({ userId: physicianId });
        const profile = result.data?.providerDirectory;

        if (!profile) {
            throw new HttpsError("not-found", "Physician profile not found");
        }

        const newCount = Math.max(0, (profile.currentNpCount || 0) + increment);
        const availableSpots = Math.max(0, (profile.totalNpCapacity || 0) - newCount);

        // Update profile
        await updatePhysicianDirectoryProfile({
            userId: physicianId,
            currentNpCount: newCount,
            availableSpots
        });

        return {
            success: true,
            newCount,
            availableSpots,
        };

    } catch (error: any) {
        console.error("Error updating physician capacity:", error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError(
            "internal",
            `Failed to update physician capacity: ${error.message}`
        );
    }
});
