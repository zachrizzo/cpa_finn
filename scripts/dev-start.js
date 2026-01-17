#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const profile = process.argv[2] || 'basic';
const cleanStart = process.argv.includes('--clean');

console.log('\n🚀 Starting FINN Development Environment');
console.log(`   Profile: ${profile}`);
console.log(`   Clean start: ${cleanStart ? 'Yes' : 'No'}\n`);

async function main() {
  // Step 1: Clean if requested
  if (cleanStart) {
    console.log('🧹 Cleaning previous data...');
    const dirsToClean = [
      '.firebase',
      'dataconnect/.dataconnect/pgliteData'
    ];

    dirsToClean.forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`   ✓ Removed ${dir}`);
      }
    });
    console.log('');
  }

  // Step 2: Generate seed data from current schema
  console.log('🌱 Generating seed data from schema...');
  try {
    await runCommand('node', [path.join(__dirname, 'seed/seed-generator.js'), profile]);
  } catch (error) {
    console.error('❌ Failed to generate seed data');
    process.exit(1);
  }

  // Step 3: Start emulators in background
  console.log('\n🔥 Starting Firebase Emulators...');

  const emulators = spawn('npx', ['firebase-tools', 'emulators:start'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
    detached: false
  });

  // Capture emulator output
  emulators.stdout.on('data', (data) => {
    if (data.toString().includes('All emulators ready')) {
      console.log('   ✅ Emulators ready!\n');
    }
  });

  // Wait for emulators to be ready
  console.log('   ⏳ Waiting for emulators to initialize...');
  await sleep(20000);

  // Step 4: Execute generated seed
  console.log('📊 Seeding database...');
  console.log('   ⚠️  Note: Execute seed manually with the Firebase Emulator UI');
  console.log('   Or use: npx firebase-tools dataconnect:execute dataconnect/example/seed.gql SeedStates');
  console.log('   The schema-aware seed is at: dataconnect/example/seed-generated.gql\n');

  // Step 5: Start web server
  console.log('⚛️  Starting Next.js Dev Server...');
  const web = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '../web'),
    stdio: 'inherit',
    shell: true
  });

  console.log('\n' + '='.repeat(60));
  console.log('✅ Development environment ready!');
  console.log('='.repeat(60));
  console.log('📱 Web App:      http://localhost:3000');
  console.log('🔧 Emulator UI:  http://localhost:4000');
  console.log('🔍 Auth:         http://localhost:4000/auth');
  console.log('💾 Data Connect: http://localhost:4000/dataconnect');
  console.log('📦 Storage:      http://localhost:4000/storage');
  console.log('='.repeat(60));
  console.log('\nPress Ctrl+C to stop all services\n');

  // Handle cleanup
  const cleanup = () => {
    console.log('\n\n🛑 Shutting down services...');
    try {
      emulators.kill('SIGTERM');
      web.kill('SIGTERM');
    } catch (e) {
      // Ignore errors during cleanup
    }
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  // Keep process alive
  await new Promise(() => {});
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function runCommand(cmd, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: 'inherit', shell: true });
    proc.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

main().catch(error => {
  console.error('\n❌ Failed to start development environment:', error.message);
  process.exit(1);
});
