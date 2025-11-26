'use strict';

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * Kill process on specified port
 * @param {number|string} port - Port number
 * @param {string|object} methodOrOptions - Method ('tcp'/'udp') or options object
 * @returns {Promise<object>} Result object
 */
async function portClear(port, methodOrOptions = 'tcp') {
  // Parse arguments (backward compatible)
  const options = typeof methodOrOptions === 'string'
    ? { method: methodOrOptions }
    : { method: 'tcp', ...methodOrOptions };

  const { method = 'tcp', list = false, tree = false, strict = false } = options;

  // Validate inputs
  const portNum = parseInt(port, 10);
  if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
    throw new Error(`Invalid port number: ${port}. Port must be between 1 and 65535.`);
  }

  if (!['tcp', 'udp'].includes(method)) {
    throw new Error(`Invalid method: ${method}. Use 'tcp' or 'udp'.`);
  }

  const platform = process.platform;

  try {
    let result;
    if (platform === 'win32') {
      result = list ? await listPortWindows(portNum, method) : await killPortWindows(portNum, method, tree);
    } else {
      result = list ? await listPortUnix(portNum, method) : await killPortUnix(portNum, method, tree);
    }
    return result;
  } catch (error) {
    // Check if error is "no process found"
    const isNoProcess = error.message && (
      error.message.includes('No process running') ||
      error.message.includes('No process found') ||
      error.message.includes('not listening')
    );

    // If no process and not in strict mode, return success (port is free!)
    if (isNoProcess && !strict) {
      return createResult(portNum, false, platform, {
        message: list ? 'No process running on port' : 'Port already free',
        alreadyFree: true
      });
    }

    // Permission errors
    if (error.code === 'EACCES' || error.code === 'EPERM' || error.message.includes('Operation not permitted')) {
      const suggestion = platform === 'win32' 
        ? 'Try running as Administrator'
        : 'Try running with sudo: sudo npx portclear ' + port;
      throw new Error(`Permission denied for port ${port}. ${suggestion}`);
    }
    
    // In strict mode or other errors, throw
    throw new Error(`Failed to kill process on port ${port}: ${error.message}`);
  }
}

/**
 * Helper to create standardized result object
 */
function createResult(port, killed, platform, data = {}) {
  return {
    port: parseInt(port, 10),
    killed,
    platform,
    ...data
  };
}

/**
 * List process info on Windows
 */
async function listPortWindows(port, method) {
  const findCommand = 'netstat -ano';
  const { stdout: netstatOutput } = await execAsync(findCommand);

  if (!netstatOutput) {
    throw new Error(`No process running on port ${port}`);
  }

  const lines = netstatOutput.split('\n');
  const protocol = method.toUpperCase();
  const portRegex = new RegExp(`^\\s*${protocol}\\s+[^:]*:${port}\\s`);
  const matchingLines = lines.filter(line => portRegex.test(line));

  if (matchingLines.length === 0) {
    throw new Error(`No process running on port ${port}`);
  }

  const pids = extractPidsWindows(matchingLines);
  
  if (pids.length === 0) {
    throw new Error(`No process running on port ${port}`);
  }

  return createResult(port, false, 'win32', { pids, pid: pids[0], listing: true });
}

/**
 * List process info on Unix
 */
async function listPortUnix(port, method) {
  try {
    const { stdout } = await execAsync(`lsof -i :${port}`);
    const lines = stdout.split('\n').filter(l => l.trim());
    
    if (lines.length <= 1) {
      throw new Error(`No process running on port ${port}`);
    }

    // Parse lsof output to get process info
    const processLine = lines[1]; // First data line after header
    const parts = processLine.split(/\s+/);
    const name = parts[0];
    const pid = parseInt(parts[1], 10);

    return createResult(port, false, process.platform, { 
      pids: [pid], 
      pid,
      name,
      listing: true 
    });
  } catch (error) {
    throw new Error(`No process running on port ${port}`);
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
  const portRegex = new RegExp(`^\\s*${protocol}\\s+[^:]*:${port}\\s`);
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

  return createResult(port, true, 'win32', {
    pids,
    pid: pids[0],
    stdout: result.stdout,
    stderr: result.stderr
  });
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

  return createResult(port, true, process.platform, {
    pids,
    pid: pids[0],
    name,
    stdout: result.stdout,
    stderr: result.stderr
  });
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
      pids.push(parseInt(pid, 10));
    }
  });
  return pids;
}

module.exports = portClear;
module.exports.default = portClear;
