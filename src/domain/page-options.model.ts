export class PageOptionsModel {
  private readonly defaultLimit = 10;
  private readonly defaultOffset = 0;

  get limit(): number {
    return this._limit ?? this.defaultLimit;
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
