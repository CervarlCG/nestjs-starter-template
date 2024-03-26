import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, catchError } from "rxjs";
import { LoggerService } from "./logger.service";
import { RequestService } from "../request/request.service";
import { SystemException } from "src/common/exceptions/system";

/**
 * Interceptor that logs errors during request handling.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private loggerService: LoggerService,
    private requestService: RequestService
  ) {}

  /**
   * Intercepts the request and logs any errors that occur during processing.
   * @param context - execution context of the request
   * @param next - handler for the request
   * @returns an Observable or a Promise of an Observable
   */
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError(async (err) => {
        const isSystemException = err instanceof SystemException;
        const shouldLogError = (isSystemException && err.allowLog) || !isSystemException;

        if (shouldLogError) {
          await this.loggerService.error(err, this.requestService.id).catch(console.error);
        }

        throw err;
      })
    );
  }
}
