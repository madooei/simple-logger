import { LogManagerImpl } from "@madooei/simple-logger";

const logManager = LogManagerImpl.getInstance();

// Set default log level to info
logManager.setLogLevel("*", "info");

// Create loggers for different components
const userLogger = logManager.getLogger("app:user");
const authLogger = logManager.getLogger("app:auth");
const debugLogger = logManager.getLogger("app:debug");

console.log("=== Initial logging (info level) ===");
userLogger.info("User logged in");
authLogger.info("Authentication successful");
debugLogger.info("Debug info");

console.log("\n=== Setting debug component to trace level ===");
logManager.setLogLevel("app:debug", "trace");
debugLogger.trace("Detailed debug trace");
debugLogger.info("Debug info with trace enabled");

console.log("\n=== Setting auth component to none (disabled) ===");
logManager.setLogLevel("app:auth", "none");
userLogger.info("User action");
authLogger.info("This won't be logged");
authLogger.trace("This also won't be logged");
debugLogger.trace("Debug trace still works");

console.log("\n=== Re-enabling auth component ===");
logManager.setLogLevel("app:auth", "info");
authLogger.info("Auth logging is back!");
