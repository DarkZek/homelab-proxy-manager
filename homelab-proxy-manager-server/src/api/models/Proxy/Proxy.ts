import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { ProxyDestinationType } from '@api/types/ProxyDestinationType';
import { ProxyStatus } from '../../types/ProxyStatus';

@Entity({ name: 'proxies' })
export class Proxy extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @Column("varchar", { length: "50" })
  destinationType: ProxyDestinationType;

  @Column("varchar", { length: "191" })
  forwardIp: string;

  @Column()
  forwardPort: string;

  @Column("boolean", { default: false })
  forwardHttps: boolean;

  @Column({ unique: true })
  domain: string;

  @Column("boolean", { default: true })
  supportsHttps: boolean;

  @Column("integer")
  status: ProxyStatus;
}
