/**
 * Production Logging & Monitoring Utility
 * 
 * Provides consistent logging, error tracking, and performance monitoring
 * across the application
 */

import { ENV, ENABLE_LOGGING } from '../../environments/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: any;
  error?: Error;
}

const LOG_STORAGE: LogEntry[] = [];
const MAX_LOGS = 500; // Keep last 500 logs in memory

class Logger {
  private module: string;

  constructor(moduleName: string) {
    this.module = moduleName;
  }

  private addToStorage(entry: LogEntry) {
    LOG_STORAGE.push(entry);
    // Keep only last MAX_LOGS entries
    if (LOG_STORAGE.length > MAX_LOGS) {
      LOG_STORAGE.shift();
    }
  }

  private formatMessage(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const prefix = `[${ENV.toUpperCase()}] [${level.toUpperCase()}] [${this.module}]`;
    return { timestamp, prefix, message, data };
  }

  debug(message: string, data?: any) {
    if (ENABLE_LOGGING) {
      const { prefix, message: msg } = this.formatMessage('debug', message, data);
      console.log(`${prefix} ${msg}`, data);
      this.addToStorage({
        timestamp: new Date().toISOString(),
        level: 'debug',
        module: this.module,
        message,
        data,
      });
    }
  }

  info(message: string, data?: any) {
    if (ENABLE_LOGGING) {
      const { prefix, message: msg } = this.formatMessage('info', message, data);
      console.log(`${prefix} ${msg}`, data);
      this.addToStorage({
        timestamp: new Date().toISOString(),
        level: 'info',
        module: this.module,
        message,
        data,
      });
    }
  }

  warn(message: string, data?: any) {
    const { prefix, message: msg } = this.formatMessage('warn', message, data);
    console.warn(`${prefix} ${msg}`, data);
    this.addToStorage({
      timestamp: new Date().toISOString(),
      level: 'warn',
      module: this.module,
      message,
      data,
    });
  }

  error(message: string, error?: Error | any, data?: any) {
    const { prefix, message: msg } = this.formatMessage('error', message, data);
    console.error(`${prefix} ${msg}`, error, data);
    this.addToStorage({
      timestamp: new Date().toISOString(),
      level: 'error',
      module: this.module,
      message,
      data,
      error: error instanceof Error ? error : new Error(String(error)),
    });
  }

  static getStoredLogs(): LogEntry[] {
    return [...LOG_STORAGE];
  }

  static clearLogs() {
    LOG_STORAGE.length = 0;
  }

  static exportLogs(): string {
    return JSON.stringify(LOG_STORAGE, null, 2);
  }
}

export const createLogger = (moduleName: string): Logger => {
  return new Logger(moduleName);
};

export default Logger;
