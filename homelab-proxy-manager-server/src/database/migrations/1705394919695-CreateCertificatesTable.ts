import {MigrationInterface, QueryRunner, Table, TableUnique} from "typeorm";

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
            { name: 'autorenew', type: 'INTEGER' },
          ],
        });
        
        table.addUniqueConstraint(new TableUnique({ columnNames: ['domain'] }));
    
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('certificates');
    }

}
