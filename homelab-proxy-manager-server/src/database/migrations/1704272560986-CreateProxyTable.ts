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
            { name: 'forward_type', type: 'varchar', length: '191' },
            { name: 'forward_ip', type: 'varchar', length: '191' },
            { name: 'forward_port', type: 'varchar', length: '191' },
            { name: 'forward_https', type: 'BOOLEAN' },
            { name: 'domain', type: 'TEXT', length: '191' },
            { name: 'name', type: 'TEXT', length: '191' },
            { name: 'status', type: 'INTEGER' },
            { name: 'supports_https', type: 'BOOLEAN' }
          ],
        });
    
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('proxies');
    }

}
