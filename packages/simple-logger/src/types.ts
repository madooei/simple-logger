/**
 * Error types specific to logging operations
 */
export enum LogManagerErrorType {
  INVALID_LOG_LEVEL = "INVALID_LOG_LEVEL",
  LOGGER_CREATE_ERROR = "LOGGER_CREATE_ERROR",
}

/**
 * Error class for logging operations
 */
export class LogManagerError extends Error {
  constructor(
    public type: LogManagerErrorType,
    message: string,
    public cause?: Error,
  ) {
    super(message);
    this.name = "LogManagerError";
  }
}

export type LogLevel = "trace" | "info";
export type NamespacePattern = string | RegExp;

/**
 * Logger interface for logging messages
 * with different log levels.
 * Each method accepts any number of arguments
 * and logs them at the corresponding log level.
 */
export interface Logger {
  trace(...args: any[]): void;
  info(...args: any[]): void;
}

/**
 * LogManager interface for managing loggers
 * and their log levels.
 * It provides methods to get a logger for a specific namespace,
 * set log levels for namespaces, and enable/disable logging.
 */
export interface LogManager {
  getLogger(namespace: string): Logger;
  setLogLevel(namespacePattern: NamespacePattern, level: LogLevel): void;
  enable(): void;
  disable(): void;
}
