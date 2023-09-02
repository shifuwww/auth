import { BaseEntity } from 'src/common/base';
import { UserInterface } from 'src/shared';
import { Column, Entity } from 'typeorm';

@Entity()
export class UserEntity extends BaseEntity implements UserInterface {
  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', unique: true })
  email: string;
}
