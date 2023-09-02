import { PRIMARY_KEY_METADATA_KEY } from '../../../const/redis.const';

export function PrimaryKey(): PropertyDecorator {
  return function (target: Record<string, unknown>, propertyName: string) {
    const classReference = target.constructor;

    const decoratedField: string = Reflect.getOwnMetadata(
      PRIMARY_KEY_METADATA_KEY,
      classReference,
    );

    if (decoratedField) {
      throw new Error(
        `You can't decorate multiple values as redis primary key; context - ${classReference.name}`,
      );
    }

    Reflect.defineMetadata(
      PRIMARY_KEY_METADATA_KEY,
      propertyName,
      classReference,
    );
  };
}
