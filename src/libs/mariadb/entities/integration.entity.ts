import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
  } from 'typeorm';
import { IntegrationTypes } from '../../../models/integrationLog';
import { IntegrationExtInstances } from './integrationExtInstances.entity';

  export enum IntegrationStatus {
    STATUS_INCOMPLETE = -1,
    INACTIVE = 0,
    AFTER_SAVE = 1,
    ACTIVE = 2,
    SYNCHRONIZING = 3,
    DELETED = 4
  }
  
  @Index('integration_ext_instance_id', ['integrationExtInstanceId'], {})
  @Entity('integrations', { schema: 'integrations' })
  export class Integrations {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    public id!: number;
  
    @Column('int', { name: 'integration_ext_instance_id', nullable: true })
    public integrationExtInstanceId!: number | null;
  
    @Column('varchar', {
      name: 'external_instance_id',
      nullable: true,
      comment: 'the environment identifier of the organization in the external service',
      length: 255
    })
    public externalInstanceId!: string | null;
  
    @Column('int', { name: 'company_id' })
    public companyId!: number;
  
    @Column('int', {
      name: 'status',
      comment:
        '-1 - setup incomplete, 0 - inactive, 1 - after save, 2 - active, 3 - synchronizing, ' +
        '4 - deleted'
    })
    public status!: IntegrationStatus;
  
    @Column('int', { name: 'tag_id', nullable: true })
    public tagId!: number | null;
  
    @Column('text', { name: 'config' })
    public config!: string;
  
    @Column('varchar', { name: 'name', length: 100 })
    public name!: IntegrationTypes;
  
    @Column('varchar', {
      name: 'caption',
      nullable: true,
      comment: 'the name that appears in the integration list (index)',
      length: 50
    })
    public caption!: string | null;
  
    @Column('datetime', { name: 'last_import', nullable: true })
    public lastImport!: Date | null;
  
    @Column('datetime', {
      name: 'last_scheduled',
      default: () => 'CURRENT_TIMESTAMP'
    })
    public lastScheduled!: Date;
  
    @Column('datetime', { name: 'created' })
    public created!: Date;
  
    @Column('datetime', { name: 'modified' })
    public modified!: Date;
  
    @ManyToOne(
      () => IntegrationExtInstances,
      (integrationExtInstances) => integrationExtInstances.integrations,
      { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'integration_ext_instance_id', referencedColumnName: 'id' }])
    public integrationExtInstance!: IntegrationExtInstances;
  }
  