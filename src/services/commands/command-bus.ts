import { singleton } from 'tsyringe';
import { ICommandHandler } from './interfaces';
import { ICommand } from './interfaces/i-command';

@singleton()
export class CommandBus {
  private readonly handlers: Record<string, ICommandHandler<ICommand, unknown>> = {};

  register(command: string, handler: ICommandHandler<ICommand, unknown>): CommandBus {
    this.handlers[command] = handler;
    return this;
  }

  async execute<TCommand extends ICommand, TResult>(command: TCommand): Promise<TResult> {
    const handler = this.handlers[command.constructor.name];

    if (!handler) {
      throw new Error(`No handler registered for command: ${command.constructor.name}`);
    }

    return handler.handle(command) as Promise<TResult>;
  }
}
