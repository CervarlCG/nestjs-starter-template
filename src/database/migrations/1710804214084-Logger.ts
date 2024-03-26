import { MigrationInterface, QueryRunner } from "typeorm";
import { commonTableScheme } from "./common";

export class Logger1710804214084 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            CREATE TABLE IF NOT EXISTS logs (
                ${commonTableScheme}
                requestId CHAR(36) NOT NULL,
                message TEXT NOT NULL,
                level ENUM('INFO', 'WARNING', 'ERROR') NOT NULL,
                trace TEXT NOT NULL,

                INDEX(requestId),
                INDEX(level)
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DROP TABLE IF EXISTS logs;`);
    }

}
