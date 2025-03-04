import { MigrationInterface, QueryRunner } from "typeorm";

export class RefreshToken1677760064598 implements MigrationInterface {
    name = 'RefreshToken1677760064598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`refresh-token\` (\`id\` varchar(36) NOT NULL, \`isRevoked\` tinyint NOT NULL, \`expires\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`refresh-token\``);
    }

}
