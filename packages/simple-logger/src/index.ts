import type {
  LogLevel,
  Logger,
  LogManager,
  NamespacePattern,
  LogManagerError,
  LogManagerErrorType,
} from "./types";

class LoggerImpl implements Logger {
  constructor(
    private readonly namespace: string,
    private readonly manager: LogManagerImpl,
  ) {}

  trace(...args: any[]): void {
    this.manager.log(this.namespace, "trace", ...args);
  }

  info(...args: any[]): void {
    this.manager.log(this.namespace, "info", ...args);
  }

  warn(...args: any[]): void {
    this.manager.log(this.namespace, "warn", ...args);
  }

  error(...args: any[]): void {
    this.manager.log(this.namespace, "error", ...args);
  }
}

export class LogManagerImpl implements LogManager {
  private static instance: LogManagerImpl;
  private logLevels: Map<NamespacePattern, LogLevel> = new Map();
  private loggers: Map<string, Logger> = new Map();
  private enabled: boolean = true;

  private constructor() {
    // Default to info level for all namespaces
    this.setLogLevel("*", "info");
  }

  static getInstance(): LogManagerImpl {
    if (!LogManagerImpl.instance) {
      LogManagerImpl.instance = new LogManagerImpl();
    }
    return LogManagerImpl.instance;
  }

  getLogger(namespace: string): Logger {
    let logger = this.loggers.get(namespace);
    if (!logger) {
      logger = new LoggerImpl(namespace, this);
      this.loggers.set(namespace, logger);
    }
    return logger;
  }

  setLogLevel(namespacePattern: NamespacePattern, level: LogLevel): void {
    this.logLevels.set(namespacePattern, level);
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  private matchesStringPattern(namespace: string, pattern: string): boolean {
    if (pattern === "*") return true;

    // If pattern ends with *, check if namespace starts with the pattern prefix
    if (pattern.endsWith("*")) {
      const prefix = pattern.slice(0, -1);
      return namespace.startsWith(prefix);
    }

    // Otherwise, exact match
    return namespace === pattern;
  }

  private shouldLog(namespace: string, level: LogLevel): boolean {
    if (!this.enabled) return false;

    let matchedLevel: LogLevel | null = null;
    let matchedPatternLength = -1; // Track the length of the matched pattern

    for (const [pattern, logLevel] of this.logLevels) {
      if (typeof pattern === "string") {
        if (this.matchesStringPattern(namespace, pattern)) {
          // For wildcard patterns, use the length without the *
          const effectiveLength =
            pattern === "*"
              ? 0
              : pattern.endsWith("*")
                ? pattern.length - 1
                : pattern.length;
          if (effectiveLength > matchedPatternLength) {
            matchedLevel = logLevel;
            matchedPatternLength = effectiveLength;
          }
        }
      } else if (pattern instanceof RegExp && pattern.test(namespace)) {
        // RegExp patterns take precedence over wildcard but not over exact matches
        if (matchedPatternLength <= 0) {
          matchedLevel = logLevel;
          matchedPatternLength = 1;
        }
      }
    }

    return matchedLevel ? this.compareLevels(level, matchedLevel) : false;
  }

  private compareLevels(
    messageLevel: LogLevel,
    configuredLevel: LogLevel,
  ): boolean {
    const levels: LogLevel[] = ["trace", "info", "warn", "error"];
    return levels.indexOf(messageLevel) >= levels.indexOf(configuredLevel);
  }

  log(namespace: string, level: LogLevel, ...args: any[]): void {
    if (this.shouldLog(namespace, level)) {
      const logMethod =
        level === "warn"
          ? console.warn
          : level === "error"
            ? console.error
            : console.log;

      const prefix = `[${level.toUpperCase()}] [${namespace}]`;
      logMethod(
        prefix,
        ...args.map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg,
        ),
      );
    }
  }
}

export type {
  LogLevel,
  Logger,
  LogManager,
  NamespacePattern,
  LogManagerError,
  LogManagerErrorType,
};
