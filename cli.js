#!/usr/bin/env node
'use strict';

const portClear = require('./index.js');
const { styleText } = require('util');

// Check if colors are supported (Node 20.12+)
const supportsColor = typeof styleText === 'function';

/**
 * Colorize text (with fallback for older Node versions)
 */
function colorize(text, color) {
  if (!supportsColor) return text;
  try {
    return styleText(color, text);
  } catch {
    return text;
  }
}

/**
 * Parse command line arguments
 * Supports both positional and flag-based arguments
 */
function parseArgs(argv) {
  const args = {
    ports: [],
    method: 'tcp',
    verbose: false,
    quiet: false,
    list: false,
    json: false,
    tree: false,
    help: false,
    from: null,
    to: null
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '-h' || arg === '--help') {
      args.help = true;
    } else if (arg === '-v' || arg === '--verbose') {
      args.verbose = true;
    } else if (arg === '-q' || arg === '--quiet') {
      args.quiet = true;
    } else if (arg === '-l' || arg === '--list') {
      args.list = true;
    } else if (arg === '--json') {
      args.json = true;
    } else if (arg === '--tree' || arg === '--kill-tree') {
      args.tree = true;
    } else if (arg === '-p' || arg === '--port') {
      // Next argument is the port(s)
      i++;
      if (i < argv.length) {
        args.ports.push(...parsePortsArg(argv[i]));
      }
    } else if (arg === '-m' || arg === '--method') {
      // Next argument is the method (tcp/udp)
      i++;
      if (i < argv.length) {
        args.method = argv[i];
      }
    } else if (arg === '--from') {
      i++;
      if (i < argv.length) {
        args.from = parseInt(argv[i], 10);
      }
    } else if (arg === '--to') {
      i++;
      if (i < argv.length) {
        args.to = parseInt(argv[i], 10);
      }
    } else if (!arg.startsWith('-')) {
      // Positional argument - treat as port or port range
      args.ports.push(...parsePortsArg(arg));
    }
  }

  // Handle --from/--to range
  if (args.from !== null && args.to !== null) {
    args.ports.push(...expandRange(args.from, args.to));
  }

  return args;
}

/**
 * Parse ports argument (supports comma-separated and ranges)
 */
function parsePortsArg(arg) {
  const ports = [];
  
  // Split by comma
  const parts = arg.split(',');
  
  for (const part of parts) {
    const trimmed = part.trim();
    
    // Check for range (e.g., "3000-3010")
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(p => parseInt(p.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        ports.push(...expandRange(start, end));
      }
    } else {
      ports.push(trimmed);
    }
  }
  
  return ports;
}

/**
 * Expand port range (e.g., 3000 to 3010)
 */
function expandRange(start, end) {
  if (start > end) {
    [start, end] = [end, start]; // Swap if backwards
  }
  
  const ports = [];
  for (let port = start; port <= end; port++) {
    ports.push(port.toString());
  }
  return ports;
}

/**
 * Display help message
 */
function showHelp() {
  console.log(`
${colorize('portkill', 'cyan')} - Kill process on any port ${colorize('(works with Node.js, Python, Go, Java, etc.)', 'gray')}

${colorize('USAGE:', 'yellow')}
  npx portkill <port>                      Kill process on port
  npx portkill <port1> <port2> ...         Kill processes on multiple ports
  npx portkill <start>-<end>               Kill processes in port range
  npx portkill -p <port>                   Kill process on port (flag syntax)
  npx portkill -l <port>                   List process on port (preview mode)
  npx portkill -p <port> -v                Verbose output
  npx portkill -p <port> -m udp            Kill UDP process (default: tcp)

${colorize('ALIASES:', 'yellow')}
  npx port-clear <port>
  npx pkill-port <port>
  npx port-stop <port>
  npx port-nuke <port>
  npx port-eject <port>

${colorize('OPTIONS:', 'yellow')}
  -p, --port <port>      Port number(s) to kill (supports comma-separated and ranges)
  -l, --list             List processes without killing (preview mode)
  -m, --method <method>  Protocol method: tcp or udp (default: tcp)
  -v, --verbose          Show detailed output
  -q, --quiet            Quiet mode (only show errors)
  --json                 Output results as JSON
  --tree                 Kill process tree (including children)
  --from <port>          Start of port range
  --to <port>            End of port range
  -h, --help             Show this help message

${colorize('EXAMPLES:', 'yellow')}
  ${colorize('# Basic usage', 'gray')}
  npx portkill 3000
  
  ${colorize('# Multiple ports', 'gray')}
  npx portkill 3000 8080 9000
  npx portkill -p 3000,8080,9000
  
  ${colorize('# Port ranges', 'gray')}
  npx portkill 3000-3010
  npx portkill --from 3000 --to 3010
  
  ${colorize('# Preview mode (list without killing)', 'gray')}
  npx portkill -l 3000
  npx portkill --list 3000-3010
  
  ${colorize('# Quiet mode for scripts', 'gray')}
  npx portkill -q 3000
  
  ${colorize('# JSON output for automation', 'gray')}
  npx portkill --json 3000
  npx portkill -l --json 3000-3010
  
  ${colorize('# Verbose with process tree', 'gray')}
  npx portkill -p 3000 -v --tree
  
  ${colorize('# UDP protocol', 'gray')}
  npx portkill -p 3000 -m udp

${colorize('LANGUAGE SUPPORT:', 'yellow')}
  ${colorize('Works with processes from ANY language:', 'cyan')}
  ✓ Node.js / Deno / Bun servers
  ✓ Python (Flask, Django, FastAPI)
  ✓ Go servers
  ✓ Java / Kotlin (Spring Boot, etc.)
  ✓ Ruby (Rails, Sinatra)
  ✓ PHP, Rust, C++, and more!

${colorize('PROGRAMMATIC USAGE:', 'yellow')}
  const portkill = require('portkill');
  
  ${colorize('// Kill process', 'gray')}
  await portkill(3000);
  
  ${colorize('// With options', 'gray')}
  await portkill(3000, { method: 'udp', list: true, tree: true });
  
  ${colorize('// Backward compatible', 'gray')}
  await portkill(3000, 'udp');
`);
}

/**
 * Main CLI execution
 */
async function main() {
  const argv = process.argv.slice(2);
  const args = parseArgs(argv);

  // Show help if requested or no ports provided
  if (args.help || args.ports.length === 0) {
    showHelp();
    process.exit(args.help ? 0 : 1);
  }

  const options = {
    method: args.method,
    list: args.list,
    tree: args.tree
  };

  // JSON output mode
  if (args.json) {
    const jsonResults = await processPortsJson(args.ports, options, args.verbose);
    console.log(JSON.stringify(jsonResults, null, 2));
    process.exit(jsonResults.summary.failed > 0 ? 1 : 0);
  }

  // Regular output mode
  const results = await Promise.allSettled(
    args.ports.map(async (port) => {
      try {
        const result = await portClear(port, options);
        
        if (!args.quiet) {
          if (args.list) {
            if (result.error) {
              console.log(colorize(`Port ${port}:`, 'yellow'), colorize(result.error, 'gray'));
            } else {
              const procInfo = result.name ? `${result.name} (PID: ${result.pid || result.pids.join(', ')})` : `PID: ${result.pid || result.pids.join(', ')}`;
              console.log(colorize(`Port ${port}:`, 'cyan'), procInfo);
              
              if (args.verbose) {
                console.log(colorize(`  Platform: ${result.platform}`, 'gray'));
                if (result.pids) {
                  console.log(colorize(`  PIDs: ${result.pids.join(', ')}`, 'gray'));
                }
              }
            }
          } else {
            console.log(colorize('✓', 'green'), `Process on port ${port} killed successfully`);
            
            if (args.verbose) {
              console.log(colorize(`  Platform: ${result.platform}`, 'gray'));
              if (result.pids) {
                console.log(colorize(`  PIDs: ${result.pids.join(', ')}`, 'gray'));
              }
              if (result.name) {
                console.log(colorize(`  Process: ${result.name}`, 'gray'));
              }
              if (result.stdout && result.stdout.trim()) {
                console.log(colorize(`  Output: ${result.stdout.trim()}`, 'gray'));
              }
            }
          }
        }
        
        return { port, success: true, result };
      } catch (error) {
        if (!args.quiet) {
          console.error(colorize('✗', 'red'), `Failed to ${args.list ? 'list' : 'kill'} process on port ${port}: ${error.message}`);
          
          if (args.verbose) {
            console.error(colorize(`  Error details: ${error.stack}`, 'gray'));
          }
        }
        
        return { port, success: false, error: error.message };
      }
    })
  );

  // Determine exit code based on results
  const hasFailures = results.some(r => r.status === 'rejected' || !r.value.success);
  process.exit(hasFailures ? 1 : 0);
}

/**
 * Process ports and return JSON results
 */
async function processPortsJson(ports, options, verbose) {
  const results = {
    success: true,
    ports: [],
    summary: {
      total: ports.length,
      killed: 0,
      listed: 0,
      failed: 0
    }
  };

  for (const port of ports) {
    try {
      const result = await portClear(port, options);
      
      const portResult = {
        port: parseInt(port, 10),
        killed: result.killed,
        platform: result.platform
      };

      if (result.pids) {
        portResult.pids = result.pids;
        if (result.pid) {
          portResult.pid = result.pid;
        }
      }

      if (result.name) {
        portResult.name = result.name;
      }

      if (result.listing) {
        results.summary.listed++;
      } else if (result.killed) {
        results.summary.killed++;
      }

      results.ports.push(portResult);
    } catch (error) {
      results.success = false;
      results.summary.failed++;
      
      results.ports.push({
        port: parseInt(port, 10),
        killed: false,
        error: error.message
      });
    }
  }

  return results;
}

// Run CLI
main().catch((error) => {
  console.error(colorize('Unexpected error:', 'red'), error.message);
  process.exit(1);
});
