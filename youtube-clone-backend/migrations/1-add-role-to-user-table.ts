import { MigrationInterface, QueryRunner } from 'typeorm';

// TODO works fine but probably better to rely on queryRunner methods over raw sql
export class Migrations1720906556559 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "role_entity" (
                "id" SERIAL NOT NULL,
                "role" character varying NOT NULL,
                CONSTRAINT "UQ_user_role_role" UNIQUE ("role"),
                CONSTRAINT "PK_user_role_id" PRIMARY KEY ("id")
            )
        `);

        // Not sure about this roleId. It should be added by TypeORM for handling the foreign key relation,
        // but we have to add it manually here to add the constraint in the 3rd query?
        await queryRunner.query(`
            ALTER TABLE "user_entity"
            ADD "roleId" integer
        `);

        await queryRunner.query(`
            ALTER TABLE "user_entity"
            ADD CONSTRAINT "FK_user_entity_role" FOREIGN KEY ("roleId") REFERENCES "role_entity"("id") 
                ON DELETE NO ACTION 
                ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_entity" DROP CONSTRAINT "FK_user_entity_role"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_entity" DROP COLUMN "roleId"`,
        );
        await queryRunner.query(`DROP TABLE "role_entity"`);
    }
}
