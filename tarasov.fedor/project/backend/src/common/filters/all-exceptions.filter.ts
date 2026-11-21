import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

const RUSSIAN_ERROR_TITLES: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'Некорректный запрос',
  [HttpStatus.UNAUTHORIZED]: 'Требуется авторизация',
  [HttpStatus.FORBIDDEN]: 'Доступ запрещен',
  [HttpStatus.NOT_FOUND]: 'Ресурс не найден',
  [HttpStatus.CONFLICT]: 'Конфликт данных',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Не удалось обработать данные',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Ошибка сервера',
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (status === HttpStatus.NOT_FOUND) {
        response.status(status).json({
          statusCode: status,
          message: 'Запрашиваемый ресурс не найден',
          error: 'Ресурс не найден',
        });
        return;
      }

      const responseBody =
        typeof exceptionResponse === 'string'
          ? { message: exceptionResponse }
          : (exceptionResponse as Record<string, unknown>);

      response.status(status).json({
        statusCode: status,
        message:
          responseBody.message ??
          RUSSIAN_ERROR_TITLES[status] ??
          'Ошибка запроса',
        error: RUSSIAN_ERROR_TITLES[status] ?? 'Ошибка запроса',
      });
      return;
    }

    this.logger.error(exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Внутренняя ошибка сервера',
      error: 'Ошибка сервера',
    });
  }
}
