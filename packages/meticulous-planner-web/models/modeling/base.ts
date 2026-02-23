import { Description } from './description';
import { Model } from './model';
import { Service } from './service';
import { TypeParameter } from './type-parameter';
import { Language, ModelId, ServiceId, SystemId, Stereotype, TypeParameterId } from './values';

export function buildBaseService(systemId: SystemId) {
  return Service.create({
    id: ServiceId('base'),
    systemId,
    isBase: true,
    descriptions: { [Language.Chinese]: Description.create({ name: '基礎服務', language: Language.Chinese }) },
  });
}

export function buildBaseModels(systemId: SystemId) {
  return [
    Model.create({
      id: ModelId('base-string'),
      systemId: systemId,
      serviceId: ServiceId('base'),
      stereotype: Stereotype.ValueObject,
      descriptions: { [Language.Chinese]: Description.create({ name: '文字', language: Language.Chinese }) },
    }),
    Model.create({
      id: ModelId('base-integer'),
      systemId: systemId,
      serviceId: ServiceId('base'),
      stereotype: Stereotype.ValueObject,
      descriptions: { [Language.Chinese]: Description.create({ name: '整數', language: Language.Chinese }) },
    }),
    Model.create({
      id: ModelId('base-decimal'),
      systemId: systemId,
      serviceId: ServiceId('base'),
      stereotype: Stereotype.ValueObject,
      descriptions: {
        [Language.Chinese]: Description.create({ name: '有小數點的數字', language: Language.Chinese }),
      },
    }),
    Model.create({
      id: ModelId('base-boolean'),
      systemId: systemId,
      serviceId: ServiceId('base'),
      stereotype: Stereotype.ValueObject,
      descriptions: { [Language.Chinese]: Description.create({ name: '是或否', language: Language.Chinese }) },
    }),
    Model.create({
      id: ModelId('base-date'),
      systemId: systemId,
      serviceId: ServiceId('base'),
      stereotype: Stereotype.ValueObject,
      descriptions: { [Language.Chinese]: Description.create({ name: '日期', language: Language.Chinese }) },
    }),
    Model.create({
      id: ModelId('base-datetime'),
      systemId: systemId,
      serviceId: ServiceId('base'),
      stereotype: Stereotype.ValueObject,
      descriptions: { [Language.Chinese]: Description.create({ name: '日期時間', language: Language.Chinese }) },
    }),
    Model.create({
      id: ModelId('base-time'),
      systemId: systemId,
      serviceId: ServiceId('base'),
      stereotype: Stereotype.ValueObject,
      descriptions: { [Language.Chinese]: Description.create({ name: '時間', language: Language.Chinese }) },
    }),
    Model.create({
      id: ModelId('base-awaitable'),
      systemId: systemId,
      serviceId: ServiceId('base'),
      stereotype: Stereotype.ValueObject,
      descriptions: {
        [Language.Chinese]: Description.create({ name: '需等待的模型', language: Language.Chinese }),
      },
      typeParameters: [
        TypeParameter.create({
          id: TypeParameterId('base-awaitable-item'),
          descriptions: {
            [Language.Chinese]: Description.create({ name: '等待的', language: Language.Chinese }),
          },
        }),
      ],
    }),
  ];
}
