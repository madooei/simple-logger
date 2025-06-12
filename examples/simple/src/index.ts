import { LogManagerImpl, type Logger } from '@coursebook/simple-logger';

// Get the logger instance
const logManager = LogManagerImpl.getInstance();

// Create a logger for your component
const logger: Logger = logManager.getLogger('myapp:component');

// Try running with different log levels
// logManager.setLogLevel('myapp:component', 'trace');
logManager.setLogLevel('myapp:component', 'info');
// logManager.disable();

// Log at different levels
logger.trace('Detailed debugging');
logger.info('General information');
