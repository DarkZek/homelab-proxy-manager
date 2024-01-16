import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';

@Entity({ name: 'proxies' })
export class Certificate extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  domain: string;

  @Column()
  expires: Date;
}
