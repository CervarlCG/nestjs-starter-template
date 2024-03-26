import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor, ServiceUnavailableException } from "@nestjs/common";
import { Observable, catchError } from "rxjs";
import { RequestService } from "../request/request.service";
import { 
  ParametersException, 
  UnauthorizedException,
  ForbiddenException,
  ResourceNotFoundException,
  ResourceConflictException,
  BadGatewayException,
  ServerException,
  SystemException,
} from "src/common/exceptions/system";
import { HttpRequestException } from "src/common/exceptions/http";
import { messageForNoExposeError } from "src/common/constants/exceptions";

/**
 * HttpInterceptor is a NestJS interceptor that handles exceptions thrown during
 * the processing of HTTP requests. It intercepts exceptions and converts them
 * into appropriate HTTP responses with corresponding status codes and messages.
 * This interceptor ensures that the client receives a standardized error response
 * and that sensitive error details are not exposed.
 */
@Injectable()
export class HttpInterceptor implements NestInterceptor {
  constructor(
    private requestService: RequestService
  ){}

  /**
   * Intercepts an HTTP request and handles any exceptions thrown during its processing.
   * @param {ExecutionContext} context - The execution context of the request.
   * @param {CallHandler} next - The next call handler in the NestJS interceptor chain.
   * @returns {Observable<any>} An observable that emits the result of the request processing.
   */
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp();
    if( !request ) return next.handle();

    return next.handle().pipe(
      catchError(async (err) => {
        const { code, description } = this.getErrorStatusAndDescription(err);
        const message = this.getErrorMessage(err);

        throw new HttpRequestException({message, statusCode: code, requestId: this.requestService.id, description});
      })
    )
  }

  /**
   * Determines the appropriate HTTP status code and description based on the provided error.
   * @param {any} err - The error object caught during request processing.
   * @returns {{ code: HttpStatus; description: string }} An object containing the status code and description.
   */
  private getErrorStatusAndDescription(err: any): { code: HttpStatus; description: string } {
    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    let description = 'Internal Server Error';

    if (err instanceof ParametersException) {
      code = HttpStatus.BAD_REQUEST;
      description = 'Bas Request';
    } else if (err instanceof UnauthorizedException) {
      code = HttpStatus.UNAUTHORIZED;
      description = 'Unauthorized';
    } else if (err instanceof ForbiddenException) {
      code = HttpStatus.FORBIDDEN;
      description = 'Forbidden';
    } else if (err instanceof ResourceNotFoundException) {
      code = HttpStatus.NOT_FOUND;
      description = 'Not Found';
    } else if (err instanceof ResourceConflictException) {
      code = HttpStatus.CONFLICT;
      description = 'Conflict';
    } else if (err instanceof BadGatewayException) {
      code = HttpStatus.BAD_GATEWAY;
      description = 'Bad Gateway';
    } else if (err instanceof ServiceUnavailableException) {
      code = HttpStatus.SERVICE_UNAVAILABLE;
      description = 'Service Unavailable';
    } else if (err instanceof ServerException) {
      code = HttpStatus.INTERNAL_SERVER_ERROR;
      description = 'Internal Server Error';
    }
    return { code, description };
  }


  /**
   * Determines the error message to be returned to the client.
   * If the error should not expose its message, a generic message is returned.
   * @param {any} err - The error object caught during request processing.
   * @returns {string} The error message to be returned.
   */
  private getErrorMessage(err: any): string {
    const isSystemException = err instanceof SystemException;
    if ((isSystemException && !err.exposeMessage) || !isSystemException) {
      return messageForNoExposeError;
    }
    return err.message;
  }
}