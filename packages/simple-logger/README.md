# LogManager Component

A lightweight, flexible logging system for ContentSmith that supports namespace-based logging with different log levels.

## Features

- **Namespace-based Logging**: Organize logs by component and operation
- **Pattern Matching**: Control log levels using string prefixes or regex patterns
- **Log Level Hierarchy**: trace → info → warn → error
- **Object Serialization**: Automatically pretty-print objects
- **Global Enable/Disable**: Quickly toggle all logging
- **Singleton Pattern**: Centralized logging control

## Implementation Details

### Logger Class

- Handles actual logging operations
- Prefixes logs with level and namespace
- Formats objects for better readability

### LogManager Class

- Singleton pattern for global access
- Manages logger instances
- Controls log levels and patterns
- Handles enable/disable state

## Best Practices

1. **Namespace Convention**:
   - Use colon-separated hierarchies: `component:subcomponent:operation`
   - Keep namespaces consistent across related code

2. **Log Level Usage**:
   - `trace`: Detailed debugging information
   - `info`: Normal operation progress
   - `warn`: Recoverable issues
   - `error`: Operation failures

3. **Pattern Usage**:
   - Use specific patterns for fine-grained control
   - Use broader patterns for general configuration
   - Order patterns from specific to general

## Package Name and Scope

This package uses the npm scope `@coursebook`. When using this template for your own package:

1. Change the package name in `package.json`:
   ```json
   {
     "name": "@your-scope/your-package-name"
   }
   ```

2. To publish a scoped package:
   - Create an npm account if you haven't already
   - Create your scope (can be your npm username)
   - When first publishing: `npm publish --access public`

Note: Private scoped packages require a paid npm account. Public scoped packages are free but must be explicitly published with `--access public`.

## Installation

### Local Development (Without Publishing to NPM)

There are three ways to use this package locally:

#### Option 1: Using npm link

1. After cloning this repository and building the package, create a global link (run in this directory):

   ```bash
   npm link
   ```

2. In your other project where you want to use this package:

   ```bash
   npm link example-package
   ```

3. Import the package in your project:

   ```typescript
   import { example, Person } from 'example-package';
   ```

#### Option 2: Using local path

In your other project's `package.json`, add this package as a dependency using the local path:

```json
{
  "dependencies": {
    "example-package": "file:/path/to/example-package"
  }
}
```

You can use absolute or relative paths with the `file:` protocol.

Then run `npm install` in your project.

Now you can import the package in your project as usual.

#### Option 3: Using a local tarball (npm pack)

1. In this directory, create a tarball:

   ```bash
   npm pack
   ```
   
   This will generate a file like `example-package-1.0.0.tgz`.

2. In your other project, install the tarball:

   ```bash
   npm install /absolute/path/to/example-package/example-package-1.0.0.tgz
   ```
   
   Or, if you copy the tarball into your project directory:
   
   ```bash
   npm install ./example-package-1.0.0.tgz
   ```

This method installs the package exactly as it would be published to npm, making it ideal for final testing.

### Installing from NPM (After Publishing)

Once published to NPM, the package can be installed using:

```bash
npm install example-package
```

## Usage

```typescript
// TypeScript
import { example, Person } from 'example-package';

// Type is fully supported in TypeScript
const person: Person = {
  name: 'John Doe',
  age: 30
};

example(person);
```

```javascript
// JavaScript
import { example } from 'example-package';

// Types are not visible in JavaScript but still provide runtime validation
const person = {
  name: 'John Doe',
  age: 30
};

example(person);
```

## Development

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development:

   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run build` - Build the package
- `npm run dev` - Run in development mode with watch
- `npm start` - Run the package
- `npm run debug` - Run with debugger attached
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Check code formatting 
- `npm run format:fix` - Format code with Prettier
- `npm run validate` - Run all checks (types, lint, format, tests)
- `npm run clean` - Clean the package (remove dist and coverage)
- `npm run clean:all` - Clean the package and all dependencies (remove dist, coverage, and node_modules)
- `npm run link` - Create a global link to the package
- `npm run unlink` - Remove the global link to the package

## Publishing to NPM

Make sure you have a NPM account and are logged in. Then, in this directory, follow these steps:

1. Build the package:

   ```bash
   npm run build
   ```

2. Publish to NPM:

   ```bash
   npm publish
   ```

Now anyone can install the package from NPM:

```bash
npm install example-package
```

## Release & Publish Workflow

### Automated Versioning and Changelog

This package uses [`standard-version`](https://github.com/conventional-changelog/standard-version) to automate versioning and changelog updates. To create a new release:

1. Make sure all your changes are committed.

2. Run:

   ```bash
   npm run release
   ```

   This will:

   - Bump the version in `package.json` according to your commit messages (using [Conventional Commits](https://www.conventionalcommits.org/)).
   - Update `CHANGELOG.md` with a summary of changes.
   - Create a new Git tag for the release.

3. Push your changes and tags:

   ```bash
   git push && git push --tags
   ```

### Publishing to NPM via GitHub Actions

This repository is set up to publish the package to NPM automatically using GitHub Actions:

- **When does it publish?**
  - When you create a new GitHub Release (from the GitHub UI or by pushing a tag and creating a release), or
  - When you manually trigger the workflow from the GitHub Actions tab.

- **What does it do?**
  - Installs dependencies, runs all validation (type-check, lint, format, tests), builds the package, and publishes to NPM if all checks pass.

**Note:** You must add your NPM token as a secret named `NPM_TOKEN` in your GitHub repository settings for publishing to work.
