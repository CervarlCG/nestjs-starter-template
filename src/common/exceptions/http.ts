import { HttpException, HttpExceptionOptions, HttpStatus } from "@nestjs/common";

export class HttpRequestException extends HttpException {
  constructor( { statusCode, message, requestId, description, options }: {
    statusCode: number,
    message: string,
    requestId: string,
    description: string,
    options?: HttpExceptionOptions
  }) {
    super( {...HttpException.createBody(message, description, statusCode), requestId}, statusCode, options);
  }
}
