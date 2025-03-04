import { MigrationInterface, QueryRunner } from "typeorm";

export class resetToken1680795153842 implements MigrationInterface {
    name = 'resetToken1680795153842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`reset-token\` (\`id\` varchar(36) NOT NULL, \`token\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`expires\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`issue-interactions\` ADD CONSTRAINT \`FK_965b77b8b2976670e2bb7037ae4\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`issue-interactions\` DROP FOREIGN KEY \`FK_965b77b8b2976670e2bb7037ae4\``);
        await queryRunner.query(`DROP TABLE \`reset-token\``);
    }

}
