import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTodoPosition1710000000001 implements MigrationInterface {
  name = 'AddTodoPosition1710000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "todos"
      ADD COLUMN IF NOT EXISTS "position" integer NOT NULL DEFAULT 0
    `);

    await queryRunner.query(`
      WITH ordered_todos AS (
        SELECT "id", ROW_NUMBER() OVER (
          PARTITION BY "userId"
          ORDER BY "createdAt" ASC, "id" ASC
        ) - 1 AS "nextPosition"
        FROM "todos"
      )
      UPDATE "todos" AS todos
      SET "position" = ordered_todos."nextPosition"
      FROM ordered_todos
      WHERE todos."id" = ordered_todos."id"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "todos"
      DROP COLUMN IF EXISTS "position"
    `);
  }
}
