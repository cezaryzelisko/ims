import { PageOptionsModel } from '../../domain';

export class PageOptionsDto {
  readonly limit?: number | undefined;
  readonly page?: number | undefined;

  get offset(): number | undefined {
    if (this.page !== undefined && this.limit !== undefined) {
      return (this.page - 1) * this.limit;
    }
  }

  static toDomain(dto: PageOptionsDto): PageOptionsModel {
    return new PageOptionsModel(dto.limit, dto.offset);
  }

  constructor(_limit?: string, _page?: string) {
    if (_limit !== undefined) {
      this.limit = Number.parseInt(_limit, 10);
    }

    if (_page !== undefined) {
      this.page = Number.parseInt(_page, 10);
    }
  }
}
