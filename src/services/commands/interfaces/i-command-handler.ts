export interface ICommandHandler<C, R> {
  handle(command: C): Promise<R | null>;
}
