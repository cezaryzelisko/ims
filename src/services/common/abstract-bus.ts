import { IOperationHandler } from './i-operation-handler';
import { IOperation } from './i-operation';
import { singleton } from 'tsyringe';

@singleton()
export class GenericBus {
  private readonly handlers: Record<string, IOperationHandler<IOperation, unknown>> = {};

  register(command: string, handler: IOperationHandler<IOperation, unknown>): GenericBus {
    this.handlers[command] = handler;
    return this;
  }

  async execute<TOperation extends IOperation, TResult>(command: TOperation): Promise<TResult> {
    const handler = this.handlers[command.constructor.name];

    if (!handler) {
      throw new Error(`No handler registered for operation: ${command.constructor.name}`);
    }

    return handler.handle(command) as Promise<TResult>;
  }
}
