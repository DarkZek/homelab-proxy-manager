import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { ProxyDestinationType } from '@api/types/ProxyDestinationType';
import { ProxyStatus } from '../../types/ProxyStatus';

@Entity({ name: 'proxies' })
export class Proxy extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column("varchar", { length: "50" })
  forward_type: ProxyDestinationType;

  @Column()
  forward_ip: string;

  @Column()
  forward_port: string;

  @Column("simple-array", { array: true })
  domains: string[];

  @Column("integer")
  status: ProxyStatus;
}
