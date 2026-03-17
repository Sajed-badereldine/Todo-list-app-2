import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerificationAndPasswordReset1710000000002 implements MigrationInterface {
  name = 'AddEmailVerificationAndPasswordReset1710000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "isEmailVerified" boolean NOT NULL DEFAULT false,
      ADD COLUMN "emailVerificationToken" character varying(255),
      ADD COLUMN "emailVerificationExpires" TIMESTAMP WITH TIME ZONE,
      ADD COLUMN "passwordResetToken" character varying(255),
      ADD COLUMN "passwordResetExpires" TIMESTAMP WITH TIME ZONE
    `);

    await queryRunner.query(`
      UPDATE "users"
      SET "isEmailVerified" = true
      WHERE "email" = 'demo@example.com'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "passwordResetExpires",
      DROP COLUMN "passwordResetToken",
      DROP COLUMN "emailVerificationExpires",
      DROP COLUMN "emailVerificationToken",
      DROP COLUMN "isEmailVerified"
    `);
  }
}
