import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { LogManagerImpl } from "@/index";

describe("LogManager", () => {
  let logManager: LogManagerImpl;
  let consoleMock: { log: any };

  beforeEach(() => {
    // Reset singleton
    (LogManagerImpl as any).instance = undefined;
    logManager = LogManagerImpl.getInstance();

    // Mock console methods
    consoleMock = {
      log: vi.spyOn(console, "log").mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Singleton", () => {
    it("should create only one instance", () => {
      const instance1 = LogManagerImpl.getInstance();
      const instance2 = LogManagerImpl.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe("Logger Creation", () => {
    it("should create new logger with namespace", () => {
      const logger = logManager.getLogger("test");
      logger.info("test message");
      expect(consoleMock.log).toHaveBeenCalledWith(
        "[INFO] [test]",
        "test message",
      );
    });

    it("should return same logger instance for same namespace", () => {
      const logger1 = logManager.getLogger("test");
      const logger2 = logManager.getLogger("test");
      expect(logger1).toBe(logger2);
    });
  });

  describe("Log Levels", () => {
    it("should respect log level hierarchy", () => {
      const logger = logManager.getLogger("test");

      logManager.setLogLevel("*", "info");
      logManager.setLogLevel("test", "info");

      logger.trace("trace");
      logger.info("info");

      expect(consoleMock.log).toHaveBeenCalledWith("[INFO] [test]", "info");
      expect(consoleMock.log).not.toHaveBeenCalledWith(
        "[TRACE] [test]",
        "trace",
      );
    });

    it("should handle different log levels for different namespaces", () => {
      const logger1 = logManager.getLogger("app:component1");
      const logger2 = logManager.getLogger("app:component2");

      logManager.setLogLevel("*", "info");
      logManager.setLogLevel("app:component1", "trace");
      logManager.setLogLevel("app:component2", "info");

      logger1.trace("trace1");
      logger2.trace("trace2");

      expect(consoleMock.log).toHaveBeenCalledWith(
        "[TRACE] [app:component1]",
        "trace1",
      );
      expect(consoleMock.log).not.toHaveBeenCalledWith(
        "[TRACE] [app:component2]",
        "trace2",
      );
    });

    it("should support wildcard patterns", () => {
      const logger = logManager.getLogger("app:test");

      logManager.setLogLevel("*", "info");
      logManager.setLogLevel("app:*", "trace");

      logger.trace("trace");
      logger.info("info");

      expect(consoleMock.log).toHaveBeenCalledWith(
        "[TRACE] [app:test]",
        "trace",
      );
      expect(consoleMock.log).toHaveBeenCalledWith("[INFO] [app:test]", "info");
    });

    it("should support regex patterns", () => {
      const logger = logManager.getLogger("test:123");

      logManager.setLogLevel("*", "info");
      logManager.setLogLevel(/test:\d+/, "trace");

      logger.trace("trace");
      logger.info("info");

      expect(consoleMock.log).toHaveBeenCalledWith(
        "[TRACE] [test:123]",
        "trace",
      );
      expect(consoleMock.log).toHaveBeenCalledWith("[INFO] [test:123]", "info");
    });

    it("regex patterns should override wildcard and prefix patterns", () => {
      const logger = logManager.getLogger("app:component1");

      logManager.setLogLevel("*", "info");
      logManager.setLogLevel("app:*", "info");
      logManager.setLogLevel(/app:component\d+/, "trace");

      logger.trace("trace");

      expect(consoleMock.log).toHaveBeenCalledWith(
        "[TRACE] [app:component1]",
        "trace",
      );
    });

    it("exact patterns should override regex patterns", () => {
      const logger = logManager.getLogger("app:component1");

      logManager.setLogLevel("*", "info");
      logManager.setLogLevel(/app:component\d+/, "trace");
      logManager.setLogLevel("app:component1", "info");

      logger.trace("trace");
      logger.info("info");

      expect(consoleMock.log).not.toHaveBeenCalledWith(
        "[TRACE] [app:component1]",
        "trace",
      );
      expect(consoleMock.log).toHaveBeenCalledWith(
        "[INFO] [app:component1]",
        "info",
      );
    });

    it("should prioritize regex level over wildcard", () => {
      const logger = logManager.getLogger("test:42");

      logManager.setLogLevel(/test:\d+/, "trace");
      logManager.setLogLevel("*", "info");

      logger.trace("trace");

      expect(consoleMock.log).toHaveBeenCalledWith("[TRACE] [test:42]", "trace");
    });
  });

  describe("Enable/Disable", () => {
    it("should not log when disabled", () => {
      const logger = logManager.getLogger("test");

      logManager.disable();
      logger.info("test");

      expect(consoleMock.log).not.toHaveBeenCalled();
    });

    it("should resume logging when re-enabled", () => {
      const logger = logManager.getLogger("test");

      logManager.disable();
      logger.info("test1");

      logManager.enable();
      logger.info("test2");

      expect(consoleMock.log).not.toHaveBeenCalledWith(
        "[INFO] [test]",
        "test1",
      );
      expect(consoleMock.log).toHaveBeenCalledWith("[INFO] [test]", "test2");
    });
  });

  describe("Object Logging", () => {
    it("should stringify objects", () => {
      const logger = logManager.getLogger("test");
      const testObj = { foo: "bar" };

      logger.info("test", testObj);

      expect(consoleMock.log).toHaveBeenCalledWith(
        "[INFO] [test]",
        "test",
        JSON.stringify(testObj, null, 2),
      );
    });

    it("should log null without quotes", () => {
      const logger = logManager.getLogger("test");

      logger.info("value", null);

      expect(consoleMock.log).toHaveBeenCalledWith(
        "[INFO] [test]",
        "value",
        null,
      );
    });
  });
});
