import { PageModel } from '../../domain';

export class PageDto<T> {
  constructor(
    readonly data: T[],
    readonly pagesCount: number,
  ) {}

  static fromDomain<TModel, TDto>(model: PageModel<TModel>, fn: (item: TModel) => TDto): PageDto<TDto> {
    return new PageDto(
      model.data.map((item) => fn(item)),
      model.pagesCount,
    );
  }
}
