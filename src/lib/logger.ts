// Use a try-catch to handle cases where env.ts might not be available during build
let isDevelopment = false;
try {
  isDevelopment = process.env.NODE_ENV === 'development';
} catch {
  isDevelopment = false;
}

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`ℹ️  ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.warn(`⚠️  ${message}`, ...args);
    }
  },
  
  error: (message: string, ...args: any[]) => {
    // Always log errors, even in production
    console.error(`❌ ${message}`, ...args);
  },
  
  debug: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.debug(`🐛 ${message}`, ...args);
    }
  },
  
  // For API requests/responses - only in development
  api: {
    request: (method: string, url: string, data?: any) => {
      if (isDevelopment) {
        console.log(`🔵 API ${method.toUpperCase()} ${url}`, data ? { data } : '');
      }
    },
    
    response: (method: string, url: string, status: number, data?: any) => {
      if (isDevelopment) {
        const emoji = status >= 400 ? '🔴' : '🟢';
        console.log(`${emoji} API ${method.toUpperCase()} ${url} - ${status}`, data ? { data } : '');
      }
    },
    
    error: (method: string, url: string, error: any) => {
      if (isDevelopment) {
        console.error(`🔴 API ${method.toUpperCase()} ${url} - ERROR:`, error);
      }
    }
  }
};