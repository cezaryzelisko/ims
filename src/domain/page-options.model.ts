export class PageOptionsModel {
  private readonly defaultLimit = 10;
  private readonly maxLimit = 20;
  private readonly defaultOffset = 0;

  get limit(): number {
    return Math.min(this._limit ? this._limit : this.defaultLimit, this.maxLimit);
  }

  get offset(): number {
    return this._offset ?? this.defaultOffset;
  }

  static from(options?: PageOptionsModel): PageOptionsModel {
    return new PageOptionsModel(options?.limit, options?.offset);
  }

  constructor(
    private readonly _limit?: number,
    private readonly _offset?: number,
  ) {}
}
