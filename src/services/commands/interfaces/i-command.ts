export interface ICommand {
  readonly contextId: string;

  stringify(): string;
}
