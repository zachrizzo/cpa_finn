export const TEST_DATA = {
  // NP User
  NP_EMAIL: 'testnp@example.com',
  NP_PASSWORD: 'testpass123',
  NP_NAME: 'Sarah Johnson',

  // Physician User
  PHYSICIAN_EMAIL: 'testphysician@example.com',
  PHYSICIAN_PASSWORD: 'testpass123',
  PHYSICIAN_NAME: 'Dr. Michael Smith',

  // License Data
  NP_LICENSE_TX: {
    number: 'NP123456TX',
    type: 'NP',
    issueDate: '2020-01-01',
    expirationDate: '2025-12-31',
    supervisedHours: 5000,
    supervisedYears: 4,
  },

  PHYSICIAN_LICENSE_TX: {
    number: 'MD789012TX',
    type: 'MD',
    issueDate: '2010-01-01',
    expirationDate: '2026-12-31',
  },

  // Directory Data
  NP_DIRECTORY: {
    seekingStates: 'TX,CA,IL',
    licensedStates: 'TX,CA',
    cpaNeededStates: 'TX',
    specialty: 'Family Medicine',
    hoursPerWeek: 40,
    yearsExperience: 5,
    compensationModel: 'hourly',
  },

  PHYSICIAN_DIRECTORY: {
    availableStates: 'TX,CA,IL',
    preferredStates: 'TX,CA',
    specialty: 'Family Medicine',
    capacity: 7,
    currentCount: 2,
    availableSpots: 5,
    hourlyRate: 150,
    yearsSupervising: 10,
    supervisionModel: 'collaborative',
  },

  // States for testing
  STATES: {
    TEXAS: 'TX',
    CALIFORNIA: 'CA',
    ILLINOIS: 'IL',
  },
} as const;
