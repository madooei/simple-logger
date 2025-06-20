# Simple Example Usage For `@madooei/simple-logger`

This is a simple example of how to use the `@madooei/simple-logger` package in a local project. The example demonstrates how to set up a basic logging system using the package.

## Setup

```bash
npm install
```

## Run the Example

```bash
npm run start
```

## How does it work?

The `@madooei/simple-logger` is a local package that is installed using the `file:` protocol; see the `dependencies` section in the `package.json` file:

```json
  "dependencies": {
    "@madooei/simple-logger": "file:../../packages/simple-logger"
  },
```

If you want to use this package through NPM, you can do so by changing the `dependencies` section in the `package.json` file to:

```json
  "dependencies": {
    "@madooei/simple-logger": "latest"
  },
```

Then install the dependencies again and it will be installed through NPM (assuming the package is published on NPM).
