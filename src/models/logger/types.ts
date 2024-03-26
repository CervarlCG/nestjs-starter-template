export enum LogLevel {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR"
}

export interface LogRecord {
  requestId: string;
  message: string;
  level: LogLevel;
  trace: string;
}