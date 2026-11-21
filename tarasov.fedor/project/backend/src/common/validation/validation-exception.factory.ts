import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

function collectMessages(errors: ValidationError[]): string[] {
  const messages: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }

    if (error.children && error.children.length > 0) {
      messages.push(...collectMessages(error.children));
    }
  }

  return messages;
}

export function validationExceptionFactory(
  errors: ValidationError[],
): BadRequestException {
  const messages = [...new Set(collectMessages(errors))];

  return new BadRequestException({
    statusCode: 400,
    message:
      messages.length > 0
        ? messages
        : ['Проверьте правильность заполнения формы'],
    error: 'Некорректный запрос',
  });
}
