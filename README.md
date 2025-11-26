# port-clear

> Kill process running on any given port. Zero dependencies, cross-platform support for Windows, macOS, Linux & Unix.

[![npm version](https://img.shields.io/npm/v/port-clear.svg)](https://www.npmjs.com/package/port-clear)
[![npm downloads](https://img.shields.io/npm/dm/port-clear.svg)](https://www.npmjs.com/package/port-clear)
[![license](https://img.shields.io/npm/l/port-clear.svg)](https://github.com/mreshank/port-clear/blob/main/LICENSE)
[![package size](https://img.shields.io/bundlephobia/min/port-clear.svg)](https://bundlephobia.com/package/port-clear)

## Why port-clear?

✅ **Zero dependencies** - Only uses Node.js built-in modules  
✅ **Smallest package** - ~8 kB packed (vs competitors at 60-174 kB)  
✅ **Cross-platform** - Windows, macOS, Linux, Unix support  
✅ **Port ranges** - Kill ports 3000-3010 in one command ⭐ NEW  
✅ **Preview mode** - List processes before killing ⭐ NEW  
✅ **TypeScript support** - Full type definitions included ⭐ NEW  
✅ **Multiple aliases** - Available as `port-clear`, `portkill`, `pkill-port`, etc.  
✅ **Flexible CLI** - Positional, flag-based, and range syntax  
✅ **Promise-based API** - Clean programmatic usage  

## Installation

### Global Installation

```bash
npm install -g port-clear
```

### One-time Use (Recommended)

```bash
# Use any of these aliases:
npx port-clear <port>
npx portkill <port>
npx pkill-port <port>
npx port-stop <port>
npx port-nuke <port>
npx port-eject <port>
```

### Project Dependency

```bash
npm install port-clear
```

## Quick Start

```bash
# Kill process on port
npx port-clear 3000

# Kill port range
npx port-clear 3000-3010

# List processes (preview mode)
npx port-clear -l 3000

# Quiet mode for scripts
npx port-clear -q 3000
```

## Usage

### CLI Usage

**Basic usage:**
```bash
npx port-clear 3000
```

**Port ranges:**
```bash
# Range syntax
npx port-clear 3000-3010

# Flag syntax
npx port-clear --from 3000 --to 3010
```

**Multiple ports:**
```bash
# Space-separated
npx port-clear 3000 8080 9000

# Comma-separated
npx port-clear 3000,8080,9000
```

**List/Preview mode:**
```bash
# See what's running without killing
npx port-clear -l 3000

# List range of ports
npx port-clear --list 3000-3010

# With verbose output
npx port-clear -l 3000 -v
```

**Quiet mode:**
```bash
# Perfect for CI/CD scripts
npx port-clear -q 3000

# Only shows errors, exits with proper codes
if npx port-clear -q 3000; then
  echo "Port cleared successfully"
fi
```

**JSON output:**
```bash
# Machine-readable output
npx port-clear --json 3000

# Combine with list mode
npx port-clear -l --json 3000-3010
```

**Advanced options:**
```bash
# Kill UDP process
npx port-clear -p 3000 -m udp

# Verbose output with process details
npx port-clear -p 3000 -v

# Kill process tree (including children)
npx port-clear --tree 3000
```

### Programmatic Usage

**Basic:**
```javascript
const portClear = require('port-clear');

// Kill process on port 3000
await portClear(3000);
```

**With options:**
```javascript
// New options object API (v1.0+)
await portClear(3000, {
  method: 'udp',    // 'tcp' or 'udp'
  list: true,       // Preview mode
  tree: false       // Kill process tree
});

// Backward compatible (still works)
await portClear(3000, 'udp');
```

**TypeScript:**
```typescript
import portClear, { PortClearOptions, PortClearResult } from 'port-clear';

// Full type safety
const result: PortClearResult = await portClear(3000, {
  method: 'tcp',
  list: true
});

if (result.pid) {
  console.log(`Process ${result.name} (PID: ${result.pid}) on port ${result.port}`);
}
```

**Error handling:**
```javascript
try {
  await portClear(3000);
  console.log('Port 3000 cleared successfully');
} catch (error) {
  if (error.message.includes('Permission denied')) {
    console.log('Run with sudo or as Administrator');
  } else if (error.message.includes('No process running')) {
    console.log('Port is already free');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

**Preview before killing:**
```javascript
// List what's running first
const preview = await portClear(3000, { list: true });

if (!preview.error) {
  console.log(`Found ${preview.name} (PID: ${preview.pid})`);
  
  // Confirm and kill
  const confirmed = await askUser('Kill this process?');
  if (confirmed) {
    await portClear(3000);
  }
}
```

## CLI Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--port <port>` | `-p` | Port number(s) - supports ranges and comma-separated | - |
| `--list` | `-l` | List processes without killing (preview mode) | `false` |
| `--method <method>` | `-m` | Protocol: `tcp` or `udp` | `tcp` |
| `--verbose` | `-v` | Show detailed output with PIDs and process names | `false` |
| `--quiet` | `-q` | Quiet mode - only show errors | `false` |
| `--json` | - | Output results as JSON | `false` |
| `--tree` | - | Kill process tree (including children) | `false` |
| `--from <port>` | - | Start of port range | - |
| `--to <port>` | - | End of port range | - |
| `--help` | `-h` | Show help message | - |

## API

### `portClear(port, methodOrOptions)`

Kill process running on specified port.

**Parameters:**
- `port` (number|string) - Port number to kill (1-65535)
- `methodOrOptions` (string|object) - Either:
  - String: `'tcp'` or `'udp'` (backward compatible)
  - Object: Options object (v1.0+)
    - `method?: 'tcp' | 'udp'` - Protocol (default: `'tcp'`)
    - `list?: boolean` - Preview mode (default: `false`)
    - `tree?: boolean` - Kill process tree (default: `false`)

**Returns:**
- `Promise<PortClearResult>` - Result object containing:
  - `port: number` - Port number
  - `killed: boolean` - Whether process was killed
  - `platform: string` - OS platform
  - `pid?: number` - Process ID (single process)
  - `pids?: number[]` - Process IDs (multiple processes)
  - `name?: string` - Process name
  - `error?: string` - Error message if failed
  - `stdout?: string` - Command output
  - `stderr?: string` - Command errors
  - `listing?: boolean` - Whether this is list mode

**Throws:**
- `Error` - If port is invalid, no process is running, or kill operation fails

## Advanced Usage

### Port Ranges in Scripts

```javascript
// Kill all dev server ports
const portRange = Array.from({ length: 11 }, (_, i) => 3000 + i);

for (const port of portRange) {
  try {
    await portClear(port, { quiet: true });
  } catch (error) {
    // Ignore errors (port might not be in use)
  }
}
```

### Pre-deployment Cleanup

```javascript
// Clean up before starting services
const portsToClean = [3000, 8080, 8081, 9000];

console.log('Cleaning up ports...');
await Promise.all(
  portsToClean.map(port => 
    portClear(port).catch(() => {}) // Ignore errors
  )
);
console.log('Ports cleared, starting services...');
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
- name: Clear ports before tests
  run: npx port-clear -q 3000 8080 || true

- name: Run tests
  run: npm test
```

### Development Tools Integration

```json
{
  "scripts": {
    "predev": "port-clear -q 3000",
    "dev": "next dev",
    "clean-ports": "port-clear 3000-3010",
    "kill-all": "port-clear 3000,8080,8081,9000"
  }
}
```

## Platform Support

| Platform | Supported | Commands Used |
|----------|-----------|---------------|
| Windows | ✅ | `netstat -ano`, `taskkill` |
| macOS | ✅ | `lsof`, `kill`, `ps` |
| Linux | ✅ | `lsof`, `kill`, `ps` |
| Unix | ✅ | `lsof`, `kill`, `ps` |

## Comparison with Alternatives

| Feature | port-clear | kill-port | killport | port-kill |
|---------|-----------|-----------|----------|-----------|
| **Size (packed)** | **~8 kB** | ~60 kB | ~1.5 kB | ~35 kB |
| **Dependencies** | **0** | 2 | 2 | 0 |
| **Port Ranges** | **✅** | ❌ | ❌ | ❌ |
| **Preview Mode** | **✅** | ❌ | ❌ | ✅ |
| **TypeScript** | **✅** | ⚠️ (@types) | ❌ | ❌ |
| **JSON Output** | **✅** | ❌ | ❌ | ❌ |
| **Process Tree** | **✅** | ❌ | ❌ | ✅ |
| **Quiet Mode** | **✅** | ❌ | ❌ | ❌ |
| **Cross-Platform** | ✅ | ✅ | ❌ (Unix only) | ✅ |
| **Active Maintenance** | ✅ | ⚠️ | ❌ | ⚠️ |

## Troubleshooting

### Permission Denied

**Error:** `Permission denied for port 3000`

**Solution:**
```bash
# macOS/Linux
sudo npx port-clear 3000

# Windows (Run terminal as Administrator)
npx port-clear 3000
```

### Port Still in Use After Killing

Some applications may take time to release ports. Wait a few seconds and verify:

```bash
# List to check if process is gone
npx port-clear -l 3000

# Force kill with tree option
npx port-clear --tree 3000
```

### Finding What's Using a Port

Use list mode to see details:

```bash
# Basic info
npx port-clear -l 3000

# Verbose with all details
npx port-clear -l 3000 -v

# JSON for scripting
npx port-clear -l --json 3000
```

## Examples

### Free Up Development Ports

```bash
# Kill all common dev ports
npx port-clear 3000 3001 5000 8000 8080

# Or use ranges
npx port-clear 3000-3005 8000-8005
```

### Clean Up Docker Ports

```bash
# Kill common Docker ports
npx port-clear 2375 2376 5000 8000-8100
```

### Integration in Node.js Apps

```javascript
const portClear = require('port-clear');
const express = require('express');

async function startServer(port = 3000) {
  try {
    // Clear port before starting
    await portClear(port, { quiet: true });
    
    const app = express();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Could not start server:', error.message);
    process.exit(1);
  }
}

startServer();
```

### Package.json Scripts

```json
{
  "scripts": {
    "clean": "port-clear -q 3000 8080",
    "prestart": "npm run clean",
    "start": "node server.js",
    "dev": "port-clear -q 3000 && nodemon server.js",
    "kill-all": "port-clear 3000-9000"
  }
}
```

## Requirements

- Node.js >= 14.0.0

## License

MIT © [Reshank M](https://github.com/mreshank)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -am 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Issues

If you encounter any problems, please [open an issue](https://github.com/mreshank/port-clear/issues) on GitHub.

## Package Aliases

This package is available under multiple names for convenience:

- [port-clear](https://www.npmjs.com/package/port-clear) (main)
- [pkill-port](https://www.npmjs.com/package/pkill-port)
- [port-stop](https://www.npmjs.com/package/port-stop)
- [port-nuke](https://www.npmjs.com/package/port-nuke)
- [port-eject](https://www.npmjs.com/package/port-eject)

All aliases provide the exact same functionality.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes.

---

Made with ❤️ by developers, for developers.
