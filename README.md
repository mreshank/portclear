# portclear

> **Enterprise-grade port management utility for modern development workflows**  
> Zero dependencies • Cross-platform • Universal language support • Production-ready

<br>

[![npm version](https://img.shields.io/npm/v/portclear.svg?style=flat-square)](https://www.npmjs.com/package/portclear)
[![npm downloads](https://img.shields.io/npm/dm/portclear.svg?style=flat-square)](https://www.npmjs.com/package/portclear)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Package Size](https://img.shields.io/bundlephobia/min/portclear.svg?style=flat-square)](https://bundlephobia.com/package/portclear)
[![Node Version](https://img.shields.io/node/v/portclear.svg?style=flat-square)](https://nodejs.org)

<br>


---


<br>

## Table of Contents

- [Overview](#overview)
- [Why portclear?](#why-portclear)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Reference](#cli-reference)
- [API Documentation](#api-documentation)
- [Universal Language Support](#universal-language-support)
- [Advanced Usage](#advanced-usage)
- [Platform Compatibility](#platform-compatibility)
- [Performance & Benchmarks](#performance--benchmarks)
- [Troubleshooting](#troubleshooting)
- [Migration Guide](#migration-guide)
- [Contributing](#contributing)
- [License](#license)

<br>


---


<br>

## Overview

**portclear** is a lightweight, zero-dependency utility designed to terminate processes occupying specified network ports. Built for modern development workflows, it supports all major operating systems and programming languages, making it an essential tool for developers, DevOps engineers, and system administrators.

### Key Highlights

| Feature | Description |
|---------|-------------|
| **Zero Dependencies** | Pure Node.js implementation using only built-in modules |
| **Cross-Platform** | Windows, macOS, Linux, and Unix systems fully supported |
| **Language Agnostic** | Works with processes from any programming language |
| **Port Ranges** | Kill multiple ports simultaneously with range syntax |
| **Preview Mode** | Inspect processes before termination |
| **TypeScript Native** | Full type definitions included out of the box |
| **Production Ready** | Battle-tested with comprehensive error handling |
| **Minimal Footprint** | ~10 KB package size vs 60-174 KB in alternatives |


---


## Why portclear?

### Technical Advantages

```
┌─────────────────────────────────────────────────────────────────┐
│  COMPARISON: portclear vs Alternatives                          │
├─────────────────┬───────────┬───────────┬───────────┬───────────┤
│ Metric          │ portclear │ kill-port │  killport │ port-kill │
├─────────────────┼───────────┼───────────┼───────────┼───────────┤
│ Package Size    │   ~10 KB  │  ~60 KB   │  ~1.5 KB  │  ~35 KB   │
│ Dependencies    │     0     │     2     │     2     │     0     │
│ TypeScript      │     ✓     │  @types   │     ✗     │     ✗     │
│ Port Ranges     │     ✓     │     ✗     │     ✗     │     ✗     │
│ Preview Mode    │     ✓     │     ✗     │     ✗     │     ✓     │
│ JSON Output     │     ✓     │     ✗     │     ✗     │     ✗     │
│ Process Tree    │     ✓     │     ✗     │     ✗     │     ✓     │
│ Windows Support │     ✓     │     ✓     │     ✗     │     ✓     │
│ Quiet Mode      │     ✓     │     ✗     │     ✗     │     ✗     │
│ Active / Latest │     ✓     │     ✗     │     ✗     │     ✗     │
└─────────────────┴───────────┴───────────┴───────────┴───────────┘
```

### Design Philosophy

- **Simplicity First**: Single-purpose tool that does one thing exceptionally well
- **Developer Experience**: Intuitive CLI with comprehensive documentation
- **Zero Lock-in**: No proprietary dependencies or vendor tie-ins
- **Enterprise Grade**: Production-ready with robust error handling
- **Future Proof**: Active maintenance and continuous improvements


---


## Installation

### Quick Install (Recommended)

Use `npx` for one-time execution without global installation:

```bash
npx portclear 3000
```

### Global Installation

Install once, use everywhere:

```bash
npm install -g portclear
```

### Project Dependency

Add to your project's development dependencies:

```bash
npm install --save-dev portclear
```

```bash
yarn add -D portclear
```

```bash
pnpm add -D portclear
```

### Available Package Aliases

For convenience, **portclear** is published under multiple package names:

| Package Name | Command | Status |
|--------------|---------|--------|
| **portclear** | `npx portclear` | Primary (recommended) |
| **portstop** | `npx portstop` | Alias |
| **pkill-port** | `npx pkill-port` | Alias |
| **port-nuke** | `npx port-nuke` | Alias |
| **port-eject** | `npx port-eject` | Alias |

> **Note:** All aliases provide identical functionality. Use whichever name you prefer.


---


## Quick Start

### Basic Usage

```bash
# Kill process on port 3000
npx portclear 3000

# Kill multiple ports
npx portclear 3000 8080 9000

# Kill port range
npx portclear 3000-3010

# Preview without killing
npx portclear --list 3000
```

### Common Scenarios

<table>
<tr>
<td width="50%">

**Before Starting Development Server**

```bash
# Clean up before npm start
npx portclear 3000
npm start
```

</td>
<td width="50%">

**CI/CD Pipeline**

```bash
# Silent cleanup in scripts
npx portclear --quiet 3000 || true
```

</td>
</tr>
<tr>
<td width="50%">

**Docker Port Conflicts**

```bash
# Free up Docker ports
npx portclear 2375 2376 5000
```

</td>
<td width="50%">

**Multiple Microservices**

```bash
# Clear service port range
npx portclear 8000-8010
```

</td>
</tr>
</table>


---


## CLI Reference

### Command Syntax

```
portclear [options] <port|range|ports...>
```

### Options

| Option | Short | Type | Description |
|--------|-------|------|-------------|
| `--port <port>` | `-p` | number | Specify port number (supports ranges and comma-separated lists) |
| `--list` | `-l` | boolean | List processes without terminating (preview mode) |
| `--method <protocol>` | `-m` | string | Protocol type: `tcp` or `udp` (default: `tcp`) |
| `--verbose` | `-v` | boolean | Display detailed output including PIDs and process names |
| `--quiet` | `-q` | boolean | Suppress output (errors only) |
| `--json` | | boolean | Output results in JSON format |
| `--tree` | | boolean | Terminate process tree including child processes |
| `--from <port>` | | number | Start of port range |
| `--to <port>` | | number | End of port range |
| `--help` | `-h` | boolean | Display help information |

### Usage Examples

<details>
<summary><b>Port Range Operations</b></summary>

```bash
# Range syntax (dash notation)
portclear 3000-3010

# Range syntax (flags)
portclear --from 3000 --to 3010

# Mixed ranges and individual ports
portclear 3000-3005 8080 9000

# Comma-separated ports
portclear -p 3000,8080,9000
```

</details>

<details>
<summary><b>Preview Mode (List Without Killing)</b></summary>

```bash
# Basic listing
portclear --list 3000

# Verbose listing with process details
portclear -l 3000 -v

# List port range
portclear --list 3000-3010

# JSON output for automation
portclear -l --json 3000
```

</details>

<details>
<summary><b>Protocol-Specific Operations</b></summary>

```bash
# Kill TCP process (default)
portclear 3000

# Kill UDP process
portclear -p 5353 -m udp

# Kill both TCP and UDP
portclear -p 53 -m tcp && portclear -p 53 -m udp
```

</details>

<details>
<summary><b>Process Tree Termination</b></summary>

```bash
# Kill parent and all child processes
portclear --tree 3000

# Useful for processes that spawn workers
portclear --tree 8000 -v
```

</details>

<details>
<summary><b>Automation & Scripting</b></summary>

```bash
# Quiet mode for CI/CD
portclear --quiet 3000

# JSON output for parsing
portclear --json 3000 | jq '.ports[0].killed'

# Conditional execution
if portclear -q 3000; then
  echo "Port cleared successfully"
else
  echo "Failed to clear port"
  exit 1
fi
```

</details>


---


## API Documentation

### JavaScript/TypeScript API

**portclear** provides a clean, promise-based API for programmatic usage.

#### Basic Usage

```javascript
const portclear = require('portclear');

// Kill process on port 3000
await portclear(3000);
```

#### Advanced Options

```javascript
// Configure with options object
await portclear(3000, {
  method: 'tcp',    // 'tcp' | 'udp'
  list: false,      // Preview mode
  tree: true        // Kill process tree
});

// Backward compatible (v0.x syntax still supported)
await portclear(3000, 'udp');
```

#### TypeScript Support

```typescript
import portclear, { PortClearOptions, PortClearResult } from 'portclear';

// Type-safe configuration
const options: PortClearOptions = {
  method: 'tcp',
  list: true,
  tree: false
};

// Type-safe result handling
const result: PortClearResult = await portclear(3000, options);

if (result.killed) {
  console.log(`Terminated ${result.name} (PID: ${result.pid})`);
}
```

#### Type Definitions

```typescript
interface PortClearOptions {
  method?: 'tcp' | 'udp';  // Protocol type
  list?: boolean;           // Preview mode
  tree?: boolean;           // Kill process tree
}

interface PortClearResult {
  port: number;            // Port number
  killed: boolean;         // Termination status
  platform: string;        // Operating system
  pid?: number;            // Primary process ID
  pids?: number[];         // All process IDs
  name?: string;           // Process name
  error?: string;          // Error message if failed
  stdout?: string;         // Command output
  stderr?: string;         // Command errors
  listing?: boolean;       // Preview mode indicator
}
```

#### Error Handling

```javascript
try {
  const result = await portclear(3000);
  console.log(`Successfully terminated process on port ${result.port}`);
} catch (error) {
  if (error.message.includes('Permission denied')) {
    console.error('Insufficient privileges. Try running with sudo.');
  } else if (error.message.includes('No process running')) {
    console.log('Port is already available.');
  } else {
    console.error(`Unexpected error: ${error.message}`);
  }
}
```

#### Preview Before Termination

```javascript
// Safe operation: preview then terminate
async function safeKill(port) {
  // Step 1: List process
  const preview = await portclear(port, { list: true });
  
  if (preview.error) {
    console.log(`Port ${port} is free`);
    return;
  }
  
  console.log(`Found: ${preview.name} (PID: ${preview.pid})`);
  
  // Step 2: Confirm with user (in interactive mode)
  const confirmed = await getUserConfirmation();
  
  // Step 3: Terminate if confirmed
  if (confirmed) {
    await portclear(port);
    console.log('Process terminated successfully');
  }
}
```


---


## Universal Language Support

**portclear** operates at the operating system level, making it language-agnostic. It works with processes from any programming language or runtime.

### Supported Languages & Frameworks

<table>
<tr>
<th>Language</th>
<th>Frameworks & Runtimes</th>
<th>Default Ports</th>
</tr>
<tr>
<td><strong>JavaScript/TypeScript</strong></td>
<td>Node.js, Deno, Bun, Express, Next.js, React, Vue, Angular dev servers</td>
<td>3000, 3001, 8080</td>
</tr>
<tr>
<td><strong>Python</strong></td>
<td>Flask, Django, FastAPI, Streamlit, Jupyter notebooks</td>
<td>5000, 8000, 8888</td>
</tr>
<tr>
<td><strong>Go</strong></td>
<td>Gin, Echo, Fiber, net/http</td>
<td>8080, 8000</td>
</tr>
<tr>
<td><strong>Java/Kotlin</strong></td>
<td>Spring Boot, Micronaut, Ktor, Tomcat, Jetty</td>
<td>8080, 8081, 9090</td>
</tr>
<tr>
<td><strong>Ruby</strong></td>
<td>Rails, Sinatra, Puma, Rack</td>
<td>3000, 4000</td>
</tr>
<tr>
<td><strong>PHP</strong></td>
<td>Laravel, Symfony, built-in server</td>
<td>8000, 8080</td>
</tr>
<tr>
<td><strong>Rust</strong></td>
<td>Actix, Rocket, Axum, Warp</td>
<td>8000, 3000</td>
</tr>
<tr>
<td><strong>C/C++</strong></td>
<td>Any HTTP server, TCP/UDP services</td>
<td>Varies</td>
</tr>
<tr>
<td><strong>.NET/C#</strong></td>
<td>ASP.NET Core, Kestrel</td>
<td>5000, 5001</td>
</tr>
<tr>
<td><strong>Elixir</strong></td>
<td>Phoenix</td>
<td>4000</td>
</tr>
</table>

### How It Works

**portclear** doesn't interact with your application code. Instead, it:

1. **Queries the operating system** for processes using the specified port
2. **Identifies the process ID (PID)** via platform-specific commands:
   - **Windows**: `netstat -ano` + `taskkill`
   - **Unix/Linux/macOS**: `lsof -ti` + `kill`
3. **Terminates the process** using OS-level signals

This approach ensures compatibility with **any language or framework** that uses network ports.


---


## Advanced Usage

### Integration Patterns

#### Express.js Application

```javascript
const portclear = require('portclear');
const express = require('express');

async function createServer(port = 3000) {
  try {
    // Clean port before starting
    await portclear(port, { quiet: true });
    
    const app = express();
    
    // Configure routes
    app.get('/', (req, res) => res.send('Hello World'));
    
    // Start server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

createServer();
```

#### Python Integration

```python
#!/usr/bin/env python3
import subprocess
import sys

def clear_port(port):
    """Clear a port using portclear via subprocess."""
    try:
        subprocess.run(
            ['npx', 'portclear', '--quiet', str(port)],
            check=True,
            capture_output=True
        )
        return True
    except subprocess.CalledProcessError:
        return False

# Usage in Flask/Django
if __name__ == '__main__':
    PORT = 5000
    
    if clear_port(PORT):
        print(f'Port {PORT} cleared successfully')
    
    # Start your Flask/Django app
    # app.run(port=PORT)
```

#### Package.json Scripts

```json
{
  "scripts": {
    "clean": "portclear --quiet 3000 8080",
    "predev": "npm run clean",
    "dev": "next dev",
    "prestart": "portclear -q 3000",
    "start": "node server.js",
    "test": "portclear -q 3001 && jest",
    "docker:clean": "portclear 2375 2376 5000-5010"
  }
}
```

#### Makefile Integration

```makefile
.PHONY: clean dev prod

clean:
	@npx portclear --quiet 3000 8080 || true

dev: clean
	@npm run dev

prod: clean
	@npm start

test: clean
	@npm test
```

#### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    command: >
      sh -c "npx portclear -q 3000 && npm start"
```

### Advanced Scenarios

#### Port Range Management

```javascript
// Kill all ports in development range
async function cleanDevPorts() {
  const ports = Array.from({ length: 11 }, (_, i) => 3000 + i);
  
  const results = await Promise.allSettled(
    ports.map(port => portclear(port, { quiet: true }))
  );
  
  const killed = results.filter(r => r.status === 'fulfilled').length;
  console.log(`Cleaned ${killed} out of ${ports.length} ports`);
}
```

#### Graceful Shutdown

```javascript
// Implement graceful shutdown with timeout
async function gracefulKill(port, timeout = 5000) {
  try {
    // Try normal termination first
    await portclear(port);
    return true;
  } catch (error) {
    // If failed, try with process tree
    console.log('Attempting force kill with process tree...');
    await portclear(port, { tree: true });
    return true;
  }
}
```

#### Health Check Integration

```javascript
// Health check before starting service
async function healthCheck(port) {
  const result = await portclear(port, { list: true });
  
  if (!result.error) {
    console.warn(`WARN: Port ${port} is already in use by ${result.name}`);
    return false;
  }
  
  return true; // Port is free
}
```


---


## Platform Compatibility

### Operating System Support

| Platform | Version | Support Level | Commands Used |
|----------|---------|---------------|---------------|
| **Windows** | 7, 8, 10, 11, Server | Full | `netstat -ano`, `taskkill /PID /F` |
| **macOS** | 10.12+ | Full | `lsof -ti :PORT`, `kill -9` |
| **Linux** | All major distributions | Full | `lsof -ti :PORT`, `kill -9` |
| **Unix** | FreeBSD, OpenBSD | Full | `lsof -ti :PORT`, `kill -9` |

### Node.js Compatibility

- **Minimum Version**: Node.js 14.0.0
- **Recommended**: Node.js 18.0.0 or later
- **LTS Support**: All current LTS versions

### Protocol Support

- **TCP**: Full support (default)
- **UDP**: Full support (use `-m udp` flag)
- **IPv4**: Full support
- **IPv6**: Depends on OS implementation


---


## Performance & Benchmarks

### Execution Speed

```
Average execution time (single port):
  Windows:  ~150ms
  macOS:    ~80ms
  Linux:    ~70ms
  
Port range (10 ports):
  Sequential: ~800ms
  Parallel:   ~200ms (implementation dependent)
```

### Resource Usage

```
Memory:     < 15 MB
CPU:        Minimal (< 5% during execution)
Disk I/O:   Negligible
```

### Package Metrics

```
Package size:     10.3 KB (packed)
Unpacked size:    33.5 KB
Install time:     < 2 seconds
Dependencies:     0
```


---


## Troubleshooting

### Common Issues & Solutions

<details>
<summary><b>Permission Denied Error</b></summary>

**Problem:** `EACCES: permission denied for port 3000`

**Solution:**

```bash
# macOS/Linux
sudo npx portclear 3000

# Windows (run PowerShell/CMD as Administrator)
npx portclear 3000
```

**Explanation:** Some ports (especially < 1024) require elevated privileges on Unix-based systems.

</details>

<details>
<summary><b>Port Still in Use After Termination</b></summary>

**Problem:** Port remains occupied after running portclear

**Possible Causes:**
1. Process takes time to release the port (TIME_WAIT state)
2. Multiple processes using the same port
3. Child processes not terminated

**Solutions:**

```bash
# Solution 1: Wait and verify
portclear -l 3000  # Check if process is gone
sleep 2            # Wait for TCP cleanup
portclear -l 3000  # Verify again

# Solution 2: Use process tree kill
portclear --tree 3000

# Solution 3: Kill port range
portclear 3000-3002  # Kill related ports
```

</details>

<details>
<summary><b>Invalid Port Number</b></summary>

**Problem:** `Error: Invalid port number`

**Valid port range:** 1 - 65535

```bash
# Invalid
portclear 0       # Too low
portclear 99999   # Too high
portclear abc     # Non-numeric

# Valid
portclear 3000
portclear 1-65535
```

</details>

<details>
<summary><b>Command Not Found</b></summary>

**Problem:** `portclear: command not found`

**Solutions:**

```bash
# Solution 1: Use npx (no installation needed)
npx portclear 3000

# Solution 2: Install globally
npm install -g portclear
portclear 3000

# Solution 3: Use in package.json scripts
npm run clean  # If configured in scripts
```

</details>

### Debug Mode

For troubleshooting, use verbose mode to see detailed information:

```bash
# Enable verbose output
portclear -v 3000

# Combine with list mode for inspection
portclear -l -v 3000

# JSON output for programmatic debugging
portclear --json 3000 | jq '.'
```

### Getting Help

- **Documentation**: [GitHub README](https://github.com/mreshank/portclear)
- **Issues**: [GitHub Issues](https://github.com/mreshank/portclear/issues)
- **npm Package**: [npmjs.com/package/portclear](https://www.npmjs.com/package/portclear)


---


## Migration Guide

### From kill-port

```bash
# Old (kill-port)
npx kill-port 3000
npx kill-port 3000 3001 3002

# New (portclear)
npx portclear 3000
npx portclear 3000 3001 3002
# or
npx portclear 3000-3002
```

### From killport

```bash
# Old (killport)
npx killport 3000

# New (portclear)
npx portclear 3000

# With options
npx portclear --quiet 3000  # Silent mode
npx portclear --list 3000   # Preview mode
```

### From fuser (Linux)

```bash
# Old (fuser)
fuser -k 3000/tcp

# New (portclear)
npx portclear 3000
npx portclear -m tcp 3000  # Explicit TCP
```


---


## Contributing

We welcome contributions from the community! Here's how you can help:

### Development Setup

```bash
# Clone repository
git clone https://github.com/mreshank/portclear.git
cd portclear

# Install dependencies (none for runtime, dev only)
npm install

# Run tests
npm test

# Test CLI locally
node cli.js --help
```

### Guidelines

1. **Code Style**: Follow existing patterns and conventions
2. **Tests**: Add tests for new features
3. **Documentation**: Update README.md for user-facing changes
4. **Commits**: Use clear, descriptive commit messages
5. **Pull Requests**: One feature per PR, include rationale

### Testing

```bash
# Run full test suite
npm test

# Test specific port
node cli.js -l 3000

# Test with actual process
node test/test.js
```


---


## License

**MIT License** © 2024 [Eshank Tyagi](https://www.eshank.tech/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.**


---


## Acknowledgments

Built with care for the developer community. Special thanks to all contributors and users who have helped improve this tool.

**Repository**: [github.com/mreshank/portclear](https://github.com/mreshank/portclear)  
**npm Package**: [npmjs.com/package/portclear](https://www.npmjs.com/package/portclear)  
**Author**: [Eshank Tyagi](https://eshank.tech) • [GitHub](https://github.com/mreshank)


---


<div align="center">

**Made for developers, by developers**  
Supports every language • Works everywhere • Free forever

[⭐ Star on GitHub](https://github.com/mreshank/portclear) • [📦 View on npm](https://www.npmjs.com/package/portclear) • [🐛 Report Bug](https://github.com/mreshank/portclear/issues)

</div>
