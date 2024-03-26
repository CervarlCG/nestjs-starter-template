import { MigrationInterface, QueryRunner } from "typeorm";

export class User1710722186112 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            CREATE TABLE users (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                firstName VARCHAR(50) NOT NULL,
                lastName VARCHAR(50) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(72) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deletedAt TIMESTAMP NULL
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DROP TABLE users`)
    }

}
