import { LogManagerImpl } from '@madooei/simple-logger';

// Get the logger instance
const logManager = LogManagerImpl.getInstance();

// Create a logger for your component
const logger = logManager.getLogger('myapp:component');

// Log at different levels
logger.trace('Detailed debugging');
logger.info('General information');
logger.warn('Warning message');
logger.error('Error occurred', { details: 'error info' });