'use strict';

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * Kill process running on specified port
 * @param {number|string} port - Port number to kill
 * @param {string|object} methodOrOptions - Protocol method ('tcp'/'udp') or options object
 * @returns {Promise<object>} Result object with stdout, stderr, port, and metadata
 */
async function portClear(port, methodOrOptions = {}) {
  // Handle backward compatibility: portClear(3000, 'tcp')
  let options = {};
  if (typeof methodOrOptions === 'string') {
    options = { method: methodOrOptions };
  } else if (typeof methodOrOptions === 'object') {
    options = methodOrOptions;
  }

  // Set defaults
  const {
    method = 'tcp',
    list = false,
    tree = false
  } = options;

  // Validate port
  port = parseInt(port, 10);
  
  if (!port || isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid port number: ${port}. Port must be between 1 and 65535.`);
  }

  // Validate method
  const normalizedMethod = method.toLowerCase();
  if (normalizedMethod !== 'tcp' && normalizedMethod !== 'udp') {
    throw new Error(`Invalid method: ${method}. Method must be 'tcp' or 'udp'.`);
  }

  const platform = process.platform;

  try {
    if (platform === 'win32') {
      return await (list ? listPortWindows : killPortWindows)(port, normalizedMethod, tree);
    } else {
      return await (list ? listPortUnix : killPortUnix)(port, normalizedMethod, tree);
    }
  } catch (error) {
    // Re-throw with more context
    if (error.message.includes('No process running')) {
      throw error;
    }
    if (error.code === 'EACCES' || error.code === 'EPERM' || error.message.includes('Operation not permitted')) {
      const suggestion = platform === 'win32' 
        ? 'Try running as Administrator'
        : 'Try running with sudo: sudo npx portkill ' + port;
      throw new Error(`Permission denied for port ${port}. ${suggestion}`);
    }
    throw new Error(`Failed to kill process on port ${port}: ${error.message}`);
  }
}

/**
 * List process info on Windows
 */
async function listPortWindows(port, method) {
  const findCommand = 'netstat -ano';
  const { stdout: netstatOutput } = await execAsync(findCommand);

  if (!netstatOutput) {
    return createResult(port, false, null, 'No process running on port');
  }

  const lines = netstatOutput.split('\n');
  const protocol = method.toUpperCase();
  const portRegex = new RegExp(`^\\s*${protocol}\\s+[^:]*:${port}\\s`, 'gm');
  const matchingLines = lines.filter(line => portRegex.test(line));

  if (matchingLines.length === 0) {
    return createResult(port, false, null, 'No process running on port');
  }

  const pids = extractPidsWindows(matchingLines);
  return createResult(port, false, pids, null, 'win32', null, true);
}

/**
 * List process info on Unix
 */
async function listPortUnix(port, method) {
  try {
    const { stdout } = await execAsync(`lsof -i :${port}`);
    const lines = stdout.split('\n').filter(l => l.trim());
    
    if (lines.length <= 1) {
      return createResult(port, false, null, 'No process running on port');
    }

    // Parse lsof output to get process info
    const processLine = lines[1]; // First data line after header
    const parts = processLine.split(/\s+/);
    const name = parts[0];
    const pid = parseInt(parts[1], 10);

    return createResult(port, false, [pid], null, process.platform, name, true);
  } catch (error) {
    return createResult(port, false, null, 'No process running on port');
  }
}

/**
 * Kill port on Windows systems
 */
async function killPortWindows(port, method, tree) {
  const findCommand = 'netstat -ano';
  const { stdout: netstatOutput } = await execAsync(findCommand);

  if (!netstatOutput) {
    throw new Error(`No process running on port ${port}`);
  }

  const lines = netstatOutput.split('\n');
  const protocol = method.toUpperCase();
  const portRegex = new RegExp(`^\\s*${protocol}\\s+[^:]*:${port}\\s`, 'gm');
  const matchingLines = lines.filter(line => portRegex.test(line));

  if (matchingLines.length === 0) {
    throw new Error(`No process running on port ${port}`);
  }

  const pids = extractPidsWindows(matchingLines);

  if (pids.length === 0) {
    throw new Error(`No process running on port ${port}`);
  }

  // Kill all processes
  const killCommand = tree 
    ? `taskkill /F /T /PID ${pids.join(' /PID ')}`  // /T kills process tree
    : `taskkill /F /PID ${pids.join(' /PID ')}`;
  
  const result = await execAsync(killCommand);

  return createResult(port, true, pids, null, 'win32', null, false, result.stdout, result.stderr);
}

/**
 * Kill port on Unix-like systems
 */
async function killPortUnix(port, method, tree) {
  // Check if process exists on port
  try {
    await execAsync(`lsof -i :${port}`);
  } catch (error) {
    throw new Error(`No process running on port ${port}`);
  }

  // Find PIDs
  const { stdout: pidOutput } = await execAsync(`lsof -ti :${port}`);
  const pids = pidOutput.trim().split('\n').map(p => parseInt(p, 10)).filter(p => !isNaN(p));

  if (pids.length === 0) {
    throw new Error(`No process running on port ${port}`);
  }

  // Get process name from first PID
  let name = null;
  try {
    const { stdout } = await execAsync(`ps -p ${pids[0]} -o comm=`);
    name = stdout.trim();
  } catch (e) {
    // Ignore if we can't get process name
  }

  // Kill processes
  let killCommand;
  if (tree) {
    // Kill process tree (get children too)
    killCommand = pids.map(pid => `pkill -9 -P ${pid}; kill -9 ${pid}`).join('; ');
  } else {
    killCommand = `kill -9 ${pids.join(' ')}`;
  }
  
  const result = await execAsync(killCommand);

  return createResult(port, true, pids, null, process.platform, name, false, result.stdout, result.stderr);
}

/**
 * Extract PIDs from Windows netstat output
 */
function extractPidsWindows(lines) {
  const pids = [];
  lines.forEach(line => {
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid && !isNaN(pid) && !pids.includes(pid)) {
      pids.push(pid);
    }
  });
  return pids;
}

/**
 * Create standardized result object
 */
function createResult(port, killed, pids, error, platform, name, isList, stdout, stderr) {
  const result = {
    port: port,
    killed: killed,
    platform: platform || process.platform
  };

  if (pids && pids.length > 0) {
    result.pids = pids;
    if (pids.length === 1) {
      result.pid = pids[0];
    }
  }

  if (name) {
    result.name = name;
  }

  if (error) {
    result.error = error;
  }

  if (stdout) {
    result.stdout = stdout;
  }

  if (stderr) {
    result.stderr = stderr;
  }

  if (isList) {
    result.listing = true;
  }

  return result;
}

module.exports = portClear;
module.exports.default = portClear;
