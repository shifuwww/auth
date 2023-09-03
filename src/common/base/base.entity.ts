import { BaseDto, BaseInterface } from 'src/common/base';
import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export abstract class BaseEntity implements BaseInterface {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;

  absorbFromDto(dto: BaseDto) {
    dto.getKeys().forEach((key: string) => {
      this[key] = dto[key];
    });
    return this;
  }

  toDto<T extends BaseDto>(dto: T): T {
    this.getKeys().forEach((key: string) => {
      dto[key] = this[key];
    });
    return dto;
  }

  private getKeys() {
    return Object.keys(this);
  }
}
