import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCertificatesTable1705394919695 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
          name: 'certificates',
          columns: [
            {
              name: 'id',
              type: 'INTEGER',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'domain', type: 'varchar', length: '191' },
            { name: 'expires', type: 'TEXT' },
          ],
        });
    
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('certificates');
    }

}
