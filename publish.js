#!/usr/bin/env node
/**
 * Publish only the main portkill package
 * The multi-package strategy can be done manually if needed
 */

const { execSync } = require('child_process');

console.log('📦 Publishing portkill@1.0.0...\n');

try {
  execSync('npm publish', { stdio: 'inherit' });
  console.log('\n✅ Successfully published portkill@1.0.0!');
  console.log('\nView at: https://www.npmjs.com/package/portkill');
} catch (error) {
  console.error('\n❌ Publishing failed');
  console.error('Error:', error.message);
  process.exit(1);
}
