import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getLicenseWithFpaEligibility } from '@dataconnect/admin-generated';

function pluralize(count: number, singular: string): string {
  return count === 1 ? singular : `${singular}s`;
}

export const calculateFPAEligibility = onCall<{ licenseId: string }>(
  async (request) => {
    const { licenseId } = request.data;
    const userId = request.auth?.uid;

    if (!userId) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    if (!licenseId) {
      throw new HttpsError('invalid-argument', 'licenseId is required');
    }

    try {
      // Query license with FPA eligibility info using Data Connect
      const licenseResult = await getLicenseWithFpaEligibility({ licenseId });

      if (!licenseResult.data.license) {
        throw new HttpsError('not-found', 'License not found');
      }

      const license = licenseResult.data.license;
      const state = license.state;

      if (!state) {
        throw new HttpsError('internal', 'Invalid state data');
      }

      // Apply FPA eligibility logic

      // Automatic FPA states (AK, DC, NH, OR, RI, UT, WY)
      if (state.fpaAutomaticWithLicense === true) {
        return {
          status: 'fpa_automatic',
          notes: `${state.stateName} grants automatic FPA with NP license. No additional requirements!`,
        };
      }

      // No FPA available (NJ, WI)
      if (state.fpaAvailable === false) {
        return {
          status: 'cpa_required',
          notes: `${state.stateName} always requires a CPA. No FPA route available.`,
        };
      }

      // Special case: CA (3 years AND 4600 hours IN-STATE)
      if (state.stateCode === 'CA') {
        const hours = license.supervisedHoursInState || 0;
        const years = license.supervisedYearsInState || 0;

        if (hours >= 4600 && years >= 3) {
          return {
            status: 'fpa_eligible_now',
            notes: 'CA: You have met both requirements (3 years AND 4600 hours)! Apply for FPA now!',
          };
        }

        const hoursRemaining = Math.max(0, 4600 - hours);
        const yearsRemaining = Math.max(0, 3 - years);

        return {
          status: 'fpa_eligible_future',
          hoursRemaining,
          yearsRemaining,
          notes: `CA requires 3 years AND 4600 hours of in-state supervised practice. You need ${hoursRemaining} more hours and ${yearsRemaining} more years.`,
        };
      }

      // Check hours requirement (CT: 2000, IL: 4000)
      if (state.fpaHoursRequired && state.fpaHoursRequired > 0) {
        const hoursCompleted = license.supervisedHoursInState || 0;

        if (hoursCompleted >= state.fpaHoursRequired) {
          return {
            status: 'fpa_eligible_now',
            notes: `You have completed ${hoursCompleted} supervised hours (${state.fpaHoursRequired} required). Apply for FPA now!`,
          };
        }

        const hoursRemaining = state.fpaHoursRequired - hoursCompleted;
        const estimatedYears = Math.ceil(hoursRemaining / 2000); // Assuming full-time work (2000 hrs/year)

        return {
          status: 'fpa_eligible_future',
          hoursRemaining,
          notes: `${state.stateName} requires ${state.fpaHoursRequired} supervised hours. You need ${hoursRemaining} more hours (approximately ${estimatedYears} ${pluralize(estimatedYears, 'year')} at full-time).`,
        };
      }

      // Check years requirement (MA: 2 years, VT: 24 months = 2 years)
      if (state.fpaYearsRequired && state.fpaYearsRequired > 0) {
        const yearsCompleted = license.supervisedYearsInState || 0;

        if (yearsCompleted >= state.fpaYearsRequired) {
          return {
            status: 'fpa_eligible_now',
            notes: `You have completed ${yearsCompleted} ${pluralize(yearsCompleted, 'year')} of supervised practice (${state.fpaYearsRequired} ${pluralize(state.fpaYearsRequired, 'year')} required). Apply for FPA now!`,
          };
        }

        const yearsRemaining = state.fpaYearsRequired - yearsCompleted;
        const monthsRemaining = Math.ceil(yearsRemaining * 12);

        return {
          status: 'fpa_eligible_future',
          yearsRemaining,
          notes: `${state.stateName} requires ${state.fpaYearsRequired} ${pluralize(state.fpaYearsRequired, 'year')} of supervised practice. You need ${yearsRemaining.toFixed(1)} more ${pluralize(yearsRemaining, 'year')} (approximately ${monthsRemaining} ${pluralize(monthsRemaining, 'month')}).`,
        };
      }

      // If FPA is available but no specific requirements are set, assume CPA is required until criteria are met
      if (state.fpaAvailable === true) {
        return {
          status: 'cpa_required',
          notes: `${state.stateName} offers FPA, but specific requirements are not yet configured. Contact the state board for details.`,
        };
      }

      // Default case
      return {
        status: 'cpa_required',
        notes: 'Default: CPA required until FPA criteria are met. Check with your state board for specific requirements.',
      };
    } catch (error: any) {
      console.error('Error calculating FPA eligibility:', error);

      if (error instanceof HttpsError) throw error;
      throw new HttpsError('internal', `Failed to calculate FPA eligibility: ${error.message}`);
    }
  }
);
