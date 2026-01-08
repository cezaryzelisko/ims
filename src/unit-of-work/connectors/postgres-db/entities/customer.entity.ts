import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CustomerModel, RegionEnum } from '../../../../domain';

@Entity('customer')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  username!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'enum', enum: RegionEnum })
  region!: RegionEnum;

  static fromDomain(model: CustomerModel): CustomerEntity {
    const entity = new CustomerEntity();
    entity.id = model.id!;
    entity.passwordHash = model.passwordHash!;
    entity.region = model.region;
    entity.username = model.username;

    return entity;
  }

  static toDomain(entity?: CustomerEntity | null): CustomerModel | null {
    if (!entity) {
      return null;
    }

    return new CustomerModel({
      id: entity.id,
      passwordHash: entity.passwordHash,
      region: entity.region,
      username: entity.username,
    });
  }
}
