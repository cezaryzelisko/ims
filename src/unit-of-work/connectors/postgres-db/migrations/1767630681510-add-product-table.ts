/* eslint-disable quotes */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductTable1767630681510 implements MigrationInterface {
  name = 'AddProductTable1767630681510';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "description" character varying(50) NOT NULL, "price" numeric NOT NULL, "stock" integer NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
