# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-26

### Added
- **Port Range Support** - Kill processes across a range of ports
  - `port-clear 3000-3010`
  - `port-clear --from 3000 --to 3010`
- **List/Preview Mode** - See what would be killed without killing (`-l`, `--list`)
- **Quiet Mode** - Silent operation for scripts (`-q`, `--quiet`)
- **JSON Output** - Machine-readable output for automation (`--json`)
- **Process Tree Killing** - Kill child processes too (`--tree`)
- **TypeScript Definitions** - Full TypeScript support with `index.d.ts`
- **Colored Output** - Beautiful terminal colors (Node 20.12+)
- **Better Error Messages** - Helpful suggestions for permission errors
- **Verbose Mode** - Enhanced with process names and PIDs (`-v`)
- **Multiple Port Formats** - Comma-separated, ranges, and `--from`/`--to`

### Changed
- **API Enhancement** - Now supports options object: `portClear(3000, { list: true, tree: true })`
- **Result Format** - Returns detailed objects with `pid`, `pids`, `name`, `platform`, etc.
- **Error Handling** - Permission errors now suggest `sudo` or "Run as Administrator"

### Maintained
- **Zero Dependencies** - Still using only Node.js built-in modules
- **Backward Compatibility** - Old API still works: `portClear(3000, 'udp')`
- **Cross-Platform** - Windows, macOS, Linux, Unix fully supported
- **Package Size** - Remains ultra-lightweight (~8 kB packed)

## [0.0.1] - 2025-11-26

### Added
- Initial release
- Basic port killing functionality
- Cross-platform support (Windows, macOS, Linux, Unix)
- CLI with multiple package aliases
- Support for TCP and UDP protocols
- Multiple port support
- Zero dependencies
- Comprehensive test suite