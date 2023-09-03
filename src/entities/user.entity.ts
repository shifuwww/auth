import { BaseEntity } from '../common/base/base.entity';
import { UserRoleEnum } from 'src/shared/enums';
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

  @Column({ type: 'varchar', default: null })
  token: string;

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.User })
  role: UserRoleEnum;
}
