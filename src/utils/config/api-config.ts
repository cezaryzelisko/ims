export interface ApiConfig {
  readonly port: number;
  readonly isProductionEnv: boolean;
  readonly secret: string;
}
