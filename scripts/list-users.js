#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = path.join(__dirname, 'seed', 'credentials.json');

function listFromFile() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.log('No credentials file found. Run "npm run seed:auth" first.');
    process.exit(1);
  }

  const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));

  console.log('Test Accounts (password: ' + creds.password + ')');
  console.log('Generated: ' + creds.generatedAt);
  console.log('Profile: ' + creds.profile);
  console.log('='.repeat(70));

  const nps = creds.users.filter(u => u.role === 'np').sort((a,b) => {
    const aNum = parseInt(a.email.match(/\d+/)?.[0] || '0');
    const bNum = parseInt(b.email.match(/\d+/)?.[0] || '0');
    return aNum - bNum;
  });

  const physicians = creds.users.filter(u => u.role === 'physician').sort((a,b) => {
    const aNum = parseInt(a.email.match(/\d+/)?.[0] || '0');
    const bNum = parseInt(b.email.match(/\d+/)?.[0] || '0');
    return aNum - bNum;
  });

  console.log('\nNPs (' + nps.length + '):');
  nps.forEach(u => console.log('  ' + u.email.padEnd(30) + ' | ' + u.displayName));

  console.log('\nPhysicians (' + physicians.length + '):');
  physicians.forEach(u => console.log('  ' + u.email.padEnd(30) + ' | ' + u.displayName));

  console.log('\n' + '='.repeat(70));
  console.log('Total: ' + creds.users.length + ' accounts');
  console.log('\nQuick copy-paste logins:');
  console.log('  NP:        ' + nps[0]?.email + ' / ' + creds.password);
  console.log('  Physician: ' + physicians[0]?.email + ' / ' + creds.password);
}

listFromFile();
