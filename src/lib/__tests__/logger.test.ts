// Mock console methods
const originalConsole = { ...console };
const mockConsole = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

beforeEach(() => {
  Object.assign(console, mockConsole);
  jest.clearAllMocks();
});

afterAll(() => {
  Object.assign(console, originalConsole);
});

describe('logger', () => {
  describe('in development environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      jest.resetModules();
    });

    it('should log info messages', async () => {
      const { logger } = await import('../logger');
      logger.info('Test info message');
      expect(mockConsole.log).toHaveBeenCalledWith('ℹ️  Test info message');
    });

    it('should log warning messages', async () => {
      const { logger } = await import('../logger');
      logger.warn('Test warning message');
      expect(mockConsole.warn).toHaveBeenCalledWith('⚠️  Test warning message');
    });

    it('should log debug messages', async () => {
      const { logger } = await import('../logger');
      logger.debug('Test debug message');
      expect(mockConsole.debug).toHaveBeenCalledWith('🐛 Test debug message');
    });

    it('should log API requests', async () => {
      const { logger } = await import('../logger');
      logger.api.request('GET', '/test-endpoint', { data: 'test' });
      expect(mockConsole.log).toHaveBeenCalledWith('🔵 API GET /test-endpoint', { data: { data: 'test' } });
    });

    it('should log API responses', async () => {
      const { logger } = await import('../logger');
      logger.api.response('GET', '/test-endpoint', 200, { result: 'success' });
      expect(mockConsole.log).toHaveBeenCalledWith('🟢 API GET /test-endpoint - 200', { data: { result: 'success' } });
    });

    it('should log API errors', async () => {
      const { logger } = await import('../logger');
      logger.api.error('GET', '/test-endpoint', new Error('Test error'));
      expect(mockConsole.error).toHaveBeenCalledWith('🔴 API GET /test-endpoint - ERROR:', new Error('Test error'));
    });
  });

  describe('in production environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      jest.resetModules();
    });

    it('should not log info messages', async () => {
      const { logger } = await import('../logger');
      logger.info('Test info message');
      expect(mockConsole.log).not.toHaveBeenCalled();
    });

    it('should not log warning messages', async () => {
      const { logger } = await import('../logger');
      logger.warn('Test warning message');
      expect(mockConsole.warn).not.toHaveBeenCalled();
    });

    it('should not log debug messages', async () => {
      const { logger } = await import('../logger');
      logger.debug('Test debug message');
      expect(mockConsole.debug).not.toHaveBeenCalled();
    });

    it('should still log error messages', async () => {
      const { logger } = await import('../logger');
      logger.error('Test error message');
      expect(mockConsole.error).toHaveBeenCalledWith('❌ Test error message');
    });

    it('should not log API requests', async () => {
      const { logger } = await import('../logger');
      logger.api.request('GET', '/test-endpoint');
      expect(mockConsole.log).not.toHaveBeenCalled();
    });
  });
});