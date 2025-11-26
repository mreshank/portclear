#!/usr/bin/env node
'use strict';

/**
 * Helper script to publish portclear under multiple package names
 * Usage: node publish-all.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PACKAGE_ALIASES = [
  'portclear',    // Primary package
  'port-clear',
  'portkill',
  'pkill-port',
  'portstop',
  'port-nuke',
  'port-eject'
];

const PACKAGE_JSON_PATH = path.join(__dirname, 'package.json');
const PACKAGE_BACKUP_PATH = path.join(__dirname, 'package.json.backup');

// Read original package.json
const originalPackage = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));

console.log('🚀 Multi-Package Publisher for portclear\n');
console.log('This will publish under the following package names:');
PACKAGE_ALIASES.forEach((alias, i) => console.log(`  ${i + 1}. ${alias}`));
console.log('');

// Backup original package.json
fs.writeFileSync(PACKAGE_BACKUP_PATH, JSON.stringify(originalPackage, null, 2));
console.log('✓ Backed up package.json\n');

// Publish each alias
for (const alias of PACKAGE_ALIASES) {
  console.log(`📦 Publishing ${alias}...`);
  
  // Update package.json with new name
  const modifiedPackage = {
    ...originalPackage,
    name: alias,
    repository: {
      ...originalPackage.repository,
      url: originalPackage.repository.url.replace('portclear', alias)
    },
    bugs: {
      url: originalPackage.bugs.url.replace('portclear', alias)
    },
    homepage: originalPackage.homepage.replace('portclear', alias)
  };
  
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(modifiedPackage, null, 2));
  
  try {
    // Publish to npm
    execSync('npm publish', { stdio: 'inherit' });
    console.log(`✓ Successfully published ${alias}\n`);
  } catch (error) {
    console.error(`✗ Failed to publish ${alias}`);
    console.error(error.message);
    console.log('');
  }
}

// Restore original package.json
try {
  if (fs.existsSync(PACKAGE_BACKUP_PATH)) {
    fs.writeFileSync(PACKAGE_JSON_PATH, fs.readFileSync(PACKAGE_BACKUP_PATH, 'utf8'));
    fs.unlinkSync(PACKAGE_BACKUP_PATH);
    console.log('✓ Restored original package.json');
  } else {
    // Backup doesn't exist, restore from original
    fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(originalPackage, null, 2));
    console.log('✓ Restored original package.json from memory');
  }
} catch (error) {
  console.error('⚠️  Error restoring package.json:', error.message);
  console.log('Please manually restore package.json to:');
  console.log(JSON.stringify(originalPackage, null, 2));
}

console.log('\n🎉 Publishing complete!');
console.log('\nVerify packages at:');
PACKAGE_ALIASES.forEach(alias => {
  console.log(`  https://www.npmjs.com/package/${alias}`);
});
