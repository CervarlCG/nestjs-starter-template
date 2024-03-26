import { Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Log } from "./entities/logger.entity";
import { LogRecord, LogLevel } from "./types";

/**
 * A service that provides logging functionalities.
 */
@Injectable()
export class LoggerService {
  /**
   * Constructor for LoggerService.
   * @param logsRepository - The repository for Log entities.
   */
  constructor(
    @InjectRepository(Log)
    private logsRepository: Repository<Log>,
  ){}

  /**
   * Logs a record to the database.
   * @param logRecord - The log record to be saved.
   * @returns A Promise that resolves to the saved Log entity or null if an error occurred.
   */
  async log(logRecord: LogRecord): Promise<Log | null> {
    try {
      const log = this.logsRepository.create(logRecord);
      return await this.logsRepository.save(log);
    } catch(err) {
      return null;
    }
  }

  /**
   * Logs an error to the database.
   * @param err - The error to be logged.
   * @param requestId - The request ID associated with the error.
   * @returns A Promise that resolves to the saved Log entity or null if an error occurred.
   */
  async error(err: Error, requestId: string) {
    if (!(err instanceof Error)) return;
    const logRecord = {
      level: LogLevel.ERROR,
      message: err.message,
      trace: err.stack || "",
      requestId,
    };
    const logSaved = await this.log(logRecord).catch(err => null);
    return logSaved;
  }

  /**
   * Finds a log record by request ID.
   * @param requestId - The request ID to search for.
   * @returns A Promise that resolves to the found Log entity or undefined.
   */
  async find(requestId: string) {
    return this.logsRepository.findOne({ where: { requestId } });
  }

  /**
   * Removes a log record by request ID.
   * @param requestId - The request ID of the log to be removed.
   * @returns A Promise that resolves to the result of the delete operation.
   */
  async remove(requestId: string) {
    return this.logsRepository.delete({ requestId });
  }
}
