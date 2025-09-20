// utils/logger.ts

import { env } from "../constants/varsFromEnv";

enum LogLevel {
  NONE = 'NONE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

// No-op function to disable logging in production
export function nopFunc() { }

// Helper to check if a log level is enabled
const isEnabled
  = (level: LogLevel) => env.LOG_LEVELS.includes(level);

// Logger implementation
export const logger = Object.freeze({
  debug: isEnabled(LogLevel.DEBUG)
    ? (...args: unknown[]) => console.debug(...args)
    : nopFunc,

  info: isEnabled(LogLevel.INFO)
    ? (...args: unknown[]) => console.info(...args)
    : nopFunc,

  warn: isEnabled(LogLevel.WARN)
    ? (...args: unknown[]) => console.warn(...args)
    : nopFunc,

  error: isEnabled(LogLevel.ERROR)
    ? (...args: unknown[]) => console.error(...args)
    : nopFunc,

  json: isEnabled(LogLevel.DEBUG)
    ? (arg: unknown) => console.debug(JSON.stringify(arg, null, 2))
    : nopFunc,
});