# Simple Logger

A lightweight, flexible logging system for CourseBook that supports namespace-based logging with different log levels.

## Features

- **Namespace-based Logging**: Organize logs by component and operation
- **Pattern Matching**: Control log levels using string prefixes or regex patterns
- **Log Level Hierarchy**: trace → info
- **Object Serialization**: Automatically pretty-print objects
- **Global Enable/Disable**: Quickly toggle all logging
- **Singleton Pattern**: Centralized logging control

## Usage

### Basic Usage

```typescript
import { LogManagerImpl, type Logger } from '@madooei/simple-logger';

// Get the logger instance
const logManager = LogManagerImpl.getInstance();

// Create a logger for your component
const logger: Logger = logManager.getLogger('myapp:component');

// Log at different levels
logger.trace('Detailed debugging');
logger.info('General information');
```

### Setting Log Levels

```typescript
// Set level for specific namespace
logManager.setLogLevel('myapp:component', 'info');

// Set level for all components in 'myapp'
logManager.setLogLevel('myapp:*', 'info');

// Use regex pattern
logManager.setLogLevel(/test:\d+/, 'trace');

// Set default level for everything
logManager.setLogLevel('*', 'info');
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
logger.info('Processing config', {
  server: 'localhost',
  port: 3000
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
    this.logger = LogManagerImpl.getInstance().getLogger('filemanager');
  }
  
  async readFile(path: string): Promise<Buffer> {
    this.logger.trace('Reading file:', path);
    try {
      const content = await readFile(path);
      this.logger.info('Successfully read file:', path);
      return content;
    } catch (error) {
      this.logger.info('Failed to read file:', path, error);
      throw error;
    }
  }
}
```

## Installation

### Installing from NPM (After Publishing)

Once published to NPM, the package can be installed using:

```bash
npm install @madooei/simple-logger
```

This template is particularly useful for creating packages that are intended to be used locally so read the instructions below for local development.

### Local Development (Without Publishing to NPM)

There are three ways to use this package locally:

#### Option 1: Using npm link

1. Clone this repository, install dependencies, build the package, and create a global symlink:

   ```bash
   git clone <repository-url>
   cd simple-logger/packages/simple-logger
   # Install dependencies and build the package
   npm install
   npm run build
   # Create a global symlink
   npm link
   ```

   Note: You can unlink the package later using `npm unlink`.

2. In your other project where you want to use this package:

   ```bash
   npm link @madooei/simple-logger
   ```

3. Import the package in your project:

   ```typescript
   import { LogManagerImpl, type Logger } from '@madooei/simple-logger';
   ```

#### Option 2: Using local path

In your other project's `package.json`, add this package as a dependency using the local path:

```json
{
  "dependencies": {
    "@madooei/simple-logger": "file:/path/to/simple-logger"
  }
}
```

You can use absolute or relative paths with the `file:` protocol.

Then run `npm install` in your project.

Now you can import the package in your project as usual.

#### Option 3: Using a local tarball (npm pack)

1. Follow option 1 but instead of using `npm link`, create a tarball of the package:

   ```bash
   npm pack
   ```

   This will generate a file like `coursebook-simple-logger-1.0.0.tgz`. (Or whatever version you have.)
   You can find the tarball in the same directory as your `package.json`.

2. In your other project, install the tarball:

   ```bash
   npm install /absolute/path/to/simple-logger/coursebook-simple-logger-1.0.0.tgz
   ```

   Or, if you copy the tarball into your project directory:

   ```bash
   npm install ./coursebook-simple-logger-1.0.0.tgz
   ```

This method installs the package exactly as it would be published to npm, making it ideal for final testing. After this installation, you must have the package in your `node_modules` directory, and you can import it as usual. You will also see the package in your `package.json` file as a dependency:

```json
{
  "dependencies": {
    "@madooei/simple-logger": "file:coursebook-simple-logger-1.0.0.tgz"
  }
}
```
