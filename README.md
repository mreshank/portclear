# portclear

> Kill process running on any given port. **Works with Node.js, Python, Go, Java, Ruby, and ANY language.** Zero dependencies, cross-platform support for Windows, macOS, Linux & Unix.

[![npm version](https://img.shields.io/npm/v/portclear.svg)](https://www.npmjs.com/package/portclear)
[![npm downloads](https://img.shields.io/npm/dm/portclear.svg)](https://www.npmjs.com/package/portclear)
[![license](https://img.shields.io/npm/l/portclear.svg)](https://github.com/mreshank/portclear/blob/main/LICENSE)
[![package size](https://img.shields.io/bundlephobia/min/portclear.svg)](https://bundlephobia.com/package/portclear)

## Why portclear?

✅ **Universal language support** - Works with processes from ANY language ⭐ NEW  
✅ **Zero dependencies** - Only uses Node.js built-in modules  
✅ **Smallest package** - ~10 kB (vs competitors at 60-174 kB)  
✅ **Cross-platform** - Windows, macOS, Linux, Unix support  
✅ **Port ranges** - Kill ports 3000-3010 in one command  
✅ **Preview mode** - List processes before killing  
✅ **TypeScript support** - Full type definitions included  
✅ **Multiple aliases** - Available as `portclear`, `port-clear`, `pkill-port`, etc.  
✅ **Flexible CLI** - Positional, flag-based, and range syntax  
✅ **Promise-based API** - Clean programmatic usage  

## Language Support

**portclear works with processes from ANY programming language:**

| Language | Frameworks/Runtimes | ✓ Supported |
|----------|---------------------|-------------|
| **JavaScript/TypeScript** | Node.js, Deno, Bun, Express, Next.js, React dev servers | ✅ |
| **Python** | Flask, Django, FastAPI, Streamlit, Jupyter | ✅ |
| **Go** | Gin, Echo, Fiber, net/http | ✅ |
| **Java/Kotlin** | Spring Boot, Micronaut, Ktor, Tomcat | ✅ |
| **Ruby** | Rails, Sinatra, Puma | ✅ |
| **PHP** | Laravel, Symfony, built-in server | ✅ |
| **Rust** | Actix, Rocket, Axum | ✅ |
| **C/C++** | Any HTTP server or TCP/UDP service | ✅ |
| **.NET/C#** | ASP.NET, Kestrel | ✅ |
| **Elixir** | Phoenix | ✅ |
| **Any other language** | If it uses a port, we can kill it! | ✅ |

**How it works:**  
portclear doesn't care what language your process is written in. It finds what's using a port at the OS level and kills it. Simple and universal.

## Installation

### One-time Use (Recommended)

```bash
# Use any of these aliases:
npx portclear <port>
npx port-clear <port>
npx pkill-port <port>
npx portstop <port>
npx port-nuke <port>
npx port-eject <port>
```

### Global Installation

```bash
npm install -g portclear
```

### Project Dependency

```bash
npm install portclear
```

## Quick Start

```bash
# Kill process on port
npx portclear 3000

# Kill port range
npx portclear 3000-3010

# List processes (preview mode)
npx portclear -l 3000

# Quiet mode for scripts
npx portclear -q 3000
```

## Usage

### CLI Usage

**Basic usage:**
```bash
npx portclear 3000
```

**Port ranges:**
```bash
# Range syntax
npx portclear 3000-3010

# Flag syntax
npx portclear --from 3000 --to 3010
```

**Multiple ports:**
```bash
# Space-separated
npx portclear 3000 8080 9000

# Comma-separated
npx portclear 3000,8080,9000
```

**List/Preview mode:**
```bash
# See what's running without killing
npx portclear -l 3000

# List range of ports
npx portclear --list 3000-3010

# With verbose output
npx portclear -l 3000 -v
```

**Quiet mode:**
```bash
# Perfect for CI/CD scripts
npx portclear -q 3000

# Only shows errors, exits with proper codes
if npx portclear -q 3000; then
  echo "Port cleared successfully"
fi
```

**JSON output:**
```bash
# Machine-readable output
npx portclear --json 3000

# Combine with list mode
npx portclear -l --json 3000-3010
```

**Advanced options:**
```bash
# Kill UDP process
npx portclear -p 3000 -m udp

# Verbose output with process details
npx portclear -p 3000 -v

# Kill process tree (including children)
npx portclear --tree 3000
```

### Programmatic Usage

**Basic:**
```javascript
const portclear = require('portclear');

// Kill process on port 3000
await portclear(3000);
```

**With options:**
```javascript
// New options object API (v1.0+)
await portclear(3000, {
  method: 'udp',    // 'tcp' or 'udp'
  list: true,       // Preview mode
  tree: false       // Kill process tree
});

// Backward compatible (still works)
await portclear(3000, 'udp');
```

**TypeScript:**
```typescript
import portclear, { PortClearOptions, PortClearResult } from 'portclear';

// Full type safety
const result: PortClearResult = await portclear(3000, {
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
  await portclear(3000);
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
const preview = await portclear(3000, { list: true });

if (!preview.error) {
  console.log(`Found ${preview.name} (PID: ${preview.pid})`);
  
  // Confirm and kill
  const confirmed = await askUser('Kill this process?');
  if (confirmed) {
    await portclear(3000);
  }
}
```

## Real-World Examples

### Kill Python Flask/Django Dev Server

```bash
# Flask typically runs on 5000
npx portclear 5000

# Django on 8000
npx portclear 8000
```

### Kill Go Server

```bash
# Kill Go app on port 8080
npx portclear 8080
```

### Kill Java Spring Boot App

```bash
# Spring Boot default port
npx portclear 8080

# Or custom port
npx portclear 9090
```

### Kill Ruby Rails Server

```bash
# Rails default port
npx portclear 3000
```

### Free Up Docker Ports

```bash
# Kill common Docker ports
npx portclear 2375 2376 5000 8000-8100
```

### Clean Up Multiple Dev Environments

```bash
# Kill all common dev ports at once
npx portclear 3000-3010 5000 8000 8080 9000
```

### Integration in Node.js Apps

```javascript
const portclear = require('portclear');
const express = require('express');

async function startServer(port = 3000) {
  try {
    // Clear port before starting
    await portclear(port, { quiet: true });
    
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

### Python Integration

```python
# Use subprocess to call portclear from Python
import subprocess

def clear_port(port):
    try:
        subprocess.run(['npx', 'portclear', '-q', str(port)], check=True)
        print(f"Port {port} cleared")
    except subprocess.CalledProcessError:
        print(f"Could not clear port {port}")

clear_port(5000)
```

### Package.json Scripts

```json
{
  "scripts": {
    "clean": "portclear -q 3000 8080",
    "prestart": "npm run clean",
    "start": "node server.js",
    "dev": "portclear -q 3000 && nodemon server.js",
    "kill-all": "portclear 3000-9000"
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

### `portclear(port, methodOrOptions)`

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

## Platform Support

| Platform | Supported | Commands Used |
|----------|-----------|---------------|
| Windows | ✅ | `netstat -ano`, `taskkill` |
| macOS | ✅ | `lsof`, `kill`, `ps` |
| Linux | ✅ | `lsof`, `kill`, `ps` |
| Unix | ✅ | `lsof`, `kill`, `ps` |

## Comparison with Alternatives

| Feature | portclear | kill-port | killport | port-kill |
|---------|----------|-----------|----------|-----------|
| **Size (packed)** | **~10 kB** | ~60 kB | ~1.5 kB | ~35 kB |
| **Dependencies** | **0** | 2 | 2 | 0 |
| **Language Universal** | **✅** | ✅ | ✅ | ✅ |
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
sudo npx portclear 3000

# Windows (Run terminal as Administrator)
npx portclear 3000
```

### Port Still in Use After Killing

Some applications may take time to release ports. Wait a few seconds and verify:

```bash
# List to check if process is gone
npx portclear -l 3000

# Force kill with tree option
npx portclear --tree 3000
```

### Finding What's Using a Port

Use list mode to see details:

```bash
# Basic info
npx portclear -l 3000

# Verbose with all details
npx portclear -l 3000 -v

# JSON for scripting
npx portclear -l --json 3000
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

If you encounter any problems, please [open an issue](https://github.com/mreshank/portclear/issues) on GitHub.

## Package Aliases

This package is available under multiple names for convenience:

- [portclear](https://www.npmjs.com/package/portclear) (main)
- [port-clear](https://www.npmjs.com/package/port-clear)
- [pkill-port](https://www.npmjs.com/package/pkill-port)
- [portstop](https://www.npmjs.com/package/portstop)
- [port-nuke](https://www.npmjs.com/package/port-nuke)
- [port-eject](https://www.npmjs.com/package/port-eject)

All aliases provide the exact same functionality.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes.

---

**Made with ❤️ by developers, for developers. Works with every language. 🌍**
