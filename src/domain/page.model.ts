import { PageOptionsModel } from './page-options.model';

export class PageModel<T> {
  readonly options: PageOptionsModel;

  get pagesCount(): number {
    return Math.ceil(this.count / this.options.limit);
  }

  constructor(
    readonly data: T[],
    readonly count: number,
    options?: PageOptionsModel,
  ) {
    this.options = options ? options : PageOptionsModel.from(options);
  }
}
