import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Integrations } from './integration.entity';

@Index('company_id', ['companyId'], {})
@Entity('integration_ext_instances', { schema: 'integrations' })
export class IntegrationExtInstances {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id!: number;

  @Column('varchar', {
    name: 'external_instance_id',
    comment: 'id of org/workspace in the external integration service',
    length: 255
  })
  public externalInstanceId!: string;

  @Column('varchar', { name: 'instance_url', nullable: true, length: 256 })
  public instanceUrl!: string | null;

  @Column('int', { name: 'company_id' })
  public companyId!: number;

  @Column('varchar', { name: 'refresh_token', nullable: true, length: 1024 })
  public refreshToken!: string | null;

  @Column('varchar', { name: 'access_token', nullable: true, length: 2048 })
  public accessToken!: string | null;

  @Column('bigint', { name: 'token_expiration', nullable: true })
  public tokenExpiration!: string | null;

  @Column('datetime', { name: 'created' })
  public created!: Date;

  @Column('datetime', { name: 'updated' })
  public updated!: Date;

  @OneToMany(() => Integrations, (integrations) => integrations.integrationExtInstance)
  public integrations!: Integrations[];
}
