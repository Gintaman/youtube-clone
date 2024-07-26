import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenTable21721971204293 implements MigrationInterface {
    name = 'AddRefreshTokenTable21721971204293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_user_entity_role"`);
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "expires" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_95ab8e7157a5bb4bc0e51aefdd2" FOREIGN KEY ("roleId") REFERENCES "role_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_95ab8e7157a5bb4bc0e51aefdd2"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_user_entity_role" FOREIGN KEY ("roleId") REFERENCES "role_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
