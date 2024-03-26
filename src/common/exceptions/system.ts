export class SystemException extends Error {
  exposeMessage = true;
  allowLog = false;
  
  constructor(message: string = 'Unknown error.') {
    super(message);
  }
}

export class ParametersException extends SystemException{};

export class UnauthorizedException extends SystemException{};

export class ForbiddenException extends SystemException {}

export class ResourceNotFoundException extends SystemException {}

export class ResourceConflictException extends SystemException {}

export class BadGatewayException extends SystemException {}

export class ServiceUnavailableException extends SystemException {}

export class ServerException extends SystemException{
  exposeMessage = false;
  allowLog = true;
};