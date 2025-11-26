#!/usr/bin/env node
'use strict';

const http = require('http');
const portClear = require('../index.js');

/**
 * Simple test suite for portkill
 */

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ ${message}`);
    testsPassed++;
  } else {
    console.error(`✗ ${message}`);
    testsFailed++;
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Test 1: Invalid port number
 */
async function testInvalidPort() {
  console.log('\n--- Test 1: Invalid Port ---');
  
  try {
    await portClear('invalid');
    assert(false, 'Should throw error for invalid port');
  } catch (error) {
    assert(error.message.includes('Invalid port'), 'Throws error for invalid port');
  }

  try {
    await portClear(0);
    assert(false, 'Should throw error for port 0');
  } catch (error) {
    assert(error.message.includes('Invalid port'), 'Throws error for port 0');
  }

  try {
    await portClear(70000);
    assert(false, 'Should throw error for port > 65535');
  } catch (error) {
    assert(error.message.includes('Invalid port'), 'Throws error for port > 65535');
  }
}

/**
 * Test 2: No process on port
 */
async function testNoProcess() {
  console.log('\n--- Test 2: No Process on Port ---');
  
  // Use a random high port that's unlikely to be in use
  const unusedPort = 62345;
  
  try {
    await portClear(unusedPort);
    assert(false, 'Should throw error when no process on port');
  } catch (error) {
    assert(error.message.includes('No process running'), 'Throws error when no process found');
  }
}

/**
 * Test 3: Kill actual process
 */
async function testKillProcess() {
  console.log('\n--- Test 3: Kill Actual Process ---');
  
  const testPort = 63333;
  const { spawn } = require('child_process');
  
  // Create a simple HTTP server in a child process
  const serverCode = `
    const http = require('http');
    const server = http.createServer((req, res) => {
      res.writeHead(200);
      res.end('Test server');
    });
    server.listen(${testPort}, () => {
      console.log('READY');
    });
    // Keep process alive
    setInterval(() => {}, 1000);
  `;

  const serverProcess = spawn('node', ['-e', serverCode]);
  
  // Wait for server to be ready
  await new Promise((resolve) => {
    serverProcess.stdout.on('data', (data) => {
      if (data.toString().includes('READY')) {
        console.log(`Test server started on port ${testPort} (PID: ${serverProcess.pid})`);
        resolve();
      }
    });
  });

  // Give server time to fully start
  await sleep(200);

  // Kill the process using our package
  try {
    await portClear(testPort);
    assert(true, `Successfully killed process on port ${testPort}`);
  } catch (error) {
    assert(false, `Failed to kill process: ${error.message}`);
    serverProcess.kill();
    return;
  }

  // Wait a bit for port to be fully released
  await sleep(200);

  // Verify server is dead by trying to connect
  try {
    // Try to start a new server on the same port
    const testServer = http.createServer();
    await new Promise((resolve, reject) => {
      testServer.listen(testPort, () => {
        testServer.close();
        resolve();
      });
      testServer.on('error', reject);
      setTimeout(() => reject(new Error('Timeout')), 1000);
    });
    assert(true, 'Port is available after killing process');
  } catch (error) {
    assert(false, `Port still in use: ${error.message}`);
    // Cleanup just in case
    try { serverProcess.kill(); } catch (e) {}
  }
}

/**
 * Test 4: Invalid method
 */
async function testInvalidMethod() {
  console.log('\n--- Test 4: Invalid Method ---');
  
  try {
    await portClear(3000, 'invalid');
    assert(false, 'Should throw error for invalid method');
  } catch (error) {
    assert(error.message.includes('Invalid method'), 'Throws error for invalid method');
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('===========================================');
  console.log('         portkill Test Suite');
  console.log('===========================================');

  try {
    await testInvalidPort();
    await testNoProcess();
    await testKillProcess();
    await testInvalidMethod();
  } catch (error) {
    console.error('Unexpected error during tests:', error);
    testsFailed++;
  }

  console.log('\n===========================================');
  console.log('             Test Results');
  console.log('===========================================');
  console.log(`Passed: ${testsPassed}`);
  console.log(`Failed: ${testsFailed}`);
  console.log(`Total:  ${testsPassed + testsFailed}`);
  console.log('===========================================\n');

  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
runTests();
