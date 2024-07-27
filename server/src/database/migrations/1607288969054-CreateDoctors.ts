import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDoctors1607288969054 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'doctors',
        columns: [
          {
            name: 'id',
            type: 'varchar',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '120',
          },
          {
            name: 'crm',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'phone_number',
            type: 'varchar',
          },
          {
            name: 'cellphone_number',
            type: 'varchar',
          },
          {
            name: 'cep',
            type: 'varchar',
          },
          {
            name: 'street',
            type: 'varchar',
          },
          {
            name: 'state',
            type: 'varchar',
          },
          {
            name: 'city',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('doctors');
  }
}
