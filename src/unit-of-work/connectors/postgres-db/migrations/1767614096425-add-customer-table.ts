/* eslint-disable quotes */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerTable1767614096425 implements MigrationInterface {
  name = 'AddCustomerTable1767614096425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."customer_region_enum" AS ENUM('Asia', 'Europe', 'US')`);
    await queryRunner.query(
      `CREATE TABLE "customer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "passwordHash" character varying NOT NULL, "region" "public"."customer_region_enum" NOT NULL, CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "customer"`);
    await queryRunner.query(`DROP TYPE "public"."customer_region_enum"`);
  }
}
