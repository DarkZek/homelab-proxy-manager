import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { ProxyDestinationType } from '@api/types/ProxyDestinationType';
import { ProxyStatus } from '../../types/ProxyStatus';

@Entity({ name: 'proxies' })
export class Proxy extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column("varchar", { length: "50" })
  forward_type: ProxyDestinationType;

  @Column("varchar", { length: "191" })
  forward_ip: string;

  @Column()
  forward_port: string;

  @Column("boolean", { default: false })
  forward_https: boolean;

  @Column()
  domain: string;

  @Column("boolean", { default: true })
  supports_https: boolean;

  @Column("integer")
  status: ProxyStatus;
}
