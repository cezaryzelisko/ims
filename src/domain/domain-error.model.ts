import { DomainErrorsEnum } from './domain-errors.enum';

export class DomainError extends Error {
  constructor(
    readonly message: string,
    readonly key: DomainErrorsEnum,
    readonly details?: unknown,
  ) {
    super(message);
  }
}
