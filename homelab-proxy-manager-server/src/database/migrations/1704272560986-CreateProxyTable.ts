import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateProxyTable1704272560986 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
          name: 'proxies',
          columns: [
            {
              name: 'id',
              type: 'INTEGER',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'destinationType', type: 'varchar', length: '191' },
            { name: 'forwardIp', type: 'varchar', length: '191' },
            { name: 'forwardPort', type: 'varchar', length: '191' },
            { name: 'forwardHttps', type: 'BOOLEAN' },
            { name: 'domain', type: 'TEXT', length: '191' },
            { name: 'name', type: 'TEXT', length: '191' },
            { name: 'status', type: 'INTEGER' },
            { name: 'supportsHttps', type: 'BOOLEAN' }
          ],
        });
    
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('proxies');
    }

}
