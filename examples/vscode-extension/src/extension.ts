import * as vscode from "vscode";
import { LogManagerImpl, type LogFunction } from "@madooei/simple-logger";

/**
 * Custom log function for VSCode extensions that uses window.showInformationMessage
 */
const createVSCodeLogFunction = (): LogFunction => {
  return (level: string, namespace: string, ...args: any[]) => {
    const message = [
      `[${level.toUpperCase()}] [${namespace}]`,
      ...args.map((arg) =>
        typeof arg === "object" && arg !== null
          ? JSON.stringify(arg, null, 2)
          : arg
      ),
    ].join(" ");

    // You can customize this based on log level
    if (level === "info") {
      vscode.window.showInformationMessage(message);
    } else if (level === "trace") {
      // For trace level, you might want to use a different approach
      // or show in output channel instead of popup
      vscode.window.showInformationMessage(`[DEBUG] ${message}`);
    }
  };
};

/**
 * Alternative implementation using output channel instead of popup messages
 */
const createVSCodeOutputChannelLogFunction = (
  outputChannel: vscode.OutputChannel
): LogFunction => {
  return (level: string, namespace: string, ...args: any[]) => {
    const timestamp = new Date().toISOString();
    const message = [
      `${timestamp} [${level.toUpperCase()}] [${namespace}]`,
      ...args.map((arg) =>
        typeof arg === "object" && arg !== null
          ? JSON.stringify(arg, null, 2)
          : arg
      ),
    ].join(" ");

    outputChannel.appendLine(message);
    if (level === "info") {
      outputChannel.show(true); // Show output channel for info level
    }
  };
};

export function activate(context: vscode.ExtensionContext) {
  // Get the log manager instance
  const logManager = LogManagerImpl.getInstance();

  // Option 1: Use information messages (popups)
  logManager.setLogFunction(createVSCodeLogFunction());

  // Option 2: Use output channel (uncomment to use instead)
  // const outputChannel = vscode.window.createOutputChannel("Simple Logger Demo");
  // logManager.setLogFunction(createVSCodeOutputChannelLogFunction(outputChannel));

  // Configure log levels
  logManager.setLogLevel("*", "info");
  logManager.setLogLevel("extension:*", "trace"); // Enable trace for extension namespace

  // Create loggers for different components
  const extensionLogger = logManager.getLogger("extension:main");
  const commandLogger = logManager.getLogger("extension:commands");
  const dataLogger = logManager.getLogger("extension:data");

  // Log extension activation
  extensionLogger.info("Extension activated successfully!");

  // Register a command that demonstrates logging
  const disposable = vscode.commands.registerCommand(
    "simple-logger-demo.helloWorld",
    () => {
      commandLogger.info("Hello World command executed");

      // Example of logging with different levels
      commandLogger.trace("This is debug information");
      commandLogger.info("Command completed successfully");

      // Example of logging objects
      const userData = {
        name: "VSCode User",
        workspace: vscode.workspace.name || "No workspace",
        activeEditor:
          vscode.window.activeTextEditor?.document.fileName ||
          "No active editor",
      };

      dataLogger.info("User data collected:", userData);

      vscode.window.showInformationMessage("Check the log messages!");
    }
  );

  context.subscriptions.push(disposable);

  // Example of different log levels in action
  extensionLogger.trace(
    "This trace message will appear because extension:* is set to trace"
  );

  const regularLogger = logManager.getLogger("regular:component");
  regularLogger.trace(
    "This trace message will NOT appear because * is set to info"
  );
  regularLogger.info("This info message will appear");

  // Example of logging errors
  try {
    throw new Error("Example error for demonstration");
  } catch (error) {
    extensionLogger.info("Caught an error:", error);
  }
}

export function deactivate() {
  const logManager = LogManagerImpl.getInstance();
  const extensionLogger = logManager.getLogger("extension:main");

  extensionLogger.info("Extension deactivated");

  // Reset to default logging behavior on deactivation
  logManager.resetLogFunction();
}
