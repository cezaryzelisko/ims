import HttpStatus from 'http-status-codes';
import { DomainError, DomainErrorsEnum } from '../../domain';
import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function apiErrorHandlerMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): Response {
  if (err instanceof DomainError) {
    switch (err.key) {
      case DomainErrorsEnum.ValidationError: {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ key: DomainErrorsEnum.ValidationError, message: err.message, details: err.details });
      }
      case DomainErrorsEnum.NotAllowedError: {
        return res.status(HttpStatus.CONFLICT).json({ key: err.key, message: err.message });
      }
      case DomainErrorsEnum.NotFoundError: {
        return res.status(HttpStatus.NOT_FOUND).json({ key: err.key, message: err.message });
      }
      case DomainErrorsEnum.ProcessingError: {
        return res.status(HttpStatus.CONFLICT).json({ key: err.key, message: err.message });
      }
    }
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
}
