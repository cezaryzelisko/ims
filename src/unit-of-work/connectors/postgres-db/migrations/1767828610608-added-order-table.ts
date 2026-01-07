/* eslint-disable quotes */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedOrderTable1767828610608 implements MigrationInterface {
  name = 'AddedOrderTable1767828610608';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" numeric NOT NULL, "customerId" uuid, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_products_product" ("orderId" uuid NOT NULL, "productId" uuid NOT NULL, CONSTRAINT "PK_59f5d41216418eba313ed3c7d7c" PRIMARY KEY ("orderId", "productId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_1f9ea0b0e59e0d98ade4f2d5e9" ON "order_products_product" ("orderId") `);
    await queryRunner.query(`CREATE INDEX "IDX_d6c66c08b9c7e84a1b657797df" ON "order_products_product" ("productId") `);
    await queryRunner.query(
      `CREATE TYPE "public"."product_category_enum" AS ENUM('Books', 'Clothes', 'Electronics', 'Furnitures')`,
    );
    await queryRunner.query(`DELETE FROM "product"`);
    await queryRunner.query(`ALTER TABLE "product" ADD "category" "public"."product_category_enum" NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_products_product" ADD CONSTRAINT "FK_1f9ea0b0e59e0d98ade4f2d5e99" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_products_product" ADD CONSTRAINT "FK_d6c66c08b9c7e84a1b657797dff" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order_products_product" DROP CONSTRAINT "FK_d6c66c08b9c7e84a1b657797dff"`);
    await queryRunner.query(`ALTER TABLE "order_products_product" DROP CONSTRAINT "FK_1f9ea0b0e59e0d98ade4f2d5e99"`);
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_124456e637cca7a415897dce659"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "category"`);
    await queryRunner.query(`DROP TYPE "public"."product_category_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d6c66c08b9c7e84a1b657797df"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1f9ea0b0e59e0d98ade4f2d5e9"`);
    await queryRunner.query(`DROP TABLE "order_products_product"`);
    await queryRunner.query(`DROP TABLE "order"`);
  }
}
