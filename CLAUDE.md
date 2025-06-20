# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo-style TypeScript package workspace for `@madooei/simple-logger` - a lightweight, namespace-based logging system with two log levels (`trace` and `info`). The project follows the portable package template philosophy where each package/example is self-contained.

### Key Directories

- `packages/simple-logger/` - Main package containing the logging library
- `examples/simple/` - Example usage of the logger
- `playgrounds/empty/` - Empty playground for testing dependencies
- `docs/` - Documentation with Jekyll site configuration

## Common Development Commands

### Main Package (`packages/simple-logger/`)

```bash
cd packages/simple-logger

# Development
npm run dev              # Watch mode development
npm start               # Run the package
npm run debug           # Run with debugger

# Building
npm run build           # Build the package (runs validation first)
npm run type-check      # TypeScript type checking

# Testing
npm test                # Run tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
npm run test:ui         # Run tests with Vitest UI

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run format          # Check Prettier formatting
npm run format:fix      # Fix Prettier formatting
npm run validate        # Run all checks (type-check, lint:fix, format:fix, test)

# Cleanup
npm run clean           # Remove dist and coverage
npm run clean:all       # Remove dist, coverage, and node_modules

# Release
npm run release         # Create new release (standard-version)
```

### Examples/Playgrounds

```bash
cd examples/simple  # or cd playgrounds/empty
npm start           # Run example
npm run build       # Build example
npm run type-check  # Check types
```

## Architecture Overview

### Core Components

**LogManagerImpl** (`src/index.ts:25-146`)

- Singleton pattern for global logging control
- Manages logger instances and log level configuration
- Handles pattern matching for namespace-based log levels
- Pattern priority: exact match > regex > prefix > wildcard

**LoggerImpl** (`src/index.ts:10-23`)

- Individual logger instances for specific namespaces
- Two methods: `trace()` and `info()`
- Delegates to LogManager for actual logging decisions

**Types** (`src/types.ts`)

- `LogLevel`: "trace" | "info"
- `NamespacePattern`: string | RegExp
- Error handling with `LogManagerError` and `LogManagerErrorType`

### Log Level Philosophy

- **`info`** (default): General logging, warnings, errors - visible in production
- **`trace`**: Debugging information - scoped to specific namespaces to avoid console clutter

### Pattern Matching System

1. **Exact match** (`"app:component"`) - highest priority
2. **Regex pattern** (`/app:component\d+/`) - second priority
3. **Prefix pattern** (`"app:*"`) - third priority
4. **Wildcard** (`"*"`) - lowest priority

When multiple patterns match, longer patterns take precedence within the same priority level.

## Testing Framework

Uses **Vitest** with comprehensive test coverage:

- Singleton behavior testing
- Log level hierarchy validation
- Pattern matching precedence
- Object serialization
- Enable/disable functionality

Test files: `tests/index.test.ts`

## Build System

- **tsup** for building with dual CJS/ESM output
- **TypeScript** with strict mode and ESNext target
- **ESLint** + **Prettier** for code quality
- **standard-version** for automated releases

## Development Workflow

1. Work in `packages/simple-logger/` for core development
2. Use `examples/simple/` to test changes
3. Run `npm run validate` before committing (type-check, lint, format, test)
4. Use VSCode multi-root workspace (`simple-logger.code-workspace`) for efficient development

## Important Implementation Notes

- **Performance concern**: `JSON.stringify` is called on all arguments before checking if logging is enabled (see TODO list in package README)
- **Pattern precedence**: RegExp patterns should take higher priority than wildcards, but current implementation may have edge cases
- **Memory management**: Logger instances are cached indefinitely - may need cleanup mechanism for long-running applications
- **Global enable/disable**: Affects all loggers immediately
