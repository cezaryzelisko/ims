class NumericColumnTransformer {
  to(data: number): number {
    return data;
  }

  from(data: string): number {
    return parseFloat(data);
  }
}

export const numericColumnTransformer = new NumericColumnTransformer();
