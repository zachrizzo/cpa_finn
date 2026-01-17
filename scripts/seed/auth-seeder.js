#!/usr/bin/env node

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const TEST_USERS_PATH = path.join(__dirname, 'test-users.json');
const PROJECT_ID = 'cpa-app-9c58f';

// =============================================================================
// NAME POOLS FOR PROGRAMMATIC GENERATION
// =============================================================================

const FIRST_NAMES_FEMALE = [
  'Sarah', 'Maria', 'Jennifer', 'Ashley', 'Jessica', 'Amanda', 'Stephanie', 'Nicole',
  'Elizabeth', 'Rachel', 'Michelle', 'Kimberly', 'Lisa', 'Angela', 'Melissa', 'Brenda',
  'Amy', 'Rebecca', 'Laura', 'Kathleen', 'Sandra', 'Nancy', 'Betty', 'Dorothy',
  'Margaret', 'Helen', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Patricia', 'Susan',
  'Barbara', 'Karen', 'Linda', 'Emily', 'Megan', 'Hannah', 'Samantha', 'Christina',
  'Lauren', 'Heather', 'Amber', 'Danielle', 'Brittany', 'Kelly', 'Victoria', 'Olivia',
  'Emma', 'Sophia'
];

const FIRST_NAMES_MALE = [
  'Michael', 'David', 'James', 'John', 'Robert', 'William', 'Richard', 'Joseph',
  'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald',
  'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George',
  'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan', 'Jacob', 'Gary',
  'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon',
  'Benjamin', 'Samuel', 'Raymond', 'Gregory', 'Frank', 'Alexander', 'Patrick', 'Jack',
  'Dennis', 'Jerry'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Chen', 'Kim', 'Park', 'Patel', 'Shah', 'Singh', 'Kumar',
  'Sharma', 'Wang', 'Li', 'Zhang', 'Liu', 'Yang', 'Huang', 'Wu', 'Zhou', 'Sun',
  'Murphy', 'Kelly', 'O\'Brien', 'Sullivan', 'Cohen', 'Goldstein', 'Schwartz'
];

/**
 * Firebase Auth Seeder - Creates test users in Firebase Auth
 * and captures their UIDs for use in Data Connect seeding
 */
class AuthSeeder {
  constructor(options = {}) {
    this.useEmulator = options.useEmulator !== false;
    this.adminApp = null;
    this.createdUsers = new Map(); // key -> { uid, email, displayName, role }
    this.usedNames = new Set(); // Track used names to avoid duplicates
  }

  async initialize() {
    if (this.useEmulator) {
      process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
    }

    if (!admin.apps.length) {
      this.adminApp = admin.initializeApp({ projectId: PROJECT_ID });
    } else {
      this.adminApp = admin.app();
    }
  }

  /**
   * Generate a unique name that hasn't been used yet
   */
  generateUniqueName(isFemale = true) {
    const firstNames = isFemale ? FIRST_NAMES_FEMALE : FIRST_NAMES_MALE;
    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const fullName = `${firstName} ${lastName}`;

      if (!this.usedNames.has(fullName)) {
        this.usedNames.add(fullName);
        return { firstName, lastName, fullName };
      }
      attempts++;
    }

    // Fallback: add a number suffix
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const suffix = Math.floor(Math.random() * 1000);
    const fullName = `${firstName} ${lastName} ${suffix}`;
    this.usedNames.add(fullName);
    return { firstName, lastName, fullName };
  }

  /**
   * Generate users programmatically for massive scale testing
   */
  generateMassiveUsers(npCount = 50, physicianCount = 50) {
    const users = [];

    // First, add the fixed login test users (np1, np2, physician1, physician2)
    const fixedUsers = [
      { key: 'np1', email: 'np1@test.finn.dev', password: 'testpass123', displayName: 'Sarah Johnson NP', role: 'np' },
      { key: 'np2', email: 'np2@test.finn.dev', password: 'testpass123', displayName: 'Maria Garcia NP', role: 'np' },
      { key: 'physician1', email: 'physician1@test.finn.dev', password: 'testpass123', displayName: 'Dr. Michael Smith', role: 'physician' },
      { key: 'physician2', email: 'physician2@test.finn.dev', password: 'testpass123', displayName: 'Dr. Emily Chen', role: 'physician' }
    ];

    // Mark these names as used
    this.usedNames.add('Sarah Johnson');
    this.usedNames.add('Maria Garcia');
    this.usedNames.add('Michael Smith');
    this.usedNames.add('Emily Chen');

    users.push(...fixedUsers);

    // Generate remaining NPs (np3 to npN)
    for (let i = 3; i <= npCount; i++) {
      const { fullName } = this.generateUniqueName(true); // NPs are predominantly female
      users.push({
        key: `np${i}`,
        email: `np${i}@test.finn.dev`,
        password: 'testpass123',
        displayName: `${fullName} NP`,
        role: 'np'
      });
    }

    // Generate remaining physicians (physician3 to physicianN)
    for (let i = 3; i <= physicianCount; i++) {
      const isFemale = Math.random() < 0.4; // 40% female physicians
      const { fullName } = this.generateUniqueName(isFemale);
      users.push({
        key: `physician${i}`,
        email: `physician${i}@test.finn.dev`,
        password: 'testpass123',
        displayName: `Dr. ${fullName}`,
        role: 'physician'
      });
    }

    return users;
  }

  async seedUsers(profileName = 'basic') {
    const testUsers = JSON.parse(fs.readFileSync(TEST_USERS_PATH, 'utf8'));

    // Handle special "massive" profile for programmatic generation
    if (profileName === 'massive') {
      const massiveConfig = testUsers.profiles.massive || { npCount: 50, physicianCount: 50 };
      const generatedUsers = this.generateMassiveUsers(massiveConfig.npCount, massiveConfig.physicianCount);

      console.log(`  Generating ${generatedUsers.length} users programmatically...`);

      // Process users in batches for better performance
      const batchSize = 10;
      for (let i = 0; i < generatedUsers.length; i += batchSize) {
        const batch = generatedUsers.slice(i, Math.min(i + batchSize, generatedUsers.length));
        await Promise.all(batch.map(async (user) => {
          const uid = await this.createOrGetUser(user);
          this.createdUsers.set(user.key, {
            uid,
            email: user.email,
            displayName: user.displayName,
            role: user.role
          });
        }));

        // Progress indicator
        const progress = Math.min(i + batchSize, generatedUsers.length);
        process.stdout.write(`\r  Created ${progress}/${generatedUsers.length} users`);
      }
      console.log(''); // New line after progress

      return this.createdUsers;
    }

    // Standard profile handling
    const userKeys = testUsers.profiles[profileName];

    if (!userKeys || userKeys.length === 0) {
      console.log('   No users to seed for this profile');
      return this.createdUsers;
    }

    const usersToCreate = testUsers.users.filter(u => userKeys.includes(u.key));

    for (const user of usersToCreate) {
      const uid = await this.createOrGetUser(user);
      this.createdUsers.set(user.key, {
        uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role
      });
    }

    return this.createdUsers;
  }

  async createOrGetUser(userData) {
    const auth = admin.auth(this.adminApp);

    try {
      // Try to get existing user
      const existing = await auth.getUserByEmail(userData.email);
      // Suppress verbose logging for massive seeding
      if (this.createdUsers.size < 20) {
        console.log(`  + Found existing user: ${userData.email} (${existing.uid})`);
      }
      return existing.uid;
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new user
        const newUser = await auth.createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.displayName,
          emailVerified: true
        });
        // Suppress verbose logging for massive seeding
        if (this.createdUsers.size < 20) {
          console.log(`  + Created user: ${userData.email} (${newUser.uid})`);
        }
        return newUser.uid;
      }
      throw error;
    }
  }

  async deleteAllTestUsers() {
    const auth = admin.auth(this.adminApp);

    // For massive profile, we need to delete programmatically generated users too
    // List all users and delete those matching our pattern
    let deletedCount = 0;
    let nextPageToken;

    console.log('  Scanning for test users to delete...');

    do {
      const listResult = await auth.listUsers(1000, nextPageToken);

      const testUserUids = listResult.users
        .filter(user => user.email && user.email.endsWith('@test.finn.dev'))
        .map(user => user.uid);

      if (testUserUids.length > 0) {
        // Delete in batches
        const deleteResult = await auth.deleteUsers(testUserUids);
        deletedCount += deleteResult.successCount;

        if (deleteResult.failureCount > 0) {
          console.log(`  ! ${deleteResult.failureCount} users failed to delete`);
        }
      }

      nextPageToken = listResult.pageToken;
    } while (nextPageToken);

    console.log(`  + Deleted ${deletedCount} test users`);
  }

  exportMapping() {
    // Convert Map to object for JSON serialization
    const mapping = {};
    for (const [key, value] of this.createdUsers) {
      mapping[key] = value;
    }
    return mapping;
  }
}

module.exports = AuthSeeder;
