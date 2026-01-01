import { initializeAdminSDK, captureUserUID } from './auth-helpers.js';
import { seedNPData, seedPhysicianData, seedCollaborationData } from './seed-helpers.js';

async function testSeeding() {
  console.log('=== Testing Seeding Infrastructure ===\n');

  try {
    // Initialize
    await initializeAdminSDK();
    console.log('✓ Admin SDK initialized\n');

    // Test with mock UIDs (you can replace these with real UIDs from emulator)
    const mockNpUid = '00000000-0000-0000-0000-000000000001';
    const mockPhysicianUid = '00000000-0000-0000-0000-000000000002';

    console.log('Testing NP data seeding...');
    await seedNPData(mockNpUid);
    console.log('✓ NP seeding complete\n');

    console.log('Testing Physician data seeding...');
    await seedPhysicianData(mockPhysicianUid);
    console.log('✓ Physician seeding complete\n');

    console.log('Testing collaboration data seeding...');
    const agreementId = await seedCollaborationData(mockNpUid, mockPhysicianUid);
    console.log(`✓ Collaboration seeding complete (Agreement ID: ${agreementId})\n`);

    console.log('=== All Seeding Tests Passed! ===');
  } catch (error) {
    console.error('Seeding test failed:', error);
    process.exit(1);
  }
}

testSeeding();
