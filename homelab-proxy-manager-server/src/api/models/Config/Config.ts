import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { FeatureToggle } from '@base/api/types/FeatureToggle';

@Entity({ name: 'config' })
export class Config extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column("boolean", { default: false })
  validated: boolean = false;

  @Column("integer", { default: 0 })
  letsEncryptEnabled: FeatureToggle = FeatureToggle.Unset;

  @Column("varchar")
  caAccountUrl: string = '';

  @Column("varchar")
  caAccountPrivateKey: string = '';

  @Column("varchar")
  caContactEmail: string = '';
}
