export interface IOperationHandler<O, R> {
  handle(operation: O): Promise<R | null>;
}
