import HttpStatus from 'http-status-codes';
import { DomainError, DomainErrorsEnum } from '../../domain';
import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function apiErrorHandlerMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): Response {
  if (err instanceof DomainError) {
    if (err.key === DomainErrorsEnum.ValidationError) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ key: DomainErrorsEnum.ValidationError, message: err.message, details: err.details });
    }
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
}
