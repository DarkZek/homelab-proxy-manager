import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateConfigTable1705902667800 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
          name: 'config',
          columns: [
            {
              name: 'id',
              type: 'INTEGER',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'validated', type: 'INTEGER' },
            { name: 'letsEncryptEnabled', type: 'INTEGER' },
            { name: 'caAccountUrl', type: 'TEXT' },
            { name: 'caAccountPrivateKey', type: 'TEXT' },
            { name: 'caContactEmail', type: 'TEXT' },
          ],
        });
    
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('config');
    }

}
