import { BaseEntity } from 'src/common/base/base.entity';
import { Repository } from 'typeorm';

export abstract class BaseService<Entity extends BaseEntity> {
  constructor(private readonly _genericRepository: Repository<Entity>) {}

  async getOneById(id: any, selected?: any, relations?: any): Promise<Entity> {
    return this._genericRepository.findOneOrFail({
      ...(selected ? { select: selected } : {}),
      where: { id },
      ...(relations ? { relations: relations } : {}),
    });
  }
}
