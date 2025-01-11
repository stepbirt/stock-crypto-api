import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const httpStatus =
      exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse();
    let errorDetails = null;
    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse.hasOwnProperty('message')
    ) {
      errorDetails = exceptionResponse['message'];
    }

    response.status(httpStatus).json({
      statusCode: httpStatus,
      message: errorDetails || exception.message,
    });
  }
}
