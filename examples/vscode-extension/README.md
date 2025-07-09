# VSCode Extension Example

This example demonstrates how to use `@madooei/simple-logger` in a VSCode extension with custom log functions.

## Features Demonstrated

- **Custom Log Function**: Uses `vscode.window.showInformationMessage` for logging
- **Alternative Output Channel**: Shows how to log to VSCode's output channel
- **Namespace-based Logging**: Different loggers for different extension components
- **Log Level Configuration**: Different log levels for different namespaces
- **Object Logging**: Demonstrates logging complex objects and error handling

## Key Components

### Custom Log Functions

1. **Information Message Logger**: Shows logs as popup messages
2. **Output Channel Logger**: Logs to VSCode's output channel with timestamps

### Usage in Extension

```typescript
import { LogManagerImpl, type LogFunction } from "@madooei/simple-logger";

// Set up custom logging
const logManager = LogManagerImpl.getInstance();
logManager.setLogFunction(createVSCodeLogFunction());

// Configure log levels
logManager.setLogLevel("*", "info");
logManager.setLogLevel("extension:*", "trace");

// Create loggers for different components
const extensionLogger = logManager.getLogger("extension:main");
const commandLogger = logManager.getLogger("extension:commands");
```

## Running the Example

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. For actual VSCode extension development:
   - Add this to your `package.json` activationEvents and contributes sections
   - Press F5 in VSCode to run the extension in a new Extension Development Host window

## Benefits of This Approach

- **Integrated Logging**: Logs appear in VSCode's native UI
- **Namespace Control**: Fine-grained control over what gets logged
- **Consistent API**: Same simple-logger API across all components
- **Easy Testing**: Can switch between popup messages and output channel
- **Error Handling**: Structured error logging with context

## Customization Options

You can customize the log function to:
- Use different VSCode message types based on log level
- Format messages differently
- Route different namespaces to different output channels
- Add timestamps, colors, or other formatting
- Integrate with external logging services

## Example Output

When you run the extension and execute the "Hello World" command, you'll see:
- Extension activation message
- Command execution logs
- User data with workspace information
- Demonstration of different log levels
- Error handling example