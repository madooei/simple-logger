# Simple Logger

A lightweight, flexible logging system for CourseBook that supports namespace-based logging with different log levels.

**Features:**

- Written in TypeScript
- Builds to both modern ES modules and CommonJS formats
- Provides TypeScript type definitions
- ESLint for code linting
- Prettier for code formatting
- Vitest for testing
- Tsup for building
- Minimal dependencies

## Installation

```bash
npm install @madooei/simple-logger
```

## Usage

A lightweight, flexible logging system for CourseBook that supports namespace-based logging with different log levels.

### Basic Usage

```typescript
import { LogManagerImpl, type Logger } from "@madooei/simple-logger";

// Get the logger instance
const logManager = LogManagerImpl.getInstance();

// Create a logger for your component
const logger: Logger = logManager.getLogger("myapp:component");

// Log at different levels
logger.trace("Detailed debugging");
logger.info("General information");
```

### Setting Log Levels

```typescript
// Set level for specific namespace
logManager.setLogLevel("myapp:component", "info");

// Set level for all components in 'myapp'
logManager.setLogLevel("myapp:*", "info");

// Use regex pattern
logManager.setLogLevel(/test:\d+/, "trace");

// Set default level for everything
logManager.setLogLevel("*", "info");
```

### Namespace Patterns

- `component:` - Matches all loggers starting with 'component:'
- `component:submodule` - Matches exact namespace
- `/component:\d+/` - Matches using regex pattern
- `*` - Matches all namespaces

### Log Levels

1. `trace` - Verbose debugging information
2. `info` - Informational messages and errors

When you set a log level, all levels of equal or higher severity will be logged:

- Setting level to 'trace' shows trace and info logs
- Setting level to 'info' shows only info logs

### Why Only Two Log Levels?

`info` is the default level for regular logging. It covers everything you would
normally output with `console.log`, including warnings and errors that should be
visible in production. `trace` is solely for debugging and is typically enabled
only for a specific namespace during development. Restricting the hierarchy to
these two levels keeps configuration simple while still letting you turn on
detailed logs without flooding the console.

### Enable/Disable Logging

```typescript
// Disable all logging
logManager.disable();

// Re-enable logging
logManager.enable();
```

### Object Logging

Objects are automatically pretty-printed:

```typescript
logger.info("Processing config", {
  server: "localhost",
  port: 3000,
});

// Output:
// [INFO] [myapp:component] Processing config {
//   "server": "localhost",
//   "port": 3000
// }
```

### Example Component Integration

```typescript
export class FileManager {
  private logger: Logger;

  constructor() {
    this.logger = LogManagerImpl.getInstance().getLogger("filemanager");
  }

  async readFile(path: string): Promise<Buffer> {
    this.logger.trace("Reading file:", path);
    try {
      const content = await readFile(path);
      this.logger.info("Successfully read file:", path);
      return content;
    } catch (error) {
      this.logger.info("Failed to read file:", path, error);
      throw error;
    }
  }
}
```

## Features

- **Namespace-based Logging**: Organize logs by component and operation
- **Pattern Matching**: Control log levels using string prefixes or regex patterns
- **Log Level Hierarchy**: trace → info
- **Object Serialization**: Automatically pretty-print objects
- **Global Enable/Disable**: Quickly toggle all logging
- **Singleton Pattern**: Centralized logging control

## Cloning the Repository

To make your workflow more organized, it's a good idea to clone this repository into a directory named `simple-logging-workspace`. This helps differentiate the workspace from the `simple-logger` located in the `packages` directory.

```bash
git clone https://github.com/madooei/simple-logger simple-logging-workspace

cd simple-logging-workspace
```

## Repository Structure

- `packages` — Contains the primary package(s) for this repository (e.g., `simple-logger`). Each package is self-contained and can be copied out and used independently.
- `examples` — Contains examples of how to use the packages. Each example is a minimal, standalone project.
- `playgrounds` — Contains demos of the dependencies of the primary package(s). Each playground is a minimal, standalone project.
- `docs` — Contains various documentation for users and developers.
- `.github` — Contains GitHub-specific files, such as workflows and issue templates.

## How to Use This Repo

- To work on a package, go to `packages/<package-name>` and follow its README.
- To try an example, go to `examples/<example-name>` and follow its README.
- To run the playground, go to `playground/<package-name>` and follow its README.
- For documentation, see the `docs` folder.

### Using a VSCode Multi-root Workspace

With Visual Studio Code, you can enhance your development experience by using a multi-root workspace to access packages, examples, and playgrounds simultaneously. This approach is more efficient than opening the root directory, or each package or example separately.

To set up a multi-root workspace:

1. Open Visual Studio Code.
2. Navigate to `File > Open Workspace from File...`.
3. Select the `simple-logger.code-workspace` file located at the root of the repository. This action will open all specified folders in one workspace.

The `simple-logger.code-workspace` file can be customized to include different folders or settings. Here's a typical configuration:

```json
{
  "folders": [
    {
      "path": "packages/simple-logger"
    },
    {
      "path": "examples/simple"
    },
    {
      "path": "playgrounds/empty"
    }
  ],
  "settings": {
    // Add any workspace-specific settings here, for example:
    "git.openRepositoryInParentFolders": "always"
  }
}
```

## Developing the Package

Change to the package directory and install dependencies:

```bash
cd packages/simple-logger
npm install
```

- Read the [Project Roadmap](../../docs/ROADMAP.md) for project goals, status, evolution, and development guidelines.
- Read the [Development Guide](DEVELOPMENT.md) for detailed information on the package architecture, build configuration, and implementation patterns.
- Follow the [Contributing Guide](../../docs/CONTRIBUTING.md) for contribution guidelines, coding standards, and best practices.

## Package Management

When you are ready to publish your package:

```bash
npm run release
```

This single command will:

- Validate your code with the full validation pipeline
- Analyze commits to determine version bump
- Update package.json version and changelog
- Build the package
- Create and push git tag
- Create GitHub release
- Publish to NPM

> [!TIP]
> For detailed information about package publishing, versioning, and local development workflows, see the [NPM Package Management Guide](../../docs/guides/npm-package.md).
