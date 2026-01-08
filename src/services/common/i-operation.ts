export interface IOperation {
  readonly contextId: string;

  stringify(): string;
}
