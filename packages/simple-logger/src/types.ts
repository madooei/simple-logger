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

export type LogLevel = "trace" | "info" | "warn" | "error";
export type NamespacePattern = string | RegExp;

export interface Logger {
  trace(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}

export interface LogManager {
  getLogger(namespace: string): Logger;
  setLogLevel(namespacePattern: NamespacePattern, level: LogLevel): void;
  enable(): void;
  disable(): void;
}
