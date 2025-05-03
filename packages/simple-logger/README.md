# Simple Logger

A lightweight, flexible logging system for ContentSmith that supports namespace-based logging with different log levels.

> [!TIP]
> Refer to this package's docs ([source](../../docs/index.md) or [website](https://proj-coursebook.github.io/simple-logger/)) for how to use it.

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
- `npm run release` - Create a new release (bump version, update changelog, create tag)

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

> [!NOTE]
> You must add your NPM token as a secret named `NPM_TOKEN` in your GitHub repository settings for publishing to work.
