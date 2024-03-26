import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAuth1711243299992 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE users ADD COLUMN refreshToken VARCHAR(512) null;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE users DROP COLUMN refreshToken
        `);
    }

}
