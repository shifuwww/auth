import { BaseEntity } from 'src/common/base';
import { UserRole } from 'src/shared/enums';
import { UserInterface } from 'src/shared/interfaces';
import { Column, Entity } from 'typeorm';

@Entity()
export class UserEntity extends BaseEntity implements UserInterface {
  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;
}
