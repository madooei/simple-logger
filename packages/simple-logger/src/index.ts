import type {
  LogLevel,
  Logger,
  LogManager,
  NamespacePattern,
  LogManagerError,
  LogManagerErrorType,
  LogFunction,
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
}

export class LogManagerImpl implements LogManager {
  private static instance: LogManagerImpl;
  private logLevels: Map<NamespacePattern, LogLevel> = new Map();
  private loggers: Map<string, Logger> = new Map();
  private enabled: boolean = true;
  private logFunction: LogFunction;

  private constructor() {
    // Default to info level for all namespaces
    this.setLogLevel("*", "info");
    // Initialize with default log function
    this.logFunction = this.defaultLogFunction;
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

  setLogFunction(logFunction: LogFunction): void {
    this.logFunction = logFunction;
  }

  resetLogFunction(): void {
    this.logFunction = this.defaultLogFunction;
  }

  private defaultLogFunction: LogFunction = (
    level: LogLevel,
    namespace: string,
    ...args: any[]
  ) => {
    const prefix = `[${level.toUpperCase()}] [${namespace}]`;
    console.log(
      prefix,
      ...args.map((arg) =>
        typeof arg === "object" && arg !== null
          ? JSON.stringify(arg, null, 2)
          : arg,
      ),
    );
  };

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
    let bestPriority = -1;
    let bestLength = -1;

    const getPriority = (pattern: NamespacePattern): number => {
      if (typeof pattern === "string") {
        if (pattern === "*") return 0; // wildcard
        if (pattern.endsWith("*")) return 1; // prefix
        return 3; // exact
      }
      return 2; // regex
    };

    const getLength = (pattern: NamespacePattern): number => {
      if (typeof pattern === "string") {
        if (pattern === "*") return 0;
        if (pattern.endsWith("*")) return pattern.length - 1;
        return pattern.length;
      }
      return pattern.source.length;
    };

    for (const [pattern, logLevel] of this.logLevels) {
      const isMatch =
        typeof pattern === "string"
          ? this.matchesStringPattern(namespace, pattern)
          : pattern.test(namespace);

      if (!isMatch) continue;

      const priority = getPriority(pattern);
      const length = getLength(pattern);

      if (
        priority > bestPriority ||
        (priority === bestPriority && length > bestLength)
      ) {
        matchedLevel = logLevel;
        bestPriority = priority;
        bestLength = length;
      }
    }

    return matchedLevel ? this.compareLevels(level, matchedLevel) : false;
  }

  private compareLevels(
    messageLevel: LogLevel,
    configuredLevel: LogLevel,
  ): boolean {
    const levels: LogLevel[] = ["trace", "info"];
    return levels.indexOf(messageLevel) >= levels.indexOf(configuredLevel);
  }

  log(namespace: string, level: LogLevel, ...args: any[]): void {
    if (this.shouldLog(namespace, level)) {
      this.logFunction(level, namespace, ...args);
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
  LogFunction,
};
