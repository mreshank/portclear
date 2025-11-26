#!/usr/bin/env node
'use strict';

/**
 * Example usage of portkill package
 * Run: node example.js
 */

const portClear = require('./index.js');

async function examples() {
  console.log('portkill - Usage Examples\n');

  // Example 1: Kill process on port 3000
  console.log('Example 1: Kill process on port 3000');
  try {
    await portClear(3000);
    console.log('✓ Successfully killed process on port 3000\n');
  } catch (error) {
    console.log(`ℹ ${error.message}\n`);
  }

  // Example 2: Kill UDP process
  console.log('Example 2: Kill UDP process on port 5353');
  try {
    await portClear(5353, 'udp');
    console.log('✓ Successfully killed UDP process on port 5353\n');
  } catch (error) {
    console.log(`ℹ ${error.message}\n`);
  }

  // Example 3: Error handling
  console.log('Example 3: Handle invalid port gracefully');
  try {
    await portClear('invalid');
  } catch (error) {
    console.log(`✓ Caught error: ${error.message}\n`);
  }

  // Example 4: Kill multiple ports sequentially
  console.log('Example 4: Kill multiple ports');
  const ports = [8000, 8001, 8002];
  
  for (const port of ports) {
    try {
      await portClear(port);
      console.log(`✓ Killed port ${port}`);
    } catch (error) {
      console.log(`ℹ Port ${port}: ${error.message}`);
    }
  }

  console.log('\n✨ All examples completed!');
}

examples();
